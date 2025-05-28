import React from 'react';
import { CalendarDays, Info, Target, Trophy } from 'lucide-react';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './GroupMenu.scss';

type TabKey = 'attendance' | 'info' | 'goal' | 'ranking';

interface Props {
	selected: TabKey | null;
	onSelectMenu: (key: TabKey) => void;
}

const GroupMenu: React.FC<Props> = ({ selected, onSelectMenu }) => {
	return (
		<div className="group-menu-top body3">
			<div className="group-menu flex-center">
				<div className="group-menu-item flex-row-between">
					<div
						className={`menu-item-group flex-col-center ${
							selected === 'attendance' ? 'active' : ''
						}`}
						onClick={() => onSelectMenu('attendance')}
					>
						<div className="menu-item flex-center">
							<CalendarDays size={32} strokeWidth={1.5} />
						</div>
						<div className="menu-title">출석체크</div>
					</div>

					<div
						className={`menu-item-group flex-col-center ${
							selected === 'info' ? 'active' : ''
						}`}
						onClick={() => onSelectMenu('info')}
					>
						<div className="menu-item flex-center">
							<Info size={32} strokeWidth={1.5} />
						</div>
						<div className="menu-title">그룹정보</div>
					</div>

					<div
						className={`menu-item-group flex-col-center ${
							selected === 'goal' ? 'active' : ''
						}`}
						onClick={() => onSelectMenu('goal')}
					>
						<div className="menu-item flex-center">
							<Target size={32} strokeWidth={1.5} />
						</div>
						<div className="menu-title">목표</div>
					</div>

					<div
						className={`menu-item-group flex-col-center ${
							selected === 'ranking' ? 'active' : ''
						}`}
						onClick={() => onSelectMenu('ranking')}
					>
						<div className="menu-item flex-center">
							<Trophy size={32} strokeWidth={1.5} />
						</div>
						<div className="menu-title">랭킹</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GroupMenu;
