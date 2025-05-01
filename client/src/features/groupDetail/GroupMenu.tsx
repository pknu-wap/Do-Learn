import { CalendarDays, Megaphone, Trophy } from 'lucide-react'; // 아이콘 가져오기
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './GroupMenu.scss';

const GroupMenu = () => {
	return (
		<div className="group-menu-top body3">
			<div className="group-menu flex-center">
				<div className="group-menu-item flex-row-between">
					<div className="menu-item-group flex-col-center">
						<div className="menu-item flex-center">
							<CalendarDays size={32} strokeWidth={1.5} />
						</div>
						<div className="menu-title">출석체크</div>
					</div>
					<div className="menu-item-group flex-col-center">
						<div className="menu-item flex-center">
							<Megaphone size={32} strokeWidth={1.5} />
						</div>
						<div className="menu-title">공지</div>
					</div>
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
