import React from 'react';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './Header.scss';

interface HeaderProps {
	title?: string;
	showLogo?: boolean;
	variant?: 'default' | 'groupDetail';
}

const Header: React.FC<HeaderProps> = ({ title = '두런두런', showLogo = true, variant = 'default' }) => {
	const handleClick = () => {
		window.location.reload();
	};

	return (
		<div className={`header-wrapper flex-center heading1 ${variant}`}>
			<div className="header-item flex-row-center" onClick={handleClick} style={{ cursor: 'pointer' }}>
				{showLogo && <img src="/assets/logo.png" className="logo-img" alt="logo" />}
				<div className="title-name">{title}</div>
			</div>
		</div>
	);
};

export default Header;
