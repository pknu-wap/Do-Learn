import React, { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';
import { getGroupNotice } from 'api/groupNotice';
import { fetchStudyGroups, StudyGroup } from 'api/studyGroupApi';
import './GroupInfoTab.scss';
import 'assets/style/_typography.scss';
import 'assets/style/_flex.scss';

interface GroupInfoTabProps {
	studyGroupId: number;
}

const GroupInfoTab: React.FC<GroupInfoTabProps> = ({ studyGroupId }) => {
	const [group, setGroup] = useState<StudyGroup | null>(null);
	const [notice, setNotice] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const loadData = async () => {
			try {
				const response = await fetchStudyGroups(0, 100);
				const found =
					response.groups?.find((g) => g.id === studyGroupId) || null;
				setGroup(found);
			} catch (err) {
				console.error('그룹 정보 불러오기 실패', err);
			}
			try {
				const data = await getGroupNotice(studyGroupId);
				setNotice(data.notice || '등록된 공지사항이 없습니다.');
			} catch (err) {
				console.error('공지사항 불러오기 실패', err);
				setNotice('공지사항 불러오기 실패');
			}
			setLoading(false);
		};
		loadData();
	}, [studyGroupId]);

	if (loading) {
		return <div className="group-info-container flex-center">로딩 중...</div>;
	}

	if (!group) {
		return (
			<div className="group-info-container">그룹 정보를 찾을 수 없습니다.</div>
		);
	}

	return (
		<div className="group-info-container flex-center">
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
			<div className="group-notice flex-row-center">
				<div className="notice-header flex-row-center">
					<Megaphone size={24} className="notice-icon" />
					{/* <span className="notice-label body3">공지사항</span> */}
				</div>
				<div className="notice-content body3">{notice}</div>
			</div>
		</div>
	);
};

export default GroupInfoTab;
