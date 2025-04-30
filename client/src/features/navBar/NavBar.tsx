const NavBar = () => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-around',
				alignItems: 'center',
				height: '60px',
				backgroundColor: '#ffffff',
				borderTop: '1px solid #e0e0e0',
				position: 'fixed',
				bottom: 0,
				width: '390px',
				marginTop: '30px',
				zIndex: 1000,
			}}
		>
			<img
				src="/assets/menu-icon.png"
				alt="back"
				style={{ width: '20px', height: '20px', cursor: 'pointer' }}
			/>

			<img
				src="/assets/home-icon.png"
				alt="home"
				style={{ width: '20px', height: '20px', cursor: 'pointer' }}
			/>

			<img
				src="/assets/mypage-icon.png"
				alt="profile"
				style={{ width: '20px', height: '20px', cursor: 'pointer' }}
			/>
		</div>
	);
};

export default NavBar;
