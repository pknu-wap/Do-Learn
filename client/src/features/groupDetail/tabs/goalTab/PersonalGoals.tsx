import { useEffect, useState } from 'react';
import {
	getWeeklyPlans,
	createOrUpdateWeeklyPlan,
	updateCommonCompletion,
	updatePersonalCompletion,
} from 'api/personalGoalsApi';
import { getCommonGoals } from 'api/commonGoalsApi';
import {
	SubGoalPlan,
	PersonalTaskPlan,
	MergedDayPlan,
} from 'types/personalGoalTypes';
import WeeklyGoalModal from './WeeklyGoalModal';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './PersonalGoals.scss';

interface Task {
	taskId: number;
	content: string;
	completed: boolean;
}

interface DayPlan {
	date: string;
	weekday: string;
	tasks: Task[];
}

const PersonalGoals = ({ studyGroupId }: { studyGroupId: number }) => {
	const [referenceDate, setReferenceDate] = useState('2025-06-03');
	const [weeklyPlans, setWeeklyPlans] = useState<DayPlan[]>([]);
	const [showModal, setShowModal] = useState(false);
	const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

	useEffect(() => {
		fetchPlans();
	}, []);

	// 📌 개인 주간 목표 및 개인 태스크를 조회하고 요일별로 정리된 상태로 setWeeklyPlans에 저장
	const fetchPlans = async () => {
		try {
			const res = await getWeeklyPlans(studyGroupId, referenceDate);
			console.log('[getWeeklyPlans] 호출', studyGroupId, referenceDate);

			// API 응답에서 두 리스트 추출
			const { memberWeeklyPlans, personalTasks } = res;

			// 두 목록을 하나로 합치고
			const all = [...memberWeeklyPlans, ...personalTasks];

			// 요일(dayOfWeek) 기준으로 묶기
			const grouped: { [dayOfWeek: string]: MergedDayPlan } = {};

			all.forEach((item) => {
				const isSubGoal = 'subGoalContent' in item;
				const content = isSubGoal ? item.subGoalContent : item.content;

				if (!grouped[item.dayOfWeek]) {
					grouped[item.dayOfWeek] = {
						dayOfWeek: item.dayOfWeek,
						weekday: item.dayOfWeek,
						date: item.date,
						tasks: [],
					};
				}

				grouped[item.dayOfWeek].tasks.push({
					taskId: item.id,
					content,
					completed: item.completed,
				});
			});

			// 날짜 오름차순 정렬
			const ordered = Object.values(grouped).sort(
				(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
			);

			setWeeklyPlans(ordered);
		} catch (err) {
			console.error(err);
			setWeeklyPlans([]); // 조회 실패 시 빈 UI라도 표시
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

	const handleConfirmUpdate = async () => {
		const payload = {
			plans: weeklyPlans.map((day) => ({
				date: day.date,
				taskIds: day.tasks.map((task) => task.taskId),
			})),
		};
		await createOrUpdateWeeklyPlan(studyGroupId, referenceDate, payload);
		await fetchPlans();
	};

	return (
		<div className="personal-goal-wrapper">
			<table className="weekly-table">
				<tbody>
					{weeklyPlans.map((day, idx) => (
						<tr key={idx}>
							<td className="day-label">{day.weekday}</td>
							<td className="day-tasks">
								{day.tasks.length === 0 ? (
									<div
										className="empty-task"
										onClick={() => handleOpenModal(idx)}
									>
										+ 목표 선택
									</div>
								) : (
									<>
										{day.tasks.map((task) => (
											<div key={task.taskId} className="task-row">
												<input
													type="checkbox"
													checked={task.completed}
													onChange={() =>
														handleCheckboxToggle(task.taskId, !task.completed)
													}
												/>
												<span>{task.content}</span>
											</div>
										))}
										<div
											className="add-more"
											onClick={() => handleOpenModal(idx)}
										>
											+ 목표 추가
										</div>
									</>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<button className="confirm-btn" onClick={handleConfirmUpdate}>
				수정하기
			</button>

			{showModal && selectedDayIndex !== null && (
				<WeeklyGoalModal
					groupId={studyGroupId}
					dayIndex={selectedDayIndex}
					referenceDate={referenceDate}
					onClose={() => {
						setShowModal(false);
						fetchPlans();
					}}
				/>
			)}
		</div>
	);
};

export default PersonalGoals;
