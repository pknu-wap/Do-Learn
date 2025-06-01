import { useEffect, useState, useRef } from 'react';
import {
	getCommonGoals,
	getCommonGoalDetail,
	deleteCommonGoal,
	deleteSubGoal,
	createCommonGoal,
	createSubGoal,
} from 'api/commonGoalsApi';
import { CommonGoal } from 'types/commonGoalTypes';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './CommonGoals.scss';

interface CommonGoalsProps {
	studyGroupId: number;
	isLeader: boolean;
}

const getStartOfWeekInfo = (date: Date) => {
	const dayIndex = date.getDay(); // 0=일, 1=월 ...
	const weekdays = [
		'SUNDAY',
		'MONDAY',
		'TUESDAY',
		'WEDNESDAY',
		'THURSDAY',
		'FRIDAY',
		'SATURDAY',
	];
	const startDayOfWeek = weekdays[dayIndex];

	// 오늘 날짜 기준으로 해당 요일의 날짜 구하기
	const startDate = new Date(date);
	startDate.setDate(date.getDate() - ((dayIndex + 7 - dayIndex) % 7));

	return {
		startDayOfWeek,
		startDateStr: startDate.toISOString().split('T')[0],
	};
};

const getKoreaStartDayInfo = (date: Date) => {
	// UTC → KST (+9시간)
	const utc = date.getTime();
	const koreaTime = new Date(utc + 9 * 60 * 60 * 1000);

	const weekdays = [
		'SUNDAY',
		'MONDAY',
		'TUESDAY',
		'WEDNESDAY',
		'THURSDAY',
		'FRIDAY',
		'SATURDAY',
	];
	const startDayOfWeek = weekdays[koreaTime.getDay()];
	const startDate = koreaTime.toISOString().split('T')[0]; // YYYY-MM-DD

	return { startDate, startDayOfWeek };
};

const CommonGoals = ({ studyGroupId, isLeader }: CommonGoalsProps) => {
	const [goals, setGoals] = useState<CommonGoal[]>([]);
	const [expandedGoalId, setExpandedGoalId] = useState<number | null>(null);
	const [isEditMode, setIsEditMode] = useState(false); // 수정 모드 여부
	const [mainCategory, setMainCategory] = useState('');
	const [subGoalInput, setSubGoalInput] = useState('');
	const { startDayOfWeek, startDateStr } = getStartOfWeekInfo(new Date());
	const startDateSentRef = useRef(false);
	const [subGoals, setSubGoals] = useState<string[]>(['']);
	const [plusModeIndexes, setPlusModeIndexes] = useState<Set<number>>(
		new Set([0]),
	);
	const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

	// 공통목표 조회
	const fetchGoals = async () => {
		try {
			const today = new Date();
			const offsetMs = today.getTimezoneOffset() * 60000;
			const koreaTime = new Date(today.getTime() + offsetMs + 9 * 60 * 60000);
			const dateStr = koreaTime.toISOString().split('T')[0]; // "YYYY-MM-DD"
			const referenceDate = dateStr;
			const startDayOfWeek = 'MONDAY'; // 실제 주차 기준 요일
			const data = await getCommonGoals({
				studyGroupId,
				referenceDate,
				startDayOfWeek,
			});
			// console.log('공통 목표 조회 결과:', data);
			setGoals(data);
		} catch (e) {
			console.error('공통 목표 불러오기 실패', e);
		}
	};

	useEffect(() => {
		fetchGoals();
	}, [studyGroupId]);

	// 소범주 입력 변경
	const handleSubGoalChange = (index: number, value: string) => {
		const updated = [...subGoals];
		updated[index] = value;
		setSubGoals(updated);
	};

	// 소범주 추가 (index 기준으로 아래에 인풋칸 삽입)
	const handleAddSubGoal = (index: number) => {
		if (subGoals[index].trim() === '') return;

		const updated = [...subGoals];
		updated.splice(index + 1, 0, '');
		setSubGoals(updated);

		setPlusModeIndexes((prev) => {
			const newSet = new Set(prev);
			newSet.add(index + 1); // 새로 생긴 애는 + 유지
			newSet.delete(index); // 누른 애는 이제 -로 바뀜
			return newSet;
		});

		// 다음 tick에서 포커스
		setTimeout(() => {
			inputRefs.current[index + 1]?.focus();
		}, 0);
	};

	// 소범주 삭제
	const handleRemoveSubGoal = (index: number) => {
		if (subGoals.length === 1) return;
		const updated = subGoals.filter((_, i) => i !== index);
		setSubGoals(updated);

		setPlusModeIndexes((prev) => {
			const newSet = new Set(Array.from(prev).filter((i) => i !== index));
			const adjusted = new Set<number>();
			Array.from(newSet).forEach((i) => {
				adjusted.add(i > index ? i - 1 : i);
			});
			return adjusted;
		});

		// 삭제 후 위 인풋으로 포커스 이동
		setTimeout(() => {
			inputRefs.current[Math.max(0, index - 1)]?.focus();
		}, 0);
	};

	// 엔터키 → 인풋 추가, 백스페이스 → 삭제
	const handleSubGoalKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		index: number,
	) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleAddSubGoal(index);
		} else if (e.key === 'Backspace' && subGoals[index] === '') {
			handleRemoveSubGoal(index);
		}
	};

	// 소범주 보기 토글
	const handleToggle = async (goalId: number) => {
		if (expandedGoalId === goalId) {
			setExpandedGoalId(null);
		} else {
			try {
				const detail = await getCommonGoalDetail(goalId);
				setGoals((prev) =>
					prev.map((g) =>
						g.goalId === goalId ? { ...g, subGoals: detail.subGoals } : g,
					),
				);
				setExpandedGoalId(goalId);
			} catch (e) {
				console.error('소범주 불러오기 실패', e);
			}
		}
	};

	// 대범주 삭제
	const handleDeleteGoal = async (goalId: number) => {
		await deleteCommonGoal(goalId);
		fetchGoals();
	};

	// 소범주 삭제
	const handleDeleteSubGoal = async (goalId: number, subGoalId: number) => {
		await deleteSubGoal(subGoalId);
		const detail = await getCommonGoalDetail(goalId);
		setGoals((prev) =>
			prev.map((g) =>
				g.goalId === goalId ? { ...g, subGoals: detail.subGoals } : g,
			),
		);
	};

	const getButtonLabel = () => {
		if (isEditMode) return '확인';
		if (goals.length === 0) return '추가';
		return '수정하기';
	};

	// 생성 or 수정 버튼 클릭 핸들러
	const handleButtonClick = async () => {
		if (isEditMode) {
			if (!mainCategory || subGoals.length === 0) {
				alert('대범주와 소범주를 입력해주세요.');
				return;
			}

			try {
				let startDate = undefined;
				let startDayOfWeek = undefined;

				// 처음 한번만 시작일 전송
				if (!startDateSentRef.current) {
					const now = new Date();
					const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
					startDate = koreaTime.toISOString().split('T')[0];
					startDayOfWeek = [
						'SUNDAY',
						'MONDAY',
						'TUESDAY',
						'WEDNESDAY',
						'THURSDAY',
						'FRIDAY',
						'SATURDAY',
					][koreaTime.getDay()];
					startDateSentRef.current = true;
				}

				const response = await createCommonGoal({
					studyGroupId,
					mainCategory,
					startDate,
					startDayOfWeek,
					subGoals: [],
				});

				const newGoalId = response.goalId;

				for (const content of subGoals) {
					await createSubGoal(newGoalId, content);
				}

				await fetchGoals();
				setMainCategory('');
				setSubGoals([]);
				setSubGoalInput('');
				setIsEditMode(false);
			} catch (error) {
				console.error('공통 목표 생성 실패:', error);
				alert('공통 목표 생성 중 오류가 발생했습니다.');
			}
		} else {
			setIsEditMode(true);
		}
	};

	return (
		<div className="common-goal-section flex-col ">
			{/* 수정 모드일 때 */}
			{isEditMode && (
				<div className="goal-form flex-col">
					{/* 대범주 인풋 */}
					<input
						type="text"
						placeholder="목표 입력"
						value={mainCategory}
						onChange={(e) => setMainCategory(e.target.value)}
						className="main-category-input button2"
					/>

					{/* 소범주 인풋 리스트 */}
					{subGoals.map((value, index) => (
						<div key={index} className="subgoal-input-group flex-center">
							<input
								ref={(el) => {
									inputRefs.current[index] = el;
								}}
								type="text"
								value={value}
								placeholder="세부 목표 입력"
								className="subgoal-input button3"
								onChange={(e) => handleSubGoalChange(index, e.target.value)}
								onKeyDown={(e) => handleSubGoalKeyDown(e, index)}
							/>
							<button
								onClick={() =>
									plusModeIndexes.has(index)
										? handleAddSubGoal(index)
										: handleRemoveSubGoal(index)
								}
								className="add-subgoal-button"
							>
								{plusModeIndexes.has(index) ? '+' : '−'}
							</button>
						</div>
					))}
				</div>
			)}

			{/* 일반 모드일 때 공통 목표 표시 */}
			{!isEditMode && goals.length === 0 && (
				<div className="empty-message">등록된 공동 목표가 없습니다.</div>
			)}

			{/* 수정 모드가 아닐 때 */}
			{!isEditMode &&
				goals.map((goal) => (
					<div key={goal.goalId} className="goal-card">
						<div className="goal-header">
							<div
								className="goal-main"
								onClick={() => handleToggle(goal.goalId)}
							>
								<div className="toggle-icon">
									{expandedGoalId === goal.goalId ? '▾' : '▸'}
								</div>
								{goal.mainCategory}
								{isLeader && (
									<button
										className="add-button"
										onClick={(e) => {
											e.stopPropagation();
											setIsEditMode(true);
										}}
									>
										+
									</button>
								)}
							</div>
							{isLeader && (
								<button
									onClick={() => handleDeleteGoal(goal.goalId)}
									className="delete-button"
								>
									삭제
								</button>
							)}
						</div>

						{expandedGoalId === goal.goalId && (
							<div className="subgoal-list">
								{goal.subGoals?.length === 0 ? (
									<div className="subgoal-empty">소범주가 없습니다.</div>
								) : (
									goal.subGoals.map((sub) => (
										<div key={sub.id} className="subgoal-item">
											<div>{sub.content}</div>
											{isLeader && (
												<button
													onClick={() =>
														handleDeleteSubGoal(goal.goalId, sub.id!)
													}
													className="delete-button"
												>
													삭제
												</button>
											)}
										</div>
									))
								)}
							</div>
						)}
					</div>
				))}

			{/* 하단 버튼 */}
			{isLeader && (
				<div className="goal-footer">
					<button className="goal-edit-button" onClick={handleButtonClick}>
						{getButtonLabel()}
					</button>
				</div>
			)}
		</div>
	);
};

export default CommonGoals;
