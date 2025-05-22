import React from 'react';
import StudyGroupItem from 'features/studyGroupList/StudyGroupItem';
import { useMyStudyGroups } from 'hooks/useMyStudyGroups';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';

const MyGroupsList: React.FC = () => {
	const { groups, loading, error } = useMyStudyGroups();

	if (loading) {
		return (
			<div className="flex-center" style={{ padding: '20px 0' }}>
				<img
					src="/assets/spinner.gif"
					alt="로딩 중"
					style={{ width: '40px', height: '40px' }}
				/>
			</div>
		);
	}

	if (error) {
		return <div className="flex-center">{error}</div>;
	}

	if (!groups.length) {
		return (
			<div className="flex-center" style={{ padding: '20px' }}>
				가입한 그룹이 없습니다.
			</div>
		);
	}

	return (
		<div className="list-container">
			{groups.map((group) => (
				<div key={group.id}>
					<StudyGroupItem group={group} mode="joined" />
				</div>
			))}
		</div>
	);
};

export default MyGroupsList;
