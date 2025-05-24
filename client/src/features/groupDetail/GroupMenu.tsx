// src/features/groupDetail/GroupMenu.tsx
import { CalendarDays, Info, Target, Trophy } from 'lucide-react';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './GroupMenu.scss';

const GroupMenu = () => {
	return (
		<div className="group-menu-top body3">
			<div className="group-menu flex-center">
				<div className="group-menu-item flex-row-between">
					{/* 출석체크 */}
					<div className="menu-item-group flex-col-center">
						<div className="menu-item flex-center">
							<CalendarDays size={32} strokeWidth={1.5} />
						</div>
						<div className="menu-title">출석체크</div>
					</div>

					{/* 그룹정보 */}
					<div className="menu-item-group flex-col-center">
						<div className="menu-item flex-center">
							<Info size={32} strokeWidth={1.5} />
						</div>
						<div className="menu-title">그룹정보</div>
					</div>

					{/* 목표 */}
					<div className="menu-item-group flex-col-center">
						<div className="menu-item flex-center">
							<Target size={32} strokeWidth={1.5} />
						</div>
						<div className="menu-title">목표</div>
					</div>

					{/* 랭킹 */}
					<div className="menu-item-group flex-col-center">
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
