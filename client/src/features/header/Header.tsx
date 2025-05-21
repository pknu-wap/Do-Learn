import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './Header.scss';

interface HeaderProps {
	title?: string;
	showLogo?: boolean;
	variant?: 'default' | 'groupDetail';
}

const Header = ({ title = '두런두런', showLogo = true }: HeaderProps) => {
	return (
		<div className="header-wrapper flex-center heading1">
			<div className="header-item flex-row-center">
				{showLogo && (
					<img src="/assets/logo.png" className="logo-img" alt="logo" />
				)}
				<div className="title-name">{title}</div>
			</div>
		</div>
	);
};

export default Header;
