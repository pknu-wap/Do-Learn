import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import Header from 'features/header/Header';
import SearchBar from 'features/searchBar/SearchBar';
import Filter from 'features/filter/filter';
import StudyGroupsList from 'features/studyGroupList/StudyGroupsList';
import NavBar from 'components/NavBar';
import { useMyGroupIds } from 'hooks/useMyGroupIds';
import { useStudyGroups } from 'hooks/useStudyGroups';
import { Region, Category } from 'api/createGroupFormApi';
import { SearchGroupResponse, Group as APIGroup } from 'api/searchFilterApi';
import { isLoggedIn } from 'utils/auth';

export default function MainPage() {
	const { groups, loadMore, hasMore, loading, message } = useStudyGroups();
	const { myGroupIds } = useMyGroupIds();

	const [searchResults, setSearchResults] = useState<APIGroup[] | null>(null);
	const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
	const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
	const [selectedMeetingCycle, setSelectedMeetingCycle] = useState<'월' | '주' | null>(null);
	const [selectedMeetingCount, setSelectedMeetingCount] = useState<number | null>(null);
	const [meetingComparison, setMeetingComparison] = useState<'above' | 'below'>('above');
	const [displayedGroups, setDisplayedGroups] = useState<APIGroup[]>([]);

	const filterActive =
		selectedRegions.length > 0 ||
		selectedCategories.length > 0 ||
		selectedTimes.length > 0 ||
		selectedMeetingCycle !== null;

	useEffect(() => {
		if (filterActive && hasMore && !loading) {
			loadMore();
		}
	}, [filterActive, hasMore, loading, loadMore]);

	useEffect(() => {
		if (
			searchResults === null &&
			selectedRegions.length + selectedCategories.length + selectedTimes.length === 0 &&
			selectedMeetingCycle === null
		) {
			setDisplayedGroups(groups);
		}
	}, [groups, searchResults, selectedRegions, selectedCategories, selectedTimes, selectedMeetingCycle]);

	useEffect(() => {
		if (searchResults !== null) return;

		if (selectedRegions.length || selectedCategories.length || selectedTimes.length || selectedMeetingCycle !== null) {
			let filtered = groups;

			if (selectedRegions.length) {
				filtered = filtered.filter((g) => selectedRegions.includes(g.region as Region));
			}
			if (selectedCategories.length) {
				filtered = filtered.filter((g) => selectedCategories.includes(g.category as Category));
			}
			if (selectedTimes.length) {
				filtered = filtered.filter((g) => selectedTimes.includes(g.meetingTime));
			}
			if (selectedMeetingCycle && selectedMeetingCount != null) {
				filtered = filtered.filter((g) => {
					const [cycle, countStr] = g.meetingDays.split(' ');
					const cnt = Number(countStr.replace(/\D/g, ''));
					if (cycle !== selectedMeetingCycle) return false;
					return meetingComparison === 'above' ? cnt >= selectedMeetingCount : cnt <= selectedMeetingCount;
				});
			}

			setDisplayedGroups(filtered);
		}
	}, [
		groups,
		searchResults,
		selectedRegions,
		selectedCategories,
		selectedTimes,
		selectedMeetingCycle,
		selectedMeetingCount,
		meetingComparison,
	]);

	const handleSearchResult = (res: SearchGroupResponse | null) => {
		if (res?.groups) {
			setSearchResults(res.groups);
			setDisplayedGroups(res.groups);
		} else {
			setSearchResults(null);
		}
	};

	const finalSearchResults =
		searchResults !== null || filterActive
			? {
					groups: displayedGroups,
					nextCursor: null,
					message:
						filterActive && !loading && displayedGroups.length === 0 ? '조건에 맞는 스터디그룹이 없습니다.' : message,
				}
			: null;

	if (!isLoggedIn()) {
		return <Navigate to="/startpage" replace />;
	}

	return (
		<div>
			<Header />
			<SearchBar onSearchResult={handleSearchResult} />

			<Filter
				selectedRegions={selectedRegions}
				setSelectedRegions={setSelectedRegions}
				selectedCategories={selectedCategories}
				setSelectedCategories={setSelectedCategories}
				selectedTimes={selectedTimes}
				setSelectedTimes={setSelectedTimes}
				selectedMeetingCycle={selectedMeetingCycle}
				setSelectedMeetingCycle={setSelectedMeetingCycle}
				selectedMeetingCount={selectedMeetingCount}
				setSelectedMeetingCount={setSelectedMeetingCount}
				meetingComparison={meetingComparison}
				setMeetingComparison={setMeetingComparison}
			/>

			<StudyGroupsList searchResults={finalSearchResults} myGroupIds={myGroupIds} />
			<NavBar />
		</div>
	);
}
