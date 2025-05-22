import NavBar from 'components/NavBar';
import Header from 'features/header/Header';
import LogoutButton from 'features/myPage/LogoutButton';
import Profile from 'features/myPage/Profile';
import MyGroupsList from 'features/myGroupsList/MyGroupsList';
// import JoinGroupList from 'features/myPage/JoinGroupList';
import '../features/header/Header.scss';
import StudyGroupsList from 'features/studyGroupList/StudyGroupsList';
import { useMyGroupIds } from 'hooks/useMyGroupIds';

const MyPage = () => {
	const { myGroupIds } = useMyGroupIds();

	return (
		<div>
			<div className="my-page-wrapper">
				<Header title="마이페이지" showLogo={false} />
			</div>
			<Profile />
			<MyGroupsList />
			<LogoutButton />
			<NavBar />
		</div>
	);
};

export default MyPage;
