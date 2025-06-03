import { useEffect, useState } from 'react';
import { getCommonGoals } from 'api/commonGoalsApi';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './WeeklyGoalModal.scss';

interface WeeklyGoalModalProps {
	groupId: number;
	dayIndex: number;
	referenceDate: string;
	onClose: () => void;
	onConfirm: (dayIndex: number, selectedGoals: { id: number; content: string }[]) => void;
}

interface SubGoal {
	id: number;
	content: string;
	deleted: boolean;
}

interface CommonGoal {
	goalId: number;
	mainCategory: string;
	subGoals: SubGoal[];
}

const WeeklyGoalModal: React.FC<WeeklyGoalModalProps> = ({ groupId, dayIndex, referenceDate, onClose, onConfirm }) => {
	const [commonGoals, setCommonGoals] = useState<CommonGoal[]>([]);
	const [selectedSubGoalIds, setSelectedSubGoalIds] = useState<number[]>([]);

	// 목표 불러오기
	useEffect(() => {
		const fetchCommonGoals = async () => {
			const localKey = `commonGoalStartInfo-${groupId}`;
			const saved = localStorage.getItem(localKey);

			if (!saved) {
				console.warn(`로컬 스토리지에 ${localKey} 값이 없습니다.`);
				return;
			}

			const { startDate, startDayOfWeek } = JSON.parse(saved);

			try {
				const goals = await getCommonGoals({
					studyGroupId: groupId,
					referenceDate: startDate, // referenceDate를 로컬에서 가져온 걸로 대체
					startDayOfWeek,
				});
				setCommonGoals(goals);
			} catch (err) {
				console.error('공통 목표 조회 실패:', err);
			}
		};

		fetchCommonGoals();
	}, [groupId]);

	// 선택된 서브 목표 전달
	const handleConfirm = () => {
		const selected = commonGoals.flatMap((goal) => goal.subGoals.filter((sub) => selectedSubGoalIds.includes(sub.id)));
		onConfirm(dayIndex, selected);
	};

	// 선택 토글 함수
	const toggleSubGoal = (id: number) => {
		setSelectedSubGoalIds((prev) => (prev.includes(id) ? prev.filter((gid) => gid !== id) : [...prev, id]));
	};

	return (
		<div className="weekly-goal-modal-overlay" onClick={onClose}>
			<div className="weekly-goal-modal-box" onClick={(e) => e.stopPropagation()}>
				<div className="weekly-goal-modal-header">
					<div className="title heading2 flex-center">목표 선택</div>
					<button className="close-btn" onClick={onClose}>
						✕
					</button>
				</div>

				{/* 목표 불러오기 */}
				<div className="weekly-goal-modal-content body3">
					{commonGoals.map((goal) => (
						<div key={goal.goalId} className="goal-card">
							<div className="main-category">{goal.mainCategory}</div>
							{goal.subGoals.length > 0 ? (
								goal.subGoals.map((sub: SubGoal) => (
									<div
										key={sub.id}
										className={`subgoal-item ${selectedSubGoalIds.includes(sub.id) ? 'selected' : ''}`}
										onClick={() => toggleSubGoal(sub.id)}
									>
										{sub.content}
									</div>
								))
							) : (
								<div className="no-sub">소범주가 없습니다.</div>
							)}
						</div>
					))}
				</div>

				{/* 하단 버튼 */}
				<div className="weekly-goal-modal-footer">
					<button
						className="body3"
						onClick={() => {
							handleConfirm();
							onClose();
						}}
					>
						확인
					</button>
				</div>
			</div>
		</div>
	);
};

export default WeeklyGoalModal;
