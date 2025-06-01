import { useEffect, useState, useRef } from 'react';
import {
	getCommonGoals,
	getCommonGoalDetail,
	deleteCommonGoal,
	deleteSubGoal,
	createCommonGoal,
	createSubGoal,
	updateCommonGoal,
	updateSubGoal,
} from 'api/commonGoalsApi';
import { CommonGoal } from 'types/commonGoalTypes';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './CommonGoals.scss';

interface CommonGoalsProps {
	studyGroupId: number;
	isLeader: boolean;
}

const getKoreaStartDayInfo = (date: Date) => {
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
	return {
		startDate: koreaTime.toISOString().split('T')[0],
		startDayOfWeek: weekdays[koreaTime.getDay()],
	};
};

const CommonGoals = ({ studyGroupId, isLeader }: CommonGoalsProps) => {
	const [goals, setGoals] = useState<CommonGoal[]>([]);
	const [expandedGoalId, setExpandedGoalId] = useState<number | null>(null);
	const [isEditMode, setIsEditMode] = useState(false); // 수정 모드 여부
	const [mainCategoryList, setMainCategoryList] = useState<string[]>(['']);
	const [subGoalsList, setSubGoalsList] = useState<string[][]>([['']]);
	const [plusModeIndexesList, setPlusModeIndexesList] = useState<Set<number>[]>(
		[new Set([0])],
	);
	const inputRefsList = useRef<Array<Array<HTMLInputElement | null>>>([[null]]);
	const [goalIds, setGoalIds] = useState<number[]>([]);
	const [subGoalIds, setSubGoalIds] = useState<number[][]>([]);

	// 공통목표 조회
	const fetchGoals = async () => {
		try {
			const { startDate, startDayOfWeek } = getKoreaStartDayInfo(new Date());

			const data = await getCommonGoals({
				studyGroupId,
				referenceDate: startDate,
				startDayOfWeek,
			});
			console.log('공통 목표 조회 결과:', data);
			setGoals(data);
		} catch (e) {
			console.error('공통 목표 불러오기 실패', e);
		}
	};

	// 서버와 동기화 API
	const syncGoalsWithServer = async () => {
		const today = new Date();
		const dateStr = today.toISOString().split('T')[0];
		const startDayOfWeek = 'MONDAY';

		// 1. 서버 기준 기존 목표 데이터
		const serverGoals = await getCommonGoals({
			studyGroupId,
			referenceDate: dateStr,
			startDayOfWeek,
		});
		const serverDetails = await Promise.all(
			serverGoals.map((goal: CommonGoal) => getCommonGoalDetail(goal.goalId)),
		);

		// 2. 새롭게 입력한 목표 정보
		const localMainCategories = mainCategoryList;
		const localSubGoals = subGoalsList;

		// 3. 동기화 처리
		for (let i = 0; i < localMainCategories.length; i++) {
			const localMain = localMainCategories[i].trim();
			const localSubs = localSubGoals[i]
				.map((s) => s.trim())
				.filter((s) => s !== '');

			const matched = serverDetails.find((d) => d.mainCategory === localMain);

			if (!matched) {
				const { startDate, startDayOfWeek } = getKoreaStartDayInfo(new Date());
				const { goalId } = await createCommonGoal({
					studyGroupId,
					mainCategory: localMain,
					startDate,
					startDayOfWeek,
					subGoals: localSubs.map((content) => ({ content })),
				});

				await Promise.all(
					localSubs.map((content) => createSubGoal(goalId, content)),
				);
			} else {
				// 👉 수정 필요 여부 판단
				if (matched.mainCategory !== localMain) {
					await updateCommonGoal(matched.goalId, {
						studyGroupId,
						mainCategory: localMain,
						startDate: matched.startDate, // 기존값 유지
						startDayOfWeek: matched.startDayOfWeek, // 기존값 유지
						subGoals: localSubs.map((content) => ({ content })),
					});
				}

				const serverSubGoals = matched.subGoals || [];

				// 추가/수정/삭제 분기
				const existingContents = serverSubGoals.map(
					(s: { id: number; content: string }) => s.content,
				);
				const existingIds = serverSubGoals.map(
					(s: { id: number; content: string }) => s.id,
				);

				// 삭제
				for (const sub of serverSubGoals) {
					if (!localSubs.includes(sub.content)) {
						await deleteSubGoal(sub.id!);
					}
				}

				// 수정
				for (let j = 0; j < serverSubGoals.length; j++) {
					const serverSub = serverSubGoals[j];
					const localSub = localSubs[j];

					if (serverSub && localSub && serverSub.content !== localSub) {
						await updateSubGoal(serverSub.id!, localSub);
					}
				}

				// 추가
				for (const content of localSubs) {
					if (!existingContents.includes(content)) {
						await createSubGoal(matched.goalId, content);
					}
				}

				// 수정 (내용은 같은데 ID가 다르면 수정할 수도 있음 → 현재 방식은 수정 불필요)
			}
		}

		// 4. 삭제된 대범주 처리
		for (const serverGoal of serverDetails) {
			if (!localMainCategories.includes(serverGoal.mainCategory)) {
				await deleteCommonGoal(serverGoal.goalId);
			}
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
			// 빈 입력칸 검사
			if (
				mainCategoryList.some((main) => main.trim() === '') ||
				subGoalsList.some(
					(subGoals) =>
						subGoals.length === 0 || subGoals.some((s) => s.trim() === ''),
				)
			) {
				alert('모든 목표를 입력해주세요.');
				return;
			}

			try {
				await syncGoalsWithServer(); // 동기화 로직 호출
				await fetchGoals(); // 최신 데이터 불러오기
				setIsEditMode(false);
			} catch (e) {
				alert('목표 동기화 중 오류가 발생했습니다.');
				console.error(e);
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
				<div className="empty-message button2">
					등록된 공동 목표가 없습니다.
				</div>
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
							{/* {isLeader && (
								<button
									onClick={() => handleDeleteGoal(goal.goalId)}
									className="delete-button"
								>
									삭제
								</button>
							)} */}
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
