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

	// 필터 활성화 플래그
	const filterActive =
		selectedRegions.length > 0 ||
		selectedCategories.length > 0 ||
		selectedTimes.length > 0 ||
		selectedMeetingCycle !== null;

	// 필터 사용 시 모든 페이지 불러오기
	useEffect(() => {
		if (filterActive && hasMore && !loading) {
			loadMore();
		}
	}, [filterActive, hasMore, loading, loadMore]);

	// 초기 로드 또는 필터·검색 비활성 시 전체 그룹 표시
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

	// 필터 적용 로직
	useEffect(() => {
		if (searchResults !== null) return;

		if (
			selectedRegions.length ||
			selectedCategories.length ||
			selectedTimes.length ||
			selectedMeetingCycle !== null
		) {
			let filtered = groups;

			// 지역 필터
			if (selectedRegions.length) {
				filtered = filtered.filter((g) =>
					selectedRegions.includes(g.region as Region),
				);
			}
			// 분야 필터
			if (selectedCategories.length) {
				filtered = filtered.filter((g) =>
					selectedCategories.includes(g.category as Category),
				);
			}
			// 시간대 필터
			if (selectedTimes.length) {
				filtered = filtered.filter((g) =>
					selectedTimes.includes(g.meetingTime),
				);
			}
			// 만남 횟수 필터
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

	// 검색 결과 핸들러
	const handleSearchResult = (res: SearchGroupResponse | null) => {
		if (res?.groups) {
			setSearchResults(res.groups);
			setDisplayedGroups(res.groups);
		} else {
			setSearchResults(null);
		}
	};

	// 최종 props
	const finalSearchResults =
		searchResults !== null || filterActive
			? {
					groups: displayedGroups,
					nextCursor: null,
					message:
						filterActive && !loading && displayedGroups.length === 0
							? '조건에 맞는 스터디그룹이 없습니다.'
							: message,
				}
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
