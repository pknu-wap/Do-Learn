import React from 'react';
import 'assets/style/global.scss';
import { useEffect } from 'react';

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

	return <div className="wrapper">{children}</div>;
};

export default Layout;
