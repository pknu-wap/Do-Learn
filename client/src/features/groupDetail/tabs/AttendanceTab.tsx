import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './AttendanceTab.scss';
import React from 'react';

interface AttendanceTabProps {
	studyGroupId: number;
}

const AttendanceTab: React.FC<AttendanceTabProps> = ({ studyGroupId }) => {
	return (
		<div className="attendance-container">
			출석체크 화면 (그룹 ID: {studyGroupId})
		</div>
	);
};

export default AttendanceTab;
