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

	const [mainCategoryList, setMainCategoryList] = useState<string[]>(['']);
	const [subGoalsList, setSubGoalsList] = useState<string[][]>([['']]);
	const [plusModeIndexesList, setPlusModeIndexesList] = useState<Set<number>[]>(
		[new Set([0])],
	);
	const inputRefsList = useRef<Array<Array<HTMLInputElement | null>>>([[null]]);

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

	// 대범주 입력 변경
	const handleMainCategoryChange = (mainIdx: number, value: string) => {
		const updated = [...mainCategoryList];
		updated[mainIdx] = value;
		setMainCategoryList(updated);
	};

	// 소범주 입력 변경
	const handleSubGoalChange = (
		mainIdx: number,
		index: number,
		value: string,
	) => {
		const updated = [...subGoalsList];
		updated[mainIdx][index] = value;
		setSubGoalsList(updated);
	};

	// 대범주 추가
	const handleAddMainCategory = (mainIdx: number) => {
		setMainCategoryList((prev) => {
			const updated = [...prev];
			updated.splice(mainIdx + 1, 0, '');
			return updated;
		});

		setSubGoalsList((prev) => {
			const updated = [...prev];
			updated.splice(mainIdx + 1, 0, ['']);
			return updated;
		});

		setPlusModeIndexesList((prev) => {
			const updated = [...prev];
			updated.splice(mainIdx + 1, 0, new Set([0]));
			return updated;
		});

		// ✅ 이걸 추가!
		inputRefsList.current.splice(mainIdx + 1, 0, [null]);
	};

	// 소범주 추가 (index 기준으로 아래에 인풋칸 삽입)
	const handleAddSubGoal = (mainIdx: number, index: number) => {
		if (subGoalsList[mainIdx][index].trim() === '') return;

		const updated = [...subGoalsList];
		updated[mainIdx].splice(index + 1, 0, '');
		setSubGoalsList(updated);

		const updatedPlus = [...plusModeIndexesList];
		const newSet = new Set(updatedPlus[mainIdx]);
		newSet.add(index + 1);
		newSet.delete(index);
		updatedPlus[mainIdx] = newSet;
		setPlusModeIndexesList(updatedPlus);

		// 초기화 보장
		if (!inputRefsList.current[mainIdx]) inputRefsList.current[mainIdx] = [];
		if (!inputRefsList.current[mainIdx][index + 1])
			inputRefsList.current[mainIdx][index + 1] = null;

		requestAnimationFrame(() => {
			inputRefsList.current[mainIdx]?.[index + 1]?.focus();
		});
	};

	// 소범주 삭제
	const handleRemoveSubGoal = (mainIdx: number, index: number) => {
		if (subGoalsList[mainIdx].length === 1) return;

		const updated = [...subGoalsList];
		updated[mainIdx] = updated[mainIdx].filter((_, i) => i !== index);
		setSubGoalsList(updated);

		const updatedPlus = [...plusModeIndexesList];
		const newSet = new Set(
			Array.from(updatedPlus[mainIdx])
				.filter((i) => i !== index)
				.map((i) => (i > index ? i - 1 : i)),
		);
		updatedPlus[mainIdx] = newSet;
		setPlusModeIndexesList(updatedPlus);

		setTimeout(() => {
			inputRefsList.current[mainIdx][Math.max(0, index - 1)]?.focus();
		}, 0);
	};

	// 대범주 삭제
	const handleRemoveMainCategory = (mainIdx: number) => {
		if (mainCategoryList.length === 1) return; // 최소 1개 유지

		setMainCategoryList((prev) => prev.filter((_, i) => i !== mainIdx));
		setSubGoalsList((prev) => prev.filter((_, i) => i !== mainIdx));
		setPlusModeIndexesList((prev) => prev.filter((_, i) => i !== mainIdx));
		inputRefsList.current.splice(mainIdx, 1);
	};

	// 엔터키 → 인풋 추가, 백스페이스 → 삭제
	const handleSubGoalKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		mainIdx: number,
		index: number,
	) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleAddSubGoal(mainIdx, index);
		} else if (e.key === 'Backspace' && subGoalsList[mainIdx][index] === '') {
			handleRemoveSubGoal(mainIdx, index);
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

	// 대범주 삭제? 수정아닐때?
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
				<div className="goal-form-list flex-col">
					{mainCategoryList.map((mainCategory, mainIdx) => (
						<div key={mainIdx} className="goal-form flex-col">
							{/* 대범주 인풋 */}
							<div className="main-category-wrapper">
								<input
									type="text"
									placeholder="목표 입력"
									value={mainCategory}
									onChange={(e) =>
										handleMainCategoryChange(mainIdx, e.target.value)
									}
									className="main-category-input button2"
								/>
								<button
									className="remove-main-button"
									onClick={() => handleRemoveMainCategory(mainIdx)}
									disabled={mainCategoryList.length === 1}
								>
									−
								</button>
							</div>

							{/* 소범주 인풋 리스트 */}
							{subGoalsList[mainIdx].map((value, index) => (
								<div key={index} className="subgoal-input-group flex-center">
									<input
										ref={(el) => {
											if (!inputRefsList.current[mainIdx]) {
												inputRefsList.current[mainIdx] = [];
											}
											inputRefsList.current[mainIdx][index] = el;
										}}
										type="text"
										value={value}
										placeholder="세부 목표 입력"
										className="subgoal-input button3"
										onChange={(e) =>
											handleSubGoalChange(mainIdx, index, e.target.value)
										}
										onKeyDown={(e) => handleSubGoalKeyDown(e, mainIdx, index)}
									/>
									<button
										onClick={() =>
											plusModeIndexesList[mainIdx].has(index)
												? handleAddSubGoal(mainIdx, index)
												: handleRemoveSubGoal(mainIdx, index)
										}
										className="add-subgoal-button button3"
									>
										{plusModeIndexesList[mainIdx].has(index) ? '+' : '−'}
									</button>
								</div>
							))}

							{/* 대범주 추가 버튼 */}
							{mainIdx === mainCategoryList.length - 1 && (
								<button
									className="add-main-button button2"
									onClick={() => handleAddMainCategory(mainIdx)}
								>
									공통 목표 추가하기
								</button>
							)}
						</div>
					))}
				</div>
			)}

			{/* 공통 목표가 없을 경우 */}
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
					<button
						className="goal-edit-button button2"
						onClick={handleButtonClick}
					>
						{getButtonLabel()}
					</button>
				</div>
			)}
		</div>
	);
};

export default CommonGoals;
