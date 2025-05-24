import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import React from 'react';
import './GroupInfoTab.scss';

interface GroupInfoTabProps {
	studyGroupId: number;
}
const GroupInfoTab: React.FC<GroupInfoTabProps> = ({ studyGroupId }) => (
	<div className="group-info-container">
		그룹 정보 화면 (ID: {studyGroupId})
	</div>
);
export default GroupInfoTab;
