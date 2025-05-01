import React from 'react';
import './GroupInfoModal.scss';

interface Group {
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
}

interface Props {
	group: Group;
	onClose: () => void;
	onJoin: () => void;
}

const GroupInfoModal: React.FC<Props> = ({ group, onClose, onJoin }) => {
	return (
		<div className="group-modal-backdrop flex-center">
			<div
				className="group-modal-content flex-col"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="group-name-info">{group.name}</div>

				<div>
					<div className="group-modal-value">{group.meetingDays}</div>
					<div className="group-modal-value">{group.meetingTime}</div>
					<div className="group-modal-value">{group.meetingTime}</div>

					<div className="group-modal-value">
						{group.currentMembers} / {group.maxMembers}
					</div>

					<div className="group-modal-value">
						{group.category} - {group.type}
					</div>
				</div>

				<div className="group-modal-divider" />

				<div className="group-modal-notice">📢 공지사항</div>

				<div className="group-modal-actions flex-row-around">
					<div className="group-modal-button join" onClick={onJoin}>
						가입하기
					</div>
					<div className="group-modal-button cancel" onClick={onClose}>
						취소
					</div>
				</div>
			</div>
		</div>
	);
};

export default GroupInfoModal;
