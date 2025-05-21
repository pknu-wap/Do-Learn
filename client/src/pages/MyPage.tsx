import NavBar from 'components/NavBar';
import Header from 'features/header/Header';
import LogoutButton from 'features/myPage/LogoutButton';
import Profile from 'features/myPage/Profile';
// import JoinGroupList from 'features/myPage/JoinGroupList';
import '../features/header/Header.scss';
import StudyGroupsList from 'features/studyGroupList/StudyGroupsList';

const MyPage = () => {
	return (
		<div>
			<div className="my-page-wrapper">
				<Header title="마이페이지" showLogo={false} />
			</div>
			<Profile />
			<StudyGroupsList searchResults={null} />
			<LogoutButton />
			<NavBar />
		</div>
	);
};

export default MyPage;
