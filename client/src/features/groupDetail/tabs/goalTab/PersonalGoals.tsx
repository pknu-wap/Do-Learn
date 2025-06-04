import { useEffect, useState } from 'react';
import {
	getWeeklyPlans,
	createOrUpdateWeeklyPlan,
	updatePersonalCompletion,
	deletePersonalTask,
} from 'api/personalGoalsApi';
import WeeklyGoalModal from './WeeklyGoalModal';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './PersonalGoals.scss';
import { WeeklyPlanRequest } from 'types/personalGoalTypes';

interface Task {
	taskId: number;
	subGoalId?: number;
	content: string;
	completed: boolean;
}

interface DayPlan {
	date: string;
	weekday: string;
	dayOfWeek: string;
	tasks: Task[];
}

const PersonalGoals = ({ studyGroupId }: { studyGroupId: number }) => {
	const [referenceDate] = useState('2025-06-04');
	const [weeklyPlans, setWeeklyPlans] = useState<DayPlan[]>([]);
	const [initialPlans, setInitialPlans] = useState<DayPlan[]>([]);
	const [showModal, setShowModal] = useState(false);
	const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
	const [isEditMode, setIsEditMode] = useState(false);

	const formatDateKOR = (dateStr: string): string => (dateStr ? dateStr.slice(2).replace(/-/g, '.') : '');

	useEffect(() => {
		fetchPlans();
	}, []);

	const fetchPlans = async () => {
		try {
			const res = await getWeeklyPlans(studyGroupId, referenceDate);
			console.log('✅ [조회 응답] 개인 목표 + 공통 목표:', res);

			const { memberWeeklyPlans, personalTasks } = res;
			const all = [...memberWeeklyPlans, ...personalTasks];
			const grouped: Record<string, { date: string; tasks: Task[] }> = {};

			all.forEach((item: any) => {
				const serverDayOfWeek = item.dayOfWeek;
				const isSubGoal = 'subGoalContent' in item;
				const content = isSubGoal ? item.subGoalContent : item.content;
				const task: Task = {
					taskId: item.id,
					subGoalId: isSubGoal ? item.subGoalId : undefined,
					content,
					completed: item.completed,
				};
				if (!grouped[serverDayOfWeek]) {
					grouped[serverDayOfWeek] = { date: item.date, tasks: [] };
				}
				grouped[serverDayOfWeek].tasks.push(task);
			});

			const fullWeek: DayPlan[] = Array.from({ length: 7 }, (_, idx) => {
				const dateStr = getDateByStart(referenceDate, idx);
				const realDayOfWeek = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
				if (grouped[realDayOfWeek]) {
					return {
						date: grouped[realDayOfWeek].date,
						weekday: `${idx + 1}일 차`,
						dayOfWeek: realDayOfWeek,
						tasks: grouped[realDayOfWeek].tasks,
					};
				}
				return {
					date: dateStr,
					weekday: `${idx + 1}일 차`,
					dayOfWeek: realDayOfWeek,
					tasks: [],
				};
			});
			setWeeklyPlans(fullWeek);
			setInitialPlans(fullWeek);
		} catch {
			setWeeklyPlans(getDefaultWeeklyPlans());
		}
	};

	const handleCheckboxToggle = async (taskId: number, completed: boolean) => {
		await updatePersonalCompletion(taskId, completed);
		await fetchPlans();
	};

	const handleOpenModal = (dayIndex: number) => {
		setSelectedDayIndex(dayIndex);
		setShowModal(true);
	};

	const handleDeleteTask = (taskId: number, dayIndex: number) => {
		setWeeklyPlans((prev) =>
			prev.map((day, idx) => {
				if (idx === dayIndex) {
					return {
						...day,
						tasks: day.tasks.filter((t) => t.taskId !== taskId),
					};
				}
				return day;
			}),
		);
	};

	const handleConfirmUpdate = async () => {
		if (!isEditMode) {
			setIsEditMode(true);
			return;
		}

		const isUnchanged =
			JSON.stringify(weeklyPlans.map((d) => d.tasks.map((t) => [t.taskId, t.completed]))) ===
			JSON.stringify(initialPlans.map((d) => d.tasks.map((t) => [t.taskId, t.completed])));

		if (isUnchanged) {
			alert('변경된 내용이 없습니다.');
			setIsEditMode(false);
			return;
		}

		if (!isEditMode) {
			setIsEditMode(true);
			return;
		}
		if (JSON.stringify(weeklyPlans) === JSON.stringify(initialPlans)) {
			setIsEditMode(false);
			return;
		}

		const memberGoalPlans: WeeklyPlanRequest['memberGoalPlans'] = [];
		const personalTaskPlans: WeeklyPlanRequest['personalTaskPlans'] = [];

		weeklyPlans.forEach((day, idx) => {
			const initialDay = initialPlans[idx];

			// 삭제 포함까지 체크하는 비교
			const isTasksUnchanged =
				JSON.stringify(day.tasks.map((t) => [t.taskId, t.completed])) ===
				JSON.stringify(initialDay.tasks.map((t) => [t.taskId, t.completed]));

			if (isTasksUnchanged && day.tasks.length === initialDay.tasks.length) return;

			day.tasks.forEach((task) => {
				const planDate = day.date;
				const planDayOfWeek = day.dayOfWeek;
				const plan = {
					date: planDate,
					dayOfWeek: planDayOfWeek,
					completed: task.completed,
				};

				if (task.subGoalId) {
					memberGoalPlans.push({ ...plan, subGoalId: task.subGoalId });
				} else {
					personalTaskPlans.push({ ...plan, content: task.content });
				}
			});
		});

		console.log('📦 [요청 바디] 생성/수정 payload:', {
			memberGoalPlans,
			personalTaskPlans,
		});
		await createOrUpdateWeeklyPlan(studyGroupId, referenceDate, {
			memberGoalPlans,
			personalTaskPlans,
		});
		await fetchPlans();
		setIsEditMode(false);

		// 1. 삭제된 subGoal (공통 목표)
		initialPlans.forEach((initialDay, idx) => {
			const currentDay = weeklyPlans[idx];

			const deletedSubGoals = initialDay.tasks.filter(
				(initialTask) => initialTask.subGoalId && !currentDay.tasks.some((t) => t.taskId === initialTask.taskId),
			);

			deletedSubGoals.forEach((task) => {
				memberGoalPlans.push({
					subGoalId: task.subGoalId!,
					date: initialDay.date,
					dayOfWeek: initialDay.dayOfWeek,
					completed: false,
					deleted: true,
				});
			});

			// 2. 삭제된 personalTask
			const deletedPersonalTasks = initialDay.tasks.filter(
				(initialTask) => !initialTask.subGoalId && !currentDay.tasks.some((t) => t.taskId === initialTask.taskId),
			);

			deletedPersonalTasks.forEach((task) => {
				personalTaskPlans.push({
					content: task.content,
					date: initialDay.date,
					dayOfWeek: initialDay.dayOfWeek,
					completed: false,
					deleted: true,
				});
			});
		});
	};

	const handleModalConfirm = (dayIndex: number, selectedGoals: { id: number; content: string }[]) => {
		const newTasks: Task[] = selectedGoals.map((goal) => ({
			taskId: goal.id,
			subGoalId: goal.id,
			content: goal.content,
			completed: false,
		}));
		setWeeklyPlans((prev) => {
			const updated = [...prev];
			updated[dayIndex].tasks.push(...newTasks);
			return updated;
		});
		setShowModal(false);
	};

	const getDateByStart = (startDateStr: string, dayIndex: number) => {
		const baseDate = new Date(startDateStr);
		baseDate.setDate(baseDate.getDate() + dayIndex);
		return baseDate.toISOString().split('T')[0];
	};

	const getDefaultWeeklyPlans = (): DayPlan[] => {
		return Array.from({ length: 7 }, (_, idx) => {
			const dateStr = getDateByStart(referenceDate, idx);
			const realDayOfWeek = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
			return {
				date: dateStr,
				weekday: `${idx + 1}일 차`,
				dayOfWeek: realDayOfWeek,
				tasks: [],
			};
		});
	};

	return (
		<div className="personal-goal-wrapper">
			<div className="goal-table-wrapper">
				<table className="weekly-table button2">
					<tbody>
						{weeklyPlans.map((day, idx) => (
							<tr key={idx}>
								<td className="day-label">{day.weekday}</td>
								<td className="day-tasks">
									<div className="task-date flex-right button3">{formatDateKOR(day.date)}</div>
									{day.tasks.map((task) => (
										<div key={task.taskId} className="task-row">
											<input
												type="checkbox"
												checked={task.completed}
												onChange={() => handleCheckboxToggle(task.taskId, !task.completed)}
											/>
											<span style={{ flexGrow: 1 }}>{task.content}</span>
											{isEditMode && <button onClick={() => handleDeleteTask(task.taskId, idx)}>삭제</button>}
										</div>
									))}
									{isEditMode && (
										<div className="add-more" onClick={() => handleOpenModal(idx)}>
											+ 목표 추가
										</div>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* 하단 버튼 */}
			<div className="bottom-btn">
				{isEditMode ? (
					<div className="bottom-btn">
						<button
							className="cancel-btn button2"
							onClick={() => {
								setWeeklyPlans(initialPlans); // 상태 초기화
								setIsEditMode(false);
							}}
						>
							취소
						</button>
						<button className="confirm-btn button2" onClick={handleConfirmUpdate}>
							확인
						</button>
					</div>
				) : (
					<button className="confirm-btn button2" onClick={handleConfirmUpdate}>
						수정하기
					</button>
				)}
			</div>

			{/* 목표 모달 */}
			{showModal && selectedDayIndex !== null && (
				<WeeklyGoalModal
					groupId={studyGroupId}
					dayIndex={selectedDayIndex}
					referenceDate={referenceDate}
					existingTaskIds={weeklyPlans[selectedDayIndex]?.tasks.map((t) => t.taskId) ?? []}
					onClose={() => setShowModal(false)}
					onConfirm={handleModalConfirm}
				/>
			)}
		</div>
	);
};

export default PersonalGoals;
