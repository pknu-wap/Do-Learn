import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaveStudyGroup } from 'api/joinLeaveGroupApi';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './LeaveGroupButton.scss';

interface LeaveGroupButtonProps {
	studyGroupId: number;
}

const LeaveGroupButton: React.FC<LeaveGroupButtonProps> = ({
	studyGroupId,
}) => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const handleLeave = useCallback(async () => {
		if (isLoading) return;
		if (!window.confirm('그룹을 탈퇴하시겠습니까?')) return;

		setIsLoading(true);
		try {
			const message = await leaveStudyGroup(studyGroupId);
			window.alert(message);
			navigate('/mypage');
		} catch (error: any) {
			console.error('스터디 탈퇴 요청 실패:', error);
			window.alert(error.message);
		} finally {
			setIsLoading(false);
		}
	}, [studyGroupId, navigate, isLoading]);

	return (
		<div className="flex-center">
			<button
				type="button"
				className="leave-group-button button2"
				onClick={handleLeave}
				disabled={isLoading}
			>
				{isLoading ? '탈퇴 중…' : '그룹 탈퇴하기'}
			</button>
		</div>
	);
};

export default LeaveGroupButton;
