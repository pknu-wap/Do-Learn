import React from 'react';
import { useEffect, useState } from 'react';
import { getGroupNotice } from 'api/groupNotice';
import './GroupInfoModal.scss';
import 'assets/style/_typography.scss';
import 'assets/style/_flex.scss';

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
	const [notice, setNotice] = useState('');

	useEffect(() => {
		if (group.id) {
			getGroupNotice(group.id)
				.then((data) => {
					setNotice(data.notice || '등록된 공지사항이 없습니다.');
				})
				.catch((err) => {
					setNotice('공지사항 불러오기 실패');
					console.error(err);
				});
		}
	}, [group.id]);

	return (
		<div
			className="group-modal-backdrop flex-center"
			onClick={(e) => e.stopPropagation()}
		>
			<div
				style={{
					background: 'white',
					borderRadius: '16px',
					padding: '32px',
					width: '300px',
					position: 'relative',
					boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
				}}
			>
				<button
					onClick={onClose}
					style={{
						position: 'absolute',
						top: '16px',
						right: '16px',
						fontSize: '24px',
						background: 'none',
						border: 'none',
						cursor: 'pointer',
					}}
				>
					✕
				</button>

				<div className="group-name-info body1">{group.name}</div>

				<div className="group-meta-row-1 flex-row-center body3">
					<div className="meta-item flex-row">
						<div className="modal-info-label">주기</div> {group.meetingDays}
					</div>
					<div className="dot-divider">ㆍ</div>
					<div className="meta-item flex-row">
						<div className="modal-info-label">시간</div>
						{group.meetingTime}
					</div>
					<div className="dot-divider">·</div>
					<div className="meta-item flex-row">
						<div className="modal-info-label">장소</div>
						{group.region === '해당없음' ? '비대면' : group.region}
					</div>
				</div>

				<div className="group-meta-row-2 flex-row-center body3">
					<div className="meta-item flex-row">
						<div className="modal-info-label">인원</div>
						{`${group.currentMembers}/${group.maxMembers}명`}
					</div>
					<div className="dot-divider">·</div>
					<div className="category-type-item flex-row">
						<div className="modal-info-label">{group.category}</div>
						{group.type}
					</div>
				</div>

				<div className="group-modal-divider" />
				<div className="group-modal-notice body3">
					{/* <div style={{ marginBottom: '4px', color: 'black' }}>공지사항</div> */}
					{notice}
				</div>

				<div className="group-modal-actions">
					<div className="group-modal-button join button1" onClick={onJoin}>
						가입하기
					</div>
				</div>
			</div>
		</div>
	);
};

export default GroupInfoModal;
