// MainPage.tsx
import { useState } from 'react';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import StudyGroupsList from 'features/studyGroupList/StudyGroupsList';
import Header from 'features/header/Header';
import SearchBar from 'features/searchBar/SearchBar';
import { SearchGroupResponse } from 'api/searchFilterApi';

const MainPage = () => {
	const [searchResults, setSearchResults] =
		useState<SearchGroupResponse | null>(null);

	return (
		<div>
			<Header />
			<SearchBar onSearchResult={setSearchResults} />
			<StudyGroupsList searchResults={searchResults} />
		</div>
	);
};

export default MainPage;
