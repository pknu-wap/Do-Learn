import { useEffect, useState } from 'react';
import {
	getWeeklyPlans,
	createOrUpdateWeeklyPlan,
	updateCommonCompletion,
	updatePersonalCompletion,
} from 'api/personalGoalsApi';
import { getCommonGoals } from 'api/commonGoalsApi';
import { SubGoalPlan, PersonalTaskPlan, MergedDayPlan } from 'types/personalGoalTypes';
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
	const [referenceDate, setReferenceDate] = useState('2025-06-04');
	const [weeklyPlans, setWeeklyPlans] = useState<DayPlan[]>([]);
	const [showModal, setShowModal] = useState(false);
	const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedSubGoalsMap, setSelectedSubGoalsMap] = useState<Record<number, { id: number; content: string }[]>>({});

	const formatDateKOR = (dateStr: string): string => (dateStr ? dateStr.slice(2).replace(/-/g, '.') : '');

	useEffect(() => {
		fetchPlans();
	}, []);

	useEffect(() => {
		if (weeklyPlans.length === 0) {
			setWeeklyPlans(getDefaultWeeklyPlans());
		}
	}, [weeklyPlans]);

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
			const ordered = Object.values(grouped).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

			setWeeklyPlans(ordered);
		} catch (err) {
			// console.error(err);
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
		if (!isEditMode) {
			setIsEditMode(true); // 수정 모드 진입
			return;
		}

		// memberGoalPlans 구성
		const memberGoalPlans = Object.entries(selectedSubGoalsMap).flatMap(([dayIndex, goals]) => {
			const dayPlan = weeklyPlans[Number(dayIndex)];

			// 날짜, 요일이 없는 경우 예외 처리 (기본값 또는 로컬스토리지에서 계산 필요)
			if (!dayPlan?.date) return [];

			const dateStr = dayPlan.date; // 예: "2025-05-21"
			const dayOfWeek = dayPlan.weekday.toUpperCase(); // 예: "WEDNESDAY"

			return goals.map((goal) => ({
				subGoalId: goal.id,
				date: dateStr,
				dayOfWeek,
				completed: false,
			}));
		});

		// 요청 payload 구성
		const payload = {
			memberGoalPlans,
			personalTaskPlans: [], // 비워서 보내도 됨(임시)
		};

		await createOrUpdateWeeklyPlan(studyGroupId, referenceDate, payload);
		await fetchPlans();
		setIsEditMode(false); // 수정 모드 종료
	};

	const handleModalConfirm = (dayIndex: number, selectedGoals: { id: number; content: string }[]) => {
		// 1. weeklyPlans 업데이트 (화면에 즉시 반영)
		const newTaskObjs = selectedGoals.map((goal) => ({
			taskId: goal.id,
			content: goal.content,
			completed: false,
		}));

		setWeeklyPlans((prev) => {
			const updated = [...prev];

			if (!updated[dayIndex]) {
				const weekdayLabel = `${dayIndex + 1}일 차`;
				updated[dayIndex] = {
					date: '',
					weekday: weekdayLabel,
					tasks: [],
				};
			}

			updated[dayIndex] = {
				...updated[dayIndex],
				tasks: [...updated[dayIndex].tasks, ...newTaskObjs],
			};

			return updated;
		});

		// 🟡 2. 나중에 API 요청용으로 따로 저장
		setSelectedSubGoalsMap((prev) => ({
			...prev,
			[dayIndex]: selectedGoals,
		}));

		setShowModal(false);
	};

	// 날짜 계산
	const getDateByStart = (startDateStr: string, dayIndex: number) => {
		const baseDate = new Date(startDateStr); // 한국 시간 기준이면 KST 고려 필요
		baseDate.setDate(baseDate.getDate() + dayIndex);
		return baseDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
	};

	// 기본 데이터 함수
	const getDefaultWeeklyPlans = (): DayPlan[] => {
		const labels = ['1일 차', '2일 차', '3일 차', '4일 차', '5일 차', '6일 차', '7일 차'];

		return labels.map((label) => ({
			weekday: label,
			date: '', // 날짜가 있으면 표시, 없으면 생략
			tasks: [],
		}));
	};

	return (
		<div className="personal-goal-wrapper">
			<div className="goal-table-wrapper">
				<table className="weekly-table button2">
					<tbody>
						{(weeklyPlans.length > 0 ? weeklyPlans : getDefaultWeeklyPlans()).map((day, idx) => (
							<tr key={idx}>
								<td className="day-label">{day.weekday}</td>
								<td className="day-tasks">
									{day.date && (
										<div className="task-date" style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
											{formatDateKOR(day.date)}
										</div>
									)}
									{day.tasks.length === 0 ? (
										isEditMode && (
											<div className="empty-task button3" onClick={() => handleOpenModal(idx)}>
												+ 목표 선택
											</div>
										)
									) : (
										<>
											{day.tasks.map((task) => (
												<div key={task.taskId} className="task-row">
													<input
														type="checkbox"
														checked={task.completed}
														onChange={() => handleCheckboxToggle(task.taskId, !task.completed)}
													/>
													<span>{task.content}</span>
												</div>
											))}
											{isEditMode && (
												<div className="add-more" onClick={() => handleOpenModal(idx)}>
													+ 목표 추가
												</div>
											)}
										</>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<button className="confirm-btn button2" onClick={handleConfirmUpdate}>
				{isEditMode ? '확인' : '수정하기'}
			</button>

			{/* 목표 모달창 */}
			{showModal && selectedDayIndex !== null && (
				<WeeklyGoalModal
					groupId={studyGroupId}
					dayIndex={selectedDayIndex}
					referenceDate={referenceDate}
					onClose={() => {
						setShowModal(false);
						fetchPlans();
					}}
					onConfirm={handleModalConfirm}
				/>
			)}
		</div>
	);
};

export default PersonalGoals;
