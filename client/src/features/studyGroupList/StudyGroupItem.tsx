import React, { useState } from 'react';
import { isLoggedIn } from 'utils/auth';
import { useNavigate } from 'react-router-dom';
import LoginModal from 'components/LoginModal';
import GroupInfoModal from './GroupInfoModal';
import { joinGroupApi } from 'api/joinLeaveGroupApi';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './StudyGroupsList.scss';

interface StudyGroupItemProps {
	group: {
		id: number;
		name: string;
		meetingDays: string;
		meetingTime: string;
		meetingType: string;
		currentMembers: number;
		maxMembers: number;
		region: string;
		category: string;
		type: string;
	};
	mode?: 'joined' | 'browse';
}

const StudyGroupItem: React.FC<StudyGroupItemProps> = ({
	group,
	mode = 'browse',
}) => {
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);
	const [showGroupModal, setShowGroupModal] = useState(false);

	const handleClick = () => {
		if (!isLoggedIn()) {
			setShowModal(true);
		} else {
			setShowGroupModal(true);
		}
	};

	const handleJoin = async () => {
		try {
			const message = await joinGroupApi(group.id);
			alert(message);
			setShowGroupModal(false);
			navigate(`/group-detail/${group.id}`);
		} catch (error: any) {
			const msg =
				error?.response?.data?.message ||
				'가입 요청 중 예상치 못한 오류가 발생했습니다.';
			alert(msg);
		}
	};

	return (
		<div
			className={`list-box ${group.region === '해당없음' ? 'border-virtual' : ''}`}
			onClick={handleClick}
		>
			<div className="top-row flex-between">
				<div className="group-name body3">{group.name}</div>
				<div className="meeting-type button3">
					{group.region?.trim() && group.region !== '해당없음'
						? group.region
						: '비대면'}
				</div>
			</div>
			<div className="flex-left list">
				<div className="first-col flex-col">
					<div className="flex-left first-col-meetingdays">
						<span className="info-label button1">주기</span>
						<div className="button2">{group.meetingDays}</div>
					</div>
					<div className="flex-left first-col-member">
						<span className="info-label button1">인원</span>{' '}
						<div className="button2">
							{group.currentMembers} / {group.maxMembers}명
						</div>
					</div>
				</div>
				<div className="second-col flex-col">
					<div className="flex-left second-col-time">
						<span className="info-label button1">시간</span>
						<div className="button2">{group.meetingTime}</div>
					</div>
					<div className="flex-left second-col-category">
						<span className="info-label button1">{group.category}</span>{' '}
						<div className="button2">{group.type}</div>
					</div>
				</div>
			</div>

			<LoginModal
				visible={showModal}
				onClose={() => setShowModal(false)}
				onConfirm={() => {
					setShowModal(false);
					navigate('/login');
				}}
			/>

			{showGroupModal && (
				<GroupInfoModal
					group={group}
					onClose={() => setShowGroupModal(false)}
					onJoin={handleJoin}
					mode={mode}
				/>
			)}
		</div>
	);
};

export default StudyGroupItem;
