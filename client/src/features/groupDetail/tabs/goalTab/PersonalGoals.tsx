import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './PersonalGoals.scss';

interface PersonalGoalsProps {
	studyGroupId: number;
}

const PersonalGoals = ({ studyGroupId }: PersonalGoalsProps) => {
	const dailyGoals = {
		월: ['1일 - course 1'],
		화: ['1일 - course 1'],
		수: ['공동 목표가 모달로...', '목표 페이지 스크롤 O'],
	};

	return (
		<div className="personal-goal-section">
			{Object.entries(dailyGoals).map(([day, goals]) => (
				<div key={day} className="day-row">
					<div className="day">{day}</div>
					<ul>
						{goals.map((goal, idx) => (
							<li key={idx}>
								<input type="checkbox" />
								{goal}
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
};

export default PersonalGoals;
