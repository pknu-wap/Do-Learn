import React, { useState } from 'react';
import { isLoggedIn } from 'utils/auth';
import { useNavigate } from 'react-router-dom';
import LoginModal from 'components/LoginModal';

interface StudyGroupItemProps {
	group: {
		id: number;
		name: string;
		meetingDays: string;
		meetingTime: string;
		department: string | null;
		meetingType: string | null;
		currentMembers: number;
		maxMembers: number;
		isJoined: boolean;
	};
}

const StudyGroupItem: React.FC<StudyGroupItemProps> = ({ group }) => {
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);

	const handleClick = () => {
		if (!isLoggedIn()) {
			setShowModal(true);
		} else {
			navigate(`/group-detail/${group.id}`);
		}
	};

	return (
		<div className="list-box" onClick={handleClick}>
			<div className="top-row flex-between">
				<div className="group-name">{group.name}</div>
				{group.meetingType && (
					<div className="meeting-type">{group.meetingType}</div>
				)}
			</div>
			<div className="middle-row flex-row">
				<div>
					<span className="info-label">주기</span> {group.meetingDays}
				</div>
				<div>
					<span className="info-label">시간</span> {group.meetingTime}
				</div>
			</div>
			<div className="bottom-row flex-row">
				<div>
					<span className="info-label">인원</span> {group.currentMembers} /{' '}
					{group.maxMembers}명
				</div>
				{group.department && (
					<div>
						<span className="info-label">학과</span> {group.department}
					</div>
				)}
			</div>

			<LoginModal
				visible={showModal}
				onClose={() => setShowModal(false)}
				onConfirm={() => {
					setShowModal(false);
					navigate('/login');
				}}
			/>
		</div>
	);
};

export default StudyGroupItem;
