import React, { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';
import { getGroupNotice } from 'api/groupNotice';
import './GroupInfoTab.scss';
import 'assets/style/_typography.scss';
import 'assets/style/_flex.scss';

export interface StudyGroup {
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

interface GroupInfoTabProps {
	group: StudyGroup;
}

const GroupInfoTab: React.FC<GroupInfoTabProps> = ({ group }) => {
	const [notice, setNotice] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadNotice = async () => {
			try {
				const data = await getGroupNotice(group.id);
				setNotice(data.notice || '등록된 공지사항이 없습니다.');
			} catch (err: any) {
				console.error('공지사항 로드 실패:', err);
				setError(`공지사항 로드 중 오류: ${err.message}`);
			}
			setLoading(false);
		};
		loadNotice();
	}, [group.id]);

	if (loading) return <div className="group-info-container flex-center">로딩 중...</div>;
	if (error) return <div className="group-info-container body3 error-text">{error}</div>;

	return (
		<div className="group-info-container flex-col-center">
			<div className="group-meta-row-1 flex-row-center body3">
				<div className="meta-item flex-row">
					<div className="notice-info-label">주기</div>
					{group.meetingDays}
				</div>
				<div className="dot-divider">·</div>
				<div className="meta-item flex-row">
					<div className="notice-info-label">시간</div>
					{group.meetingTime}
				</div>
				<div className="dot-divider">·</div>
				<div className="meta-item flex-row">
					<div className="notice-info-label">장소</div>
					{group.region === '해당없음' ? '비대면' : group.region}
				</div>
			</div>

			<div className="group-meta-row-2 flex-row-center body3">
				<div className="meta-item flex-row">
					<div className="notice-info-label">인원</div>
					{`${group.currentMembers}/${group.maxMembers}명`}
				</div>
				<div className="dot-divider">·</div>
				<div className="category-type-item flex-row">
					<div className="notice-info-label">{group.category}</div>
					{group.type}
				</div>
			</div>

			<div className="group-notice flex-col-center">
				<div className="notice-header flex-row-center">
					<Megaphone size={24} className="notice-icon" />
					<span className="notice-label body2">공지사항</span>
				</div>
				<div className="notice-content flex-center body3">{notice}</div>
			</div>
		</div>
	);
};
export default GroupInfoTab;
