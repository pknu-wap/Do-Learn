import NavBar from 'components/NavBar';
import LogoutButton from 'features/logoutButton/LogoutButton';

const MyPage = () => {
	return (
		<div>
			<LogoutButton />
			<NavBar />
		</div>
	);
};

export default MyPage;
