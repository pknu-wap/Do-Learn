import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import Header from 'features/header/Header';
import GroupMenu from 'features/groupDetail/GroupMenu';
import GroupMemberList from 'features/groupDetail/GroupMemberList';
import GroupChecklist from 'features/groupDetail/GroupChecklist';
import NavBar from 'components/NavBar';
import { fetchGroupName } from 'api/groupNameApi';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const GroupPage = () => {
	const { studyGroupId } = useParams();
	const [groupName, setGroupName] = useState('그룹명');

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
			<GroupMenu />
			<GroupMemberList studyGroupId={Number(studyGroupId)} />
			<GroupChecklist />
			<NavBar />
		</div>
	);
};

export default GroupPage;
