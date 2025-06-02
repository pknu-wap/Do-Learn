import { useState, useEffect } from 'react';
import CommonGoals from './CommonGoals';
import PersonalGoals from './PersonalGoals';
import { fetchMyGroups } from 'api/myGroupsApi';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './GoalTab.scss';

interface GoalTabProps {
	studyGroupId: number;
}

const GoalTab: React.FC<GoalTabProps> = ({ studyGroupId }) => {
	const [activeTab, setActiveTab] = useState<'common' | 'personal'>('common');
	const [isLeader, setIsLeader] = useState(false);

	useEffect(() => {
		const checkLeader = async () => {
			const groups = await fetchMyGroups();
			const match = groups.find((g) => g.id === studyGroupId);
			setIsLeader(!!match?.isLeader);
		};
		checkLeader();
	}, [studyGroupId]);

	return (
		<div className="goal-tab">
			{/* 탭 버튼 */}
			<div className="goal-tab-header">
				<button
					className={`tab ${activeTab === 'common' ? 'active' : ''} body3`}
					onClick={() => setActiveTab('common')}
				>
					공통 목표
				</button>
				<button
					className={`tab ${activeTab === 'personal' ? 'active' : ''} body3`}
					onClick={() => setActiveTab('personal')}
				>
					개인 목표
				</button>
			</div>

			{/* 각 탭 콘텐츠 */}
			{activeTab === 'common' ? (
				<CommonGoals studyGroupId={studyGroupId} isLeader={isLeader} />
			) : (
				<PersonalGoals studyGroupId={studyGroupId} />
			)}
		</div>
	);
};

export default GoalTab;
