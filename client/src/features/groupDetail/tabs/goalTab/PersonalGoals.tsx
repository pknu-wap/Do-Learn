// src/features/groupDetail/tabs/goalTab/PersonalGoals.tsx

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

interface Task {
	taskId: number;
	content: string;
	completed: boolean;
}

interface DayPlan {
	date: string;
	weekday: string; // 화면에 표시용: "1일 차", "2일 차", …
	dayOfWeek: string; // 서버 스펙용 요일(enum): "MONDAY", "TUESDAY", …
	tasks: Task[];
}

const PersonalGoals = ({ studyGroupId }: { studyGroupId: number }) => {
	const [referenceDate] = useState('2025-06-04');
	const [weeklyPlans, setWeeklyPlans] = useState<DayPlan[]>([]);
	const [showModal, setShowModal] = useState(false);
	const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedSubGoalsMap, setSelectedSubGoalsMap] = useState<Record<number, { id: number; content: string }[]>>({});

	// "YYYY-MM-DD" → "YY.MM.DD"
	const formatDateKOR = (dateStr: string): string => (dateStr ? dateStr.slice(2).replace(/-/g, '.') : '');

	useEffect(() => {
		fetchPlans();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchPlans = async () => {
		try {
			const res = await getWeeklyPlans(studyGroupId, referenceDate);
			const { memberWeeklyPlans, personalTasks } = res;
			const all = [...memberWeeklyPlans, ...personalTasks];

			// 서버에서 내려온 데이터를 dayOfWeek 기준으로 그룹핑
			const grouped: Record<string, { date: string; tasks: Task[] }> = {};
			all.forEach((item: any) => {
				// item.dayOfWeek은 "MONDAY", "TUESDAY" 등 서버 스펙
				const serverDayOfWeek = item.dayOfWeek;
				const isSubGoal = 'subGoalContent' in item;
				const content = isSubGoal ? item.subGoalContent : item.content;

				if (!grouped[serverDayOfWeek]) {
					grouped[serverDayOfWeek] = {
						date: item.date,
						tasks: [],
					};
				}
				grouped[serverDayOfWeek].tasks.push({
					taskId: item.id,
					content,
					completed: item.completed,
				});
			});

			// 7일치 배열로 합치기: referenceDate 기준
			const fullWeek: DayPlan[] = Array.from({ length: 7 }, (_, idx) => {
				// idx일 후 날짜 문자열
				const dateStr = getDateByStart(referenceDate, idx);
				// 요일(enum) 계산
				const realDayOfWeek = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase(); // ex) "MONDAY"
				// 그룹핑된 객체에서 해당 요일이 있으면 tasks와 date 사용
				if (grouped[realDayOfWeek]) {
					return {
						date: grouped[realDayOfWeek].date,
						weekday: `${idx + 1}일 차`,
						dayOfWeek: realDayOfWeek,
						tasks: grouped[realDayOfWeek].tasks,
					};
				}
				// 없으면 빈 tasks
				return {
					date: dateStr,
					weekday: `${idx + 1}일 차`,
					dayOfWeek: realDayOfWeek,
					tasks: [],
				};
			});

			setWeeklyPlans(fullWeek);
		} catch (err) {
			// 실패 시에도 기본 7일 표시
			setWeeklyPlans(getDefaultWeeklyPlans());
		}
	};

	const handleCheckboxToggle = async (taskId: number, completed: boolean) => {
		try {
			await updatePersonalCompletion(taskId, completed);
			await fetchPlans();
		} catch (err: any) {
			if (err.response?.status === 400) {
				alert('오류가 발생하였습니다.');
			} else {
				console.error(err);
			}
		}
	};

	const handleOpenModal = (dayIndex: number) => {
		setSelectedDayIndex(dayIndex);
		setShowModal(true);
	};

	const handleDeleteTask = async (taskId: number, dayIndex: number) => {
		try {
			// 서버에 개인 목표 삭제 요청 (DELETE)
			await deletePersonalTask(taskId);

			// 화면에서도 해당 task를 제거
			setWeeklyPlans((prev) => {
				const updated = prev.map((day, idx) => {
					if (idx === dayIndex) {
						return {
							...day,
							tasks: day.tasks.filter((t) => t.taskId !== taskId),
						};
					}
					return day;
				});
				return updated;
			});

			// 선택된 subGoals 맵 업데이트 (삭제된 item 제거)
			setSelectedSubGoalsMap((prev) => {
				const copy = { ...prev };
				if (copy[dayIndex]) {
					copy[dayIndex] = copy[dayIndex].filter((g) => g.id !== taskId);
					if (copy[dayIndex].length === 0) {
						delete copy[dayIndex];
					}
				}
				return copy;
			});
		} catch (err: any) {
			if (err.response?.status === 400) {
				alert('오류가 발생하였습니다.');
			} else {
				console.error(err);
			}
		}
	};

	const handleConfirmUpdate = async () => {
		if (!isEditMode) {
			// 편집 모드로 전환할 때 기존 선택 기록 초기화
			setSelectedSubGoalsMap({});
			setIsEditMode(true);
			return;
		}
		// 선택된 목표가 하나도 없으면, 아무 요청 없이 편집 모드만 종료
		if (Object.keys(selectedSubGoalsMap).length === 0) {
			setIsEditMode(false);
			return;
		}
		// 서버에 전송할 payload 구성
		const memberGoalPlans = Object.entries(selectedSubGoalsMap).flatMap(([dayIndex, goals]) => {
			const idx = Number(dayIndex);
			const dayPlan = weeklyPlans[idx];
			if (!dayPlan?.date) return [];

			return goals.map((goal) => ({
				subGoalId: goal.id,
				date: dayPlan.date,
				dayOfWeek: dayPlan.dayOfWeek,
				completed: false,
			}));
		});

		const payload = {
			memberGoalPlans,
			personalTaskPlans: [],
		};

		// 새로운 계획이 있을 때만 호출
		if (memberGoalPlans.length > 0) {
			try {
				await createOrUpdateWeeklyPlan(studyGroupId, referenceDate, payload);
				await fetchPlans();
			} catch (err: any) {
				if (err.response?.status === 400) {
					alert('오류가 발생하였습니다.');
				} else {
					console.error(err);
				}
			}
		}
		setIsEditMode(false);
	};

	const handleModalConfirm = (dayIndex: number, selectedGoals: { id: number; content: string }[]) => {
		const newTaskObjs: Task[] = selectedGoals.map((goal) => ({
			taskId: goal.id,
			content: goal.content,
			completed: false,
		}));

		setWeeklyPlans((prev) => {
			const updated = [...prev];
			if (!updated[dayIndex]) {
				// 새롭게 추가해야 할 경우, 날짜와 요일 계산
				const dateStr = getDateByStart(referenceDate, dayIndex);
				const realDayOfWeek = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
				updated[dayIndex] = {
					date: dateStr,
					weekday: `${dayIndex + 1}일 차`,
					dayOfWeek: realDayOfWeek,
					tasks: [],
				};
			}
			updated[dayIndex].tasks.push(...newTaskObjs);
			return updated;
		});

		setSelectedSubGoalsMap((prev) => ({
			...prev,
			[dayIndex]: selectedGoals,
		}));

		setShowModal(false);
	};

	const getDateByStart = (startDateStr: string, dayIndex: number) => {
		const baseDate = new Date(startDateStr);
		baseDate.setDate(baseDate.getDate() + dayIndex);
		return baseDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
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
						{(weeklyPlans.length > 0 ? weeklyPlans : getDefaultWeeklyPlans()).map((day, idx) => (
							<tr key={idx}>
								<td className="day-label">{day.weekday}</td>
								<td className="day-tasks">
									{day.date && (
										<div
											className="task-date"
											style={{
												color: '#aaa',
												fontSize: '0.8rem',
												marginBottom: '0.3rem',
											}}
										>
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
													<span style={{ flexGrow: 1 }}>{task.content}</span>
													{isEditMode && (
														/* 삭제 버튼 주석 처리 */
														<></>
													)}
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

			{showModal &&
				selectedDayIndex !== null &&
				(() => {
					// 해당 날짜에 이미 추가된 subGoal IDs
					const existingTaskIds = weeklyPlans[selectedDayIndex]?.tasks.map((t) => t.taskId) ?? [];
					return (
						<WeeklyGoalModal
							groupId={studyGroupId}
							dayIndex={selectedDayIndex}
							referenceDate={referenceDate}
							existingTaskIds={existingTaskIds}
							onClose={() => setShowModal(false)}
							onConfirm={handleModalConfirm}
						/>
					);
				})()}
		</div>
	);
};

export default PersonalGoals;
