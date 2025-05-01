import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import StudyGroupsList from 'features/studyGroupList/StudyGroupsList';
import Header from 'features/header/Header';
import SearchBar from 'features/searchBar/SearchBar';

const MainPage = () => {
	return (
		<div className="">
			<div>
				<Header />
				<SearchBar />
				<StudyGroupsList />
			</div>
		</div>
	);
};

export default MainPage;
