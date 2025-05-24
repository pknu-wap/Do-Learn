// src/pages/MainPage.tsx
import React, { useState, useEffect } from 'react';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import Header from 'features/header/Header';
import SearchBar from 'features/searchBar/SearchBar';
import Filter from 'features/filter/filter';
import StudyGroupsList from 'features/studyGroupList/StudyGroupsList';
import { useMyGroupIds } from 'hooks/useMyGroupIds';
import { useStudyGroups } from 'hooks/useStudyGroups';
import { Region, Category } from 'api/createGroupFormApi';
import { SearchGroupResponse, Group as APIGroup } from 'api/searchFilterApi';

export default function MainPage() {
	const { groups, loadMore, hasMore, loading, message } = useStudyGroups();
	const { myGroupIds } = useMyGroupIds();

	const [searchResults, setSearchResults] = useState<APIGroup[] | null>(null);
	const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
	const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
	const [selectedMeetingCycle, setSelectedMeetingCycle] = useState<
		'월' | '주' | null
	>(null);
	const [selectedMeetingCount, setSelectedMeetingCount] = useState<
		number | null
	>(null);
	const [meetingComparison, setMeetingComparison] = useState<'above' | 'below'>(
		'above',
	);

	const [displayedGroups, setDisplayedGroups] = useState<APIGroup[]>([]);

	// infinite scroll on window
	useEffect(() => {
		const handleScroll = () => {
			if (
				window.innerHeight + window.scrollY >=
					document.body.offsetHeight - 200 &&
				hasMore &&
				!loading
			) {
				loadMore();
			}
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [hasMore, loading, loadMore]);

	// initial or reset
	useEffect(() => {
		if (
			searchResults === null &&
			selectedRegions.length +
				selectedCategories.length +
				selectedTimes.length ===
				0 &&
			selectedMeetingCycle === null
		) {
			setDisplayedGroups(groups);
		}
	}, [
		groups,
		searchResults,
		selectedRegions,
		selectedCategories,
		selectedTimes,
		selectedMeetingCycle,
	]);

	// filter logic
	useEffect(() => {
		if (searchResults !== null) return;
		if (
			selectedRegions.length ||
			selectedCategories.length ||
			selectedTimes.length ||
			selectedMeetingCycle !== null
		) {
			let filtered = groups;
			if (selectedRegions.length)
				filtered = filtered.filter((g) =>
					selectedRegions.includes(g.region as Region),
				);
			if (selectedCategories.length)
				filtered = filtered.filter((g) =>
					selectedCategories.includes(g.category as Category),
				);
			if (selectedTimes.length)
				filtered = filtered.filter((g) =>
					selectedTimes.includes(g.meetingTime),
				);
			if (selectedMeetingCycle && selectedMeetingCount != null) {
				filtered = filtered.filter((g) => {
					const [cycle, countStr] = g.meetingDays.split(' ');
					const cnt = Number(countStr.replace(/\D/g, ''));
					if (cycle !== selectedMeetingCycle) return false;
					return meetingComparison === 'above'
						? cnt >= selectedMeetingCount
						: cnt <= selectedMeetingCount;
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

	// search handler
	const handleSearchResult = (res: SearchGroupResponse | null) => {
		if (res?.groups) {
			setSearchResults(res.groups);
			setDisplayedGroups(res.groups);
		} else {
			setSearchResults(null);
		}
	};

	const finalSearchResults =
		searchResults !== null ||
		selectedRegions.length > 0 ||
		selectedCategories.length > 0 ||
		selectedTimes.length > 0 ||
		selectedMeetingCycle !== null
			? { groups: displayedGroups, nextCursor: null, message: null }
			: null;

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
			<StudyGroupsList
				searchResults={finalSearchResults}
				myGroupIds={myGroupIds}
			/>
		</div>
	);
}
