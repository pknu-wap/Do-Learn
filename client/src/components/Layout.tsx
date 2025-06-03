import React, { useEffect } from 'react';
import 'assets/style/global.scss';
import NavBar from './NavBar';

const Layout = ({ children }: { children: React.ReactNode }) => {
	useEffect(() => {
		const setVh = () => {
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		};

		setVh();
		window.addEventListener('resize', setVh);
		return () => window.removeEventListener('resize', setVh);
	}, []);

	return (
		<div className="wrapper">
			<div className="content">{children}</div>
			{/* <NavBar /> */}
		</div>
	);
};

export default Layout;
