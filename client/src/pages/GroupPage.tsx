// src/pages/GroupPage.tsx
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Header from 'features/header/Header';
import GroupMenu from 'features/groupDetail/GroupMenu';
import AttendanceTab from 'features/groupDetail/tabs/AttendanceTab';
import GroupInfoTab from 'features/groupDetail/tabs/GroupInfoTab';
import GoalTab from 'features/groupDetail/tabs/GoalTab';
import RankingTab from 'features/groupDetail/tabs/RankingTab';
import NavBar from 'components/NavBar';
import { fetchGroupName } from 'api/groupNameApi';

type TabKey = 'attendance' | 'info' | 'goal' | 'ranking';

const GroupPage: React.FC = () => {
	const { studyGroupId } = useParams<{ studyGroupId: string }>();
	const [groupName, setGroupName] = useState('그룹명');
	const [selectedTab, setSelectedTab] = useState<TabKey>('attendance');

	useEffect(() => {
		const loadGroupName = async () => {
			try {
				if (studyGroupId) {
					const name = await fetchGroupName(Number(studyGroupId));
					setGroupName(name);
				}
			} catch (err) {
				setGroupName('Error');
			}
		};
		loadGroupName();
	}, [studyGroupId]);

	return (
		<div>
			<Header title={groupName} showLogo={false} variant="groupDetail" />

			<GroupMenu selected={selectedTab} onSelectMenu={setSelectedTab} />

			<div className="detail-content">
				{selectedTab === 'attendance' && (
					<AttendanceTab studyGroupId={Number(studyGroupId)} />
				)}
				{selectedTab === 'info' && (
					<GroupInfoTab studyGroupId={Number(studyGroupId)} />
				)}
				{selectedTab === 'goal' && (
					<GoalTab studyGroupId={Number(studyGroupId)} />
				)}
				{selectedTab === 'ranking' && (
					<RankingTab studyGroupId={Number(studyGroupId)} />
				)}
			</div>

			<NavBar />
		</div>
	);
};

export default GroupPage;
