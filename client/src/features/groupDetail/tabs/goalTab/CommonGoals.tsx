import { useEffect, useState } from 'react';
import {
	getCommonGoals,
	getCommonGoalDetail,
	deleteCommonGoal,
	deleteSubGoal,
} from 'api/commonGoalsApi';
import { CommonGoal } from 'types/commonGoalTypes';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './CommonGoals.scss';

interface CommonGoalsProps {
	studyGroupId: number;
}

const CommonGoals = ({ studyGroupId }: CommonGoalsProps) => {
	const [goals, setGoals] = useState<CommonGoal[]>([]);
	const [expandedGoalId, setExpandedGoalId] = useState<number | null>(null);
	const [isEditMode, setIsEditMode] = useState(false); // 수정 모드 여부

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

	const handleDeleteGoal = async (goalId: number) => {
		await deleteCommonGoal(goalId);
		fetchGoals();
	};

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

	const handleButtonClick = () => {
		if (isEditMode) {
			// 확인 누르면 저장 로직 또는 종료
			setIsEditMode(false);
			// 필요시 서버로 생성 API 호출 등
		} else {
			// 추가 또는 수정모드 진입
			setIsEditMode(true);
		}
	};

	return (
		<div className="common-goal-section">
			{goals.length === 0 ? (
				<div className="empty-message">등록된 공동 목표가 없습니다.</div>
			) : (
				goals.map((goal) => (
					<div key={goal.goalId} className="goal-card">
						<div className="goal-header flex-between">
							<div className="title body2">{goal.mainCategory}</div>
							<div className="button-group">
								<button onClick={() => handleToggle(goal.goalId)}>토글</button>
								<button onClick={() => handleDeleteGoal(goal.goalId)}>
									삭제
								</button>
							</div>
						</div>

						{expandedGoalId === goal.goalId && (
							<div className="subgoal-list">
								{goal.subGoals?.length === 0 ? (
									<div className="subgoal-empty">소범주가 없습니다.</div>
								) : (
									goal.subGoals.map((sub) => (
										<div key={sub.id} className="subgoal-item flex-between">
											<span>{sub.content}</span>
											<button
												onClick={() =>
													handleDeleteSubGoal(goal.goalId, sub.id!)
												}
											>
												삭제
											</button>
										</div>
									))
								)}
							</div>
						)}
					</div>
				))
			)}

			<div className="goal-footer">
				<button className="goal-edit-button" onClick={handleButtonClick}>
					{getButtonLabel()}
				</button>
			</div>
		</div>
	);
};

export default CommonGoals;
