// src/features/groupDetail/tabs/goalTab/WeeklyGoalModal.tsx

import { useEffect, useState } from 'react';
import { getCommonGoals } from 'api/commonGoalsApi';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './WeeklyGoalModal.scss';

interface WeeklyGoalModalProps {
	groupId: number;
	dayIndex: number;
	referenceDate: string;
	existingTaskIds: number[]; // 추가된 subGoal ID 목록
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

const WeeklyGoalModal: React.FC<WeeklyGoalModalProps> = ({
	groupId,
	dayIndex,
	referenceDate,
	existingTaskIds,
	onClose,
	onConfirm,
}) => {
	const [commonGoals, setCommonGoals] = useState<CommonGoal[]>([]);
	const [selectedSubGoalIds, setSelectedSubGoalIds] = useState<number[]>([]);

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
					referenceDate: startDate,
					startDayOfWeek,
				});
				setCommonGoals(goals);
			} catch (err) {
				console.error('공통 목표 조회 실패:', err);
			}
		};

		fetchCommonGoals();
	}, [groupId]);

	const toggleSubGoal = (id: number) => {
		setSelectedSubGoalIds((prev) => (prev.includes(id) ? prev.filter((gid) => gid !== id) : [...prev, id]));
	};

	const handleConfirm = () => {
		const selected = commonGoals.flatMap((goal) =>
			goal.subGoals
				.filter(
					(sub) => selectedSubGoalIds.includes(sub.id) && !existingTaskIds.includes(sub.id), // 이미 추가된 subGoal은 제외
				)
				.map((sub) => ({ id: sub.id, content: sub.content })),
		);
		onConfirm(dayIndex, selected);
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

				<div className="weekly-goal-modal-content body3">
					{commonGoals.map((goal) => (
						<div key={goal.goalId} className="goal-card">
							<div className="main-category">{goal.mainCategory}</div>
							{goal.subGoals.length > 0 ? (
								goal.subGoals
									.filter((sub) => !existingTaskIds.includes(sub.id)) // 이미 추가된 subGoal은 리스트에서 제거
									.map((sub: SubGoal) => (
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
