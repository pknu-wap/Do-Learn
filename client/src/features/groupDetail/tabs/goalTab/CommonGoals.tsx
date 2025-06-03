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
import { CommonGoal, SubGoal } from 'types/commonGoalTypes';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './CommonGoals.scss';
interface CommonGoalsProps {
	studyGroupId: number;
	isLeader: boolean;
}

const getKoreaStartDayInfo = (date: Date) => {
	const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

	// 타임존을 한국으로 고정
	const formatter = new Intl.DateTimeFormat('en-US', {
		timeZone: 'Asia/Seoul',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		weekday: 'long',
	});

	const parts = formatter.formatToParts(date);

	const year = parts.find((p) => p.type === 'year')!.value;
	const month = parts.find((p) => p.type === 'month')!.value;
	const day = parts.find((p) => p.type === 'day')!.value;
	const weekdayStr = parts.find((p) => p.type === 'weekday')!.value.toUpperCase();

	return {
		startDate: `${year}-${month}-${day}`, // KST 기준 YYYY-MM-DD
		startDayOfWeek: weekdayStr,
	};
};

// 시작일 저장용
const STORAGE_KEY = (studyGroupId: number) => `commonGoalStartInfo-${studyGroupId}`;
const loadStartDateInfo = (studyGroupId: number): { startDate: string; startDayOfWeek: string } | null => {
	const data = localStorage.getItem(STORAGE_KEY(studyGroupId));
	if (data) {
		try {
			const parsed = JSON.parse(data);
			const diff = new Date().getTime() - new Date(parsed.startDate).getTime();
			if (diff <= 7 * 24 * 60 * 60 * 1000) return parsed;
		} catch {}
	}
	return null;
};

const saveStartDateInfo = (studyGroupId: number, info: { startDate: string; startDayOfWeek: string }) => {
	localStorage.setItem(STORAGE_KEY(studyGroupId), JSON.stringify(info));
};

const CommonGoals = ({ studyGroupId, isLeader }: CommonGoalsProps) => {
	const [goals, setGoals] = useState<CommonGoal[]>([]);
	const [expandedGoalIds, setExpandedGoalIds] = useState<Set<number>>(new Set());
	const [isEditMode, setIsEditMode] = useState(false); // 수정 모드 여부
	const [mainCategoryList, setMainCategoryList] = useState<string[]>(['']);
	const [subGoalsList, setSubGoalsList] = useState<string[][]>([['']]);
	const [plusModeIndexesList, setPlusModeIndexesList] = useState<Set<number>[]>([new Set([0])]);
	const inputRefsList = useRef<Array<Array<HTMLTextAreaElement | null>>>([]);

	const [goalIds, setGoalIds] = useState<number[]>([]);
	const [subGoalIds, setSubGoalIds] = useState<number[][]>([]);
	const [deletedGoalIds, setDeletedGoalIds] = useState<number[]>([]);
	const [startDateInfo, setStartDateInfo] = useState<{ startDate: string; startDayOfWeek: string } | null>(null);

	// 공통목표 조회
	const fetchGoals = async () => {
		try {
			if (!startDateInfo) return;
			const { startDate, startDayOfWeek } = startDateInfo;

			const data = await getCommonGoals({
				studyGroupId,
				referenceDate: startDate,
				startDayOfWeek,
			});

			setGoals(data);
		} catch (e) {
			console.error('공통 목표 불러오기 실패', e);
		}
	};

	// 서버와 동기화 API
	const syncGoalsWithServer = async () => {
		if (!startDateInfo) return;
		const serverGoals = await getCommonGoals({
			studyGroupId,
			referenceDate: startDateInfo.startDate,
			startDayOfWeek: startDateInfo.startDayOfWeek,
		});

		// 2. 기준 날짜 고정 (기존 데이터가 있다면 그것 기준)
		const firstServerGoal = serverGoals[0];
		const startDate = firstServerGoal?.startDate ?? startDateInfo.startDate;
		const startDayOfWeek = firstServerGoal?.startDayOfWeek ?? startDateInfo.startDayOfWeek;

		// 3. 서버 세부 정보 조회
		const serverDetails = await Promise.all(serverGoals.map((goal: CommonGoal) => getCommonGoalDetail(goal.goalId)));

		let failedCount = 0;

		for (let i = 0; i < mainCategoryList.length; i++) {
			const localMain = mainCategoryList[i].trim();
			const localSubs = subGoalsList[i].map((s) => s.trim()).filter((s) => s !== '');
			const goalId = goalIds[i];
			const matchedDetail = serverDetails.find((d) => d.goalId === goalId);
			const originalMain = matchedDetail?.mainCategory ?? '';
			const originalSubGoals: SubGoal[] = matchedDetail?.subGoals ?? [];

			try {
				if (!goalId) {
					// 신규 생성
					const created = await createCommonGoal({
						studyGroupId,
						mainCategory: localMain,
						startDate,
						startDayOfWeek,
						subGoals: [],
					});

					const newGoalId = created.goalId;

					await Promise.all(localSubs.map((sub) => createSubGoal(newGoalId, sub)));
				} else {
					// mainCategory 수정
					if (localMain !== originalMain) {
						await updateCommonGoal(goalId, {
							studyGroupId,
							mainCategory: localMain,
							startDate,
							startDayOfWeek,
							subGoals: originalSubGoals.map((sub) => ({
								id: sub.id,
								content: sub.content,
							})),
						});
					}

					// 세부 목표 동기화
					const serverSubGoals: SubGoal[] = serverDetails.find((d) => d.goalId === goalId)?.subGoals || [];

					// 삭제
					for (const sub of serverSubGoals) {
						if (!localSubs.includes(sub.content.trim())) {
							await deleteSubGoal(sub.id!);
						}
					}

					// 수정
					for (const sub of serverSubGoals) {
						const match = localSubs.find((s) => s.trim() === sub.content.trim());
						if (match && match !== sub.content) {
							await updateSubGoal(sub.id!, match);
						}
					}

					// 추가
					for (const localSub of localSubs) {
						const isNew = serverSubGoals.every((s) => s.content.trim() !== localSub.trim());
						if (isNew) {
							await createSubGoal(goalId, localSub);
						}
					}
				}
			} catch (err) {
				console.error(`❌ [${i}] 목표 처리 실패`, err);
				failedCount++;
			}
		}

		// 4. 삭제된 대범주 처리
		const existingGoalIds = goalIds.filter((id) => !!id); // undefined 제외

		for (const serverGoal of serverDetails) {
			if (!existingGoalIds.includes(serverGoal.goalId)) {
				await deleteCommonGoal(serverGoal.goalId);
			}
		}
		for (const deletedId of deletedGoalIds) {
			await deleteCommonGoal(deletedId);
		}
		setDeletedGoalIds([]);

		// 5. 최신 데이터 다시 조회
		const updatedGoals: CommonGoal[] = await getCommonGoals({
			studyGroupId,
			referenceDate: startDate,
			startDayOfWeek,
		});

		const sortedGoals = mainCategoryList.map((main) => updatedGoals.find((goal) => goal.mainCategory === main)!);
		setGoals(sortedGoals);

		// 6. 결과 알림
		// if (failedCount > 0) {
		// 	alert(`⚠️ ${failedCount}개의 목표 설정 중 오류가 발생했습니다.`);
		// } else {
		// 	alert('✅ 모든 목표가 성공적으로 설정되었습니다.');
		// }
	};

	useEffect(() => {
		inputRefsList.current = subGoalsList.map((subList, i) =>
			subList.map((_, j) => inputRefsList.current[i]?.[j] ?? null),
		);
	}, [subGoalsList]);

	useEffect(() => {
		fetchGoals();
	}, [studyGroupId]);

	useEffect(() => {
		const stored = loadStartDateInfo(studyGroupId);
		if (stored) {
			setStartDateInfo(stored);
		} else {
			const fallback = getKoreaStartDayInfo(new Date());
			setStartDateInfo(fallback);
			saveStartDateInfo(studyGroupId, fallback);
		}
	}, [studyGroupId]);

	useEffect(() => {
		if (startDateInfo) fetchGoals();
	}, [startDateInfo]);

	useEffect(() => {
		if (!isEditMode) {
			setExpandedGoalIds(new Set(goals.map((g) => g.goalId)));
		}
	}, [goals, isEditMode]);

	useEffect(() => {
		if (!isEditMode && goals.length > 0) {
			setExpandedGoalIds(new Set(goals.map((g) => g.goalId)));
		}
	}, [goals, isEditMode]);

	// 수정하기 모드 시 기존 목표 불러오기
	const handleEditMode = () => {
		// console.log('현재 goals 상태:', goals);

		if (goals.length === 0) {
			// 여기서 직접 한 줄 만들기
			setMainCategoryList(['']);
			setSubGoalsList([['']]);
			setPlusModeIndexesList([new Set([0])]);
			setGoalIds([]);
			setSubGoalIds([]);
			setIsEditMode(true);
			return;
		}

		const mainList = goals.map((goal) => goal.mainCategory);
		const subList = goals.map((goal) =>
			goal.subGoals.length === 0
				? [''] // ✅ 최소 한 줄 보이게
				: goal.subGoals.map((sub) => sub.content),
		);
		const plusIndexes = subList.map((subs) => new Set([subs.length === 0 ? 0 : subs.length - 1]));

		setMainCategoryList(mainList);
		setSubGoalsList(subList);
		setPlusModeIndexesList(plusIndexes);

		setGoalIds(goals.map((goal) => goal.goalId));
		setSubGoalIds(goals.map((goal) => goal.subGoals.map((sub) => sub.id!)));

		setIsEditMode(true);
	};

	// 대범주 입력 변경
	const handleMainCategoryChange = (mainIdx: number, value: string) => {
		const updated = [...mainCategoryList];
		updated[mainIdx] = value;
		setMainCategoryList(updated);
	};

	// 소범주 입력 변경
	const handleSubGoalChange = (mainIdx: number, index: number, value: string) => {
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
		if (!inputRefsList.current[mainIdx][index + 1]) inputRefsList.current[mainIdx][index + 1] = null;

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
			const ref = inputRefsList.current[mainIdx]?.[index + 1];
			if (ref) ref.focus();
		}, 10);
	};

	// 엔터키 → 인풋 추가, 백스페이스 → 삭제
	const handleSubGoalKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, mainIdx: number, index: number) => {
		if (e.nativeEvent.isComposing) return;
		if (e.key === 'Enter') {
			e.preventDefault();
			handleAddSubGoal(mainIdx, index);
		} else if (e.key === 'Backspace' && subGoalsList[mainIdx][index] === '') {
			handleRemoveSubGoal(mainIdx, index);
		}
	};

	// 소범주 보기 토글
	const handleToggle = (goalId: number) => {
		setExpandedGoalIds((prev) => {
			const updated = new Set(prev);
			if (updated.has(goalId)) {
				updated.delete(goalId); // 이미 열려있으면 닫기
			} else {
				updated.add(goalId); // 닫혀있으면 열기
			}
			return updated;
		});
	};

	// 생성 or 수정 버튼 클릭 핸들러
	const handleButtonClick = async () => {
		if (isEditMode) {
			// 빈 입력칸 검사
			if (mainCategoryList.some((main) => main.trim() === '')) {
				alert('대범주를 입력해주세요.');
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
			handleEditMode();
		}
	};

	// 수정 취소
	const handleCancelEdit = async () => {
		setIsEditMode(false);
		await fetchGoals(); // 입력값 초기화
	};

	// 삭제
	const handleDeleteMainCategory = (mainIdx: number) => {
		// goalIds[mainIdx]가 있는 경우 삭제 목록에 추가
		const goalIdToDelete = goalIds[mainIdx];
		if (goalIdToDelete) {
			setDeletedGoalIds((prev) => [...prev, goalIdToDelete]);
		}

		// 기존 배열들에서도 삭제
		setMainCategoryList((prev) => prev.filter((_, idx) => idx !== mainIdx));
		setSubGoalsList((prev) => prev.filter((_, idx) => idx !== mainIdx));
		setGoalIds((prev) => prev.filter((_, idx) => idx !== mainIdx));
		setSubGoalIds((prev) => prev.filter((_, idx) => idx !== mainIdx));
		setPlusModeIndexesList((prev) => prev.filter((_, idx) => idx !== mainIdx));
		inputRefsList.current.splice(mainIdx, 1);
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
								<textarea
									key={`main-${mainIdx}`}
									placeholder="목표 입력"
									value={mainCategory}
									onChange={(e) => handleMainCategoryChange(mainIdx, e.target.value)}
									className="main-category-input button2"
								/>
								<button
									className="remove-main-button"
									onClick={() => handleDeleteMainCategory(mainIdx)}
									disabled={mainCategoryList.length === 1}
									tabIndex={-1}
								>
									⊖
								</button>
							</div>

							{/* 소범주 인풋 리스트 */}
							{subGoalsList[mainIdx].map((value, index) => (
								<div key={index} className="subgoal-input-group flex-center">
									<textarea
										key={`sub-${mainIdx}-${index}`}
										ref={(el) => {
											if (!inputRefsList.current[mainIdx]) {
												inputRefsList.current[mainIdx] = [];
											}
											inputRefsList.current[mainIdx][index] = el;
										}}
										value={value}
										placeholder="세부 목표 입력"
										className="subgoal-input button3"
										onChange={(e) => handleSubGoalChange(mainIdx, index, e.target.value)}
										onKeyDown={(e) => handleSubGoalKeyDown(e, mainIdx, index)}
									/>
									<button
										onClick={() =>
											plusModeIndexesList[mainIdx].has(index)
												? handleAddSubGoal(mainIdx, index)
												: handleRemoveSubGoal(mainIdx, index)
										}
										tabIndex={-1}
										className={`add-subgoal-button button3 ${
											plusModeIndexesList[mainIdx].has(index) ? 'subgoal-plus-button' : 'subgoal-minus-button'
										}`}
									>
										{plusModeIndexesList[mainIdx].has(index) ? '⊕' : '⊖'}
									</button>
								</div>
							))}

							{/* 대범주 추가 버튼 */}
							{mainIdx === mainCategoryList.length - 1 && (
								<button className="add-main-button button2" onClick={() => handleAddMainCategory(mainIdx)}>
									공통 목표 추가하기
								</button>
							)}
						</div>
					))}
				</div>
			)}

			{/* 공통 목표가 없을 경우 */}
			{!isEditMode && goals.length === 0 && <div className="empty-message button2">등록된 공동 목표가 없습니다.</div>}

			{/* 수정 모드가 아닐 때 */}
			{!isEditMode &&
				goals.map((goal) => (
					<div key={goal.goalId} className="goal-card">
						<div className="goal-header">
							<div className="goal-main body2" onClick={() => handleToggle(goal.goalId)}>
								<div className="toggle-icon">
									<img
										src={
											expandedGoalIds.has(goal.goalId)
												? '/assets/toggle-open-icon.png'
												: '/assets/toggle-close-icon.png'
										}
										alt="toggle"
										className="toggle-icon-img"
									/>
								</div>
								{goal.mainCategory}
							</div>
						</div>

						{expandedGoalIds.has(goal.goalId) && (
							<div className="subgoal-list">
								{goal.subGoals?.length === 0 ? (
									<div className="subgoal-empty body3">소범주가 없습니다.</div>
								) : (
									goal.subGoals.map((sub) => (
										<div key={sub.id} className="subgoal-item body3">
											<div>{sub.content}</div>
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
					{isEditMode ? (
						<>
							<button className="goal-cancel-button button2" onClick={handleCancelEdit}>
								취소
							</button>
							<button className="goal-edit-button button2" onClick={handleButtonClick}>
								확인
							</button>
						</>
					) : (
						<button className="goal-edit-button button2" onClick={handleButtonClick}>
							수정하기
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default CommonGoals;
