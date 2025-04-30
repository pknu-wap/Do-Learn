import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './Header.scss';

const Header = () => {
	return (
		<div className="header-wrapper flex-center">
			<div className="header-item flex-row-center">
				<img src="/assets/logo.png" className="logo-img" alt="logo" />
				<div className="title-name">두런두런</div>
			</div>
		</div>
	);
};

export default Header;
