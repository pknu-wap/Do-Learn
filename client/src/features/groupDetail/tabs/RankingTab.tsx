import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import React from 'react';
import './RankingTab.scss';

interface RankingTabProps {
	studyGroupId: number;
}
const RankingTab: React.FC<RankingTabProps> = ({ studyGroupId }) => (
	<div className="ranking-container">랭킹 화면 (ID: {studyGroupId})</div>
);
export default RankingTab;
