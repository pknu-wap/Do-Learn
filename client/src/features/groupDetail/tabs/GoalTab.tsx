import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import React from 'react';
import './GoalTab.scss';

interface GoalTabProps {
	studyGroupId: number;
}
const GoalTab: React.FC<GoalTabProps> = ({ studyGroupId }) => (
	<div className="goal-container">목표 화면 (ID: {studyGroupId})</div>
);
export default GoalTab;
