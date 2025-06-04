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
	date: string;
	dayOfWeek: string;
}

interface DayPlan {
	date: string;
	weekday: string;
	dayOfWeek: string;
	tasks: Task[];
}

const PersonalGoals = ({ studyGroupId }: { studyGroupId: number }) => {
	const [referenceDate, setReferenceDate] = useState('');
	const [weeklyPlans, setWeeklyPlans] = useState<DayPlan[]>([]);
	const [initialPlans, setInitialPlans] = useState<DayPlan[]>([]);
	const [showModal, setShowModal] = useState(false);
	const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
	const [isEditMode, setIsEditMode] = useState(false);

	const formatDateKOR = (dateStr: string): string => (dateStr ? dateStr.slice(2).replace(/-/g, '.') : '');

	useEffect(() => {
		const localKey = `commonGoalStartInfo-${studyGroupId}`;
		const startInfoRaw = localStorage.getItem(localKey);
		if (!startInfoRaw) {
			alert('공통 목표를 먼저 생성해주세요.');
			return;
		}
		const startInfo = JSON.parse(startInfoRaw);
		setReferenceDate(startInfo.startDate); // 공통 목표 시작일을 기준으로 설정
	}, [studyGroupId]);

	useEffect(() => {
		if (referenceDate) {
			fetchPlans();
		}
	}, [referenceDate]);

	const fetchPlans = async () => {
		try {
			const res = await getWeeklyPlans(studyGroupId, referenceDate);
			console.log('조회 응답:', res);

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
					date: item.date,
					dayOfWeek: item.dayOfWeek,
				};
				if (!grouped[serverDayOfWeek]) {
					grouped[serverDayOfWeek] = { date: item.date, tasks: [] };
				}
				grouped[serverDayOfWeek].tasks.push(task);
			});

			const fullWeek: DayPlan[] = Array.from({ length: 7 }, (_, idx) => {
				const dateStr = getDateByStart(referenceDate, idx);
				const realDayOfWeek = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
				const groupedData = grouped?.[realDayOfWeek];

				return {
					date: groupedData?.date ?? dateStr,
					weekday: `${idx + 1}일 차`,
					dayOfWeek: realDayOfWeek,
					tasks: groupedData?.tasks ?? [], // undefined 방지
				};
			});
			setWeeklyPlans(fullWeek);
			setInitialPlans(fullWeek);
		} catch (err) {
			console.error('[fetchPlans] 조회 실패:', err);
			const fallback = getDefaultWeeklyPlans();
			setWeeklyPlans(fallback);
			setInitialPlans(fallback); // 🔥 이 줄이 꼭 필요합니다
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
		const localKey = `commonGoalStartInfo-${studyGroupId}`;
		const startInfoRaw = localStorage.getItem(localKey);

		if (!startInfoRaw) {
			alert('공통 목표를 먼저 생성해주세요.');
			return;
		}

		const isUnchanged = JSON.stringify(weeklyPlans) === JSON.stringify(initialPlans);
		const memberGoalPlans: WeeklyPlanRequest['memberGoalPlans'] = [];
		const personalTaskPlans: WeeklyPlanRequest['personalTaskPlans'] = [];

		weeklyPlans.forEach((day, idx) => {
			const initialDay = initialPlans[idx];
			if (!initialDay || !Array.isArray(day.tasks) || !Array.isArray(initialDay.tasks)) return;

			// 삭제 포함까지 체크하는 비교
			const isTasksUnchanged =
				JSON.stringify(day.tasks.map((t) => [t.taskId, t.completed])) ===
				JSON.stringify(initialDay.tasks.map((t) => [t.taskId, t.completed]));

			if (isTasksUnchanged && day.tasks.length === initialDay.tasks.length) return;

			day.tasks.forEach((task) => {
				const plan = {
					date: task.date,
					dayOfWeek: task.dayOfWeek,
					completed: task.completed,
				};

				if (task.subGoalId) {
					memberGoalPlans.push({ ...plan, subGoalId: task.subGoalId });
				}
			});
		});

		console.log('요청 바디:', {
			memberGoalPlans,
			personalTaskPlans,
		});

		// 1. 삭제된 subGoal (공통 목표) + personalTask (개인 목표)
		const initialMap = new Map(initialPlans.map((day) => [day.dayOfWeek, day]));
		const currentMap = new Map(weeklyPlans.map((day) => [day.dayOfWeek, day]));
		const allDayOfWeeks = new Set([...Array.from(initialMap.keys()), ...Array.from(currentMap.keys())]);

		Array.from(allDayOfWeeks).forEach((dayOfWeek) => {
			const initialDay = initialMap.get(dayOfWeek);
			const currentDay = currentMap.get(dayOfWeek);

			if (!initialDay || !currentDay) return;
			if (initialDay.tasks.length === 0) return;
			if (!currentDay.tasks || !Array.isArray(currentDay.tasks)) return;

			// 공통 목표 삭제 확인
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

			// 개인 목표 삭제 확인
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
		console.log('🧩 전체 weeklyPlans:', weeklyPlans);
		console.log('🧩 전체 initialPlans:', initialPlans);
		console.log(
			'📤 보낼 요청 바디:',
			JSON.stringify(
				{
					memberGoalPlans,
					personalTaskPlans,
				},
				null,
				2,
			),
		);

		try {
			await createOrUpdateWeeklyPlan(studyGroupId, referenceDate, {
				memberGoalPlans,
				personalTaskPlans,
			});
			console.log('✅ 생성/수정 성공');
		} catch (err: any) {
			console.error('❌ 생성/수정 실패:', err.response?.data || err.message || err);
		}

		await fetchPlans();
		setIsEditMode(false);
	};

	const handleEnterEditMode = () => {
		const localKey = `commonGoalStartInfo-${studyGroupId}`;
		const startInfoRaw = localStorage.getItem(localKey);

		if (!startInfoRaw) {
			alert('공통 목표를 먼저 생성해주세요.');
			return;
		}
		setIsEditMode(true);
	};

	const handleCancelEdit = () => {
		setWeeklyPlans(initialPlans);
		setIsEditMode(false);
	};

	const handleModalConfirm = (dayIndex: number, selectedGoals: { id: number; content: string }[]) => {
		const dayPlan = weeklyPlans[dayIndex];
		const newTasks: Task[] = selectedGoals.map((goal) => ({
			taskId: goal.id,
			subGoalId: goal.id,
			content: goal.content,
			completed: false,
			date: dayPlan.date,
			dayOfWeek: dayPlan.dayOfWeek,
		}));

		const updated = [...weeklyPlans];
		updated[dayIndex].tasks.push(...newTasks);
		setWeeklyPlans(updated);

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
											{(!isEditMode || !task.subGoalId) && (
												<input
													type="checkbox"
													checked={task.completed}
													onChange={() => handleCheckboxToggle(task.taskId, !task.completed)}
												/>
											)}
											<span style={{ flexGrow: 1 }}>{task.content}</span>
											{isEditMode && (
												<button className="x-btn button2" onClick={() => handleDeleteTask(task.taskId, idx)}>
													x
												</button>
											)}
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
						<div className="bottom-btn">
							<button className="cancel-btn button2" onClick={handleCancelEdit}>
								취소
							</button>
							<button className="confirm-btn button2" onClick={handleConfirmUpdate}>
								확인
							</button>
						</div>
					</div>
				) : (
					<button className="confirm-btn button2" onClick={handleEnterEditMode}>
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
