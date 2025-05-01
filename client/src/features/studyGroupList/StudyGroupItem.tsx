import React, { useState } from 'react';
import { isLoggedIn } from 'utils/auth';
import { useNavigate } from 'react-router-dom';
import LoginModal from 'components/LoginModal';
import GroupInfoModal from './GroupInfoModal';
import joinGroupApi from 'api/joinGroupApi';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';

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
}

const StudyGroupItem: React.FC<StudyGroupItemProps> = ({ group }) => {
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
		navigate(`/group-detail/${group.id}`);
		// try {
		// 	const message = await joinGroupApi(group.id);
		// 	alert(message);
		// 	setShowGroupModal(false);
		// } catch (error) {
		// 	alert('가입 요청 중 오류가 발생했습니다.');
		// }
	};

	return (
		<div className="list-box" onClick={handleClick}>
			<div className="top-row flex-between">
				<div className="group-name body3">{group.name}</div>
				{group.meetingType && (
					<div className="meeting-type button3">{group.meetingType}</div>
				)}
				<span className="meeting-type button3">
					{group.region?.trim() ? group.region : '비대면'}
				</span>
			</div>

			<div className="middle-row flex-row button1">
				<div>
					<span className="info-label">주기</span> {group.meetingDays}
				</div>
				<div>
					<span className="info-label"> &nbsp;&nbsp;시간</span>{' '}
					{group.meetingTime}
				</div>
			</div>

			<div className="bottom-row flex-row button1">
				<div>
					<span className="info-label button1">인원</span>{' '}
					{group.currentMembers} / {group.maxMembers}명
				</div>
				<div>
					<span className="info-label">{group.category}</span> {group.type}
				</div>
			</div>

			<div className="bottom-row flex-row"></div>

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
				/>
			)}
		</div>
	);
};

export default StudyGroupItem;
