import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './WeeklyGoalModal.scss';

interface WeeklyGoalModalProps {
	groupId: number;
	dayIndex: number;
	referenceDate: string;
	onClose: () => void;
}

const WeeklyGoalModal: React.FC<WeeklyGoalModalProps> = ({
	groupId,
	dayIndex,
	referenceDate,
	onClose,
}) => {
	return (
		<div>
			{/* 모달 내부 UI 구현 */}
			<p>공통 목표 선택 모달</p>
			<button onClick={onClose}>닫기</button>
		</div>
	);
};

export default WeeklyGoalModal;
