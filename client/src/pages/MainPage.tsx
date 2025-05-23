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

	useEffect(() => {
		if (searchResults !== null) return;

		// 하나라도 활성화됐으면 필터 적용
		if (
			selectedRegions.length ||
			selectedCategories.length ||
			selectedTimes.length ||
			selectedMeetingCycle !== null
		) {
			let filtered = groups;

			// 지역
			if (selectedRegions.length) {
				filtered = filtered.filter((g) =>
					selectedRegions.includes(g.region as Region),
				);
			}
			// 분야
			if (selectedCategories.length) {
				filtered = filtered.filter((g) =>
					selectedCategories.includes(g.category as Category),
				);
			}
			// 시간대
			if (selectedTimes.length) {
				filtered = filtered.filter((g) =>
					selectedTimes.includes(g.meetingTime),
				);
			}
			// 만남횟수
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

	const handleSearchResult = (res: SearchGroupResponse | null) => {
		if (res?.groups) {
			setSearchResults(res.groups);
			setDisplayedGroups(res.groups);
		} else {
			setSearchResults(null);
		}
	};

	// D) StudyGroupsList에 넘길 최종 props
	const finalSearchResults =
		searchResults !== null ||
		selectedRegions.length + selectedCategories.length + selectedTimes.length >
			0 ||
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
