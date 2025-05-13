import NavBar from 'components/NavBar';
import Header from 'features/header/Header';
import LogoutButton from 'features/myPage/LogoutButton';
import Profile from 'features/myPage/Profile';
import JoinGroupList from 'features/myPage/JoinGroupList';

const MyPage = () => {
	return (
		<div>
			<Header title="마이페이지" showLogo={false} />
			<Profile />
			<JoinGroupList />
			<LogoutButton />
			<NavBar />
		</div>
	);
};

export default MyPage;
