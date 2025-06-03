import React from 'react';
import StudyGroupItem from 'features/studyGroupList/StudyGroupItem';
import { useMyStudyGroups } from 'hooks/useMyStudyGroups';
import { useState } from 'react';
import EditGroupModal from 'features/editGroups/EditGroupModal';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './MyGroupsList.scss';

const MyGroupsList: React.FC = () => {
	const { groups, loading, error } = useMyStudyGroups();
	const [activeTab, setActiveTab] = useState<'leader' | 'member'>('leader');
	const filteredGroups = groups.filter((group) => (activeTab === 'leader' ? group.isLeader : !group.isLeader));
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedGroup, setSelectedGroup] = useState<any>(null);

	if (loading) {
		return (
			<div className="flex-center" style={{ padding: '20px 0' }}>
				<img src="/assets/spinner.gif" alt="로딩 중" style={{ width: '40px', height: '40px' }} />
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
			<div className="tab-header">
				<button
					className={`tab ${activeTab === 'leader' ? 'active' : ''} button1`}
					onClick={() => setActiveTab('leader')}
				>
					생성한 그룹
				</button>
				<button
					className={`tab ${activeTab === 'member' ? 'active' : ''} button1`}
					onClick={() => setActiveTab('member')}
				>
					가입한 그룹
				</button>
			</div>

			<div className="group-list-body">
				{filteredGroups.length > 0 ? (
					filteredGroups.map((group) => (
						<StudyGroupItem
							key={group.id}
							group={group}
							mode="joined"
							showEdit={group.isLeader}
							onEditClick={(group) => {
								setSelectedGroup(group);
								setIsEditModalOpen(true);
							}}
						/>
					))
				) : (
					<div className="empty-message button2">
						{activeTab === 'leader' ? '생성한 그룹이 없습니다.' : '가입한 그룹이 없습니다.'}
					</div>
				)}
			</div>

			{isEditModalOpen && selectedGroup && (
				<EditGroupModal
					studyGroupId={selectedGroup.id}
					initialData={selectedGroup}
					onClose={() => setIsEditModalOpen(false)}
				/>
			)}
		</div>
	);
};

export default MyGroupsList;
