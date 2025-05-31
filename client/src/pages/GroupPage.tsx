import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Header from 'features/header/Header';
import GroupMenu from 'features/groupDetail/GroupMenu';
import AttendanceTab from 'features/groupDetail/tabs/AttendanceTab';
import GroupInfoTab, {
	StudyGroup,
} from 'features/groupDetail/tabs/GroupInfoTab';
import GoalTab from 'features/groupDetail/tabs/GoalTab';
import RankingTab from 'features/groupDetail/tabs/RankingTab';
import GroupMemberList from 'features/groupDetail/GroupMemberList';
import LeaveGroupButton from 'features/groupDetail/LeaveGroupButton';
import NavBar from 'components/NavBar';
import { fetchGroupName } from 'api/groupNameApi';
import { fetchMyGroups } from 'api/myGroupsApi';

type TabKey = 'attendance' | 'info' | 'goal' | 'ranking';

const GroupPage: React.FC = () => {
	const { studyGroupId } = useParams<{ studyGroupId: string }>();
	const groupIdNum = Number(studyGroupId);
	const [groupName, setGroupName] = useState('그룹명');
	const [currentGroup, setCurrentGroup] = useState<StudyGroup | null>(null);
	const [selectedTab, setSelectedTab] = useState<TabKey | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const loadGroupName = async () => {
			try {
				const name = await fetchGroupName(groupIdNum);
				setGroupName(name);
			} catch {
				setGroupName('Error');
			}
		};
		if (groupIdNum) loadGroupName();
	}, [groupIdNum]);

	useEffect(() => {
		const loadGroup = async () => {
			try {
				const groups: StudyGroup[] = await fetchMyGroups();
				const found = groups.find((g) => g.id === groupIdNum) || null;
				if (!found)
					throw new Error(`그룹 ID=${groupIdNum} 정보를 찾을 수 없습니다.`);
				setCurrentGroup(found);
			} catch (e: any) {
				console.error('GroupPage 그룹 조회 실패:', e);
				setError(e.message);
			} finally {
				setLoading(false);
			}
		};
		if (groupIdNum) loadGroup();
	}, [groupIdNum]);

	if (loading)
		return <div className="group-info-container flex-center">로딩 중...</div>;
	if (error)
		return <div className="group-info-container body3 error-text">{error}</div>;

	return (
		<div>
			<Header title={groupName} showLogo={false} variant="groupDetail" />

			<GroupMenu
				selected={selectedTab}
				onSelectMenu={(key) =>
					setSelectedTab((prev) => (prev === key ? null : key))
				}
			/>

			<div className="detail-content">
				{selectedTab === 'attendance' && (
					<AttendanceTab studyGroupId={groupIdNum} />
				)}
				{selectedTab === 'info' && currentGroup && (
					<GroupInfoTab group={currentGroup} />
				)}
				{selectedTab === 'goal' && <GoalTab studyGroupId={groupIdNum} />}
				{selectedTab === 'ranking' && <RankingTab studyGroupId={groupIdNum} />}

				{selectedTab === null && (
					<>
						<GroupMemberList studyGroupId={groupIdNum} />
						<LeaveGroupButton studyGroupId={groupIdNum} />
					</>
				)}
			</div>

			<NavBar />
		</div>
	);
};

export default GroupPage;
