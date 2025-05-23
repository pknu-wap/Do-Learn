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
	// 1) 기본 무한스크롤로 불러오는 전체 목록
	const { groups, loadMore, hasMore, loading, message } = useStudyGroups();
	const { myGroupIds } = useMyGroupIds();

	// 2) 검색바로 들어온 “서버 검색” 결과 (null이면 사용 안 함)
	const [searchResults, setSearchResults] = useState<APIGroup[] | null>(null);

	// 3) 드롭다운 필터 상태
	const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
	const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

	// 4) 실제 화면에 뿌릴 최종 목록
	const [displayedGroups, setDisplayedGroups] = useState<APIGroup[]>([]);

	// A) 무한스크롤(or 검색 전) & 필터 비활성 시 → 기본 groups
	useEffect(() => {
		if (
			searchResults === null &&
			selectedRegions.length +
				selectedCategories.length +
				selectedTimes.length ===
				0
		) {
			setDisplayedGroups(groups);
		}
	}, [
		groups,
		searchResults,
		selectedRegions,
		selectedCategories,
		selectedTimes,
	]);

	// B) **클라이언트 필터** 모드: 검색바 모드가 아닐 때만 실행
	useEffect(() => {
		if (searchResults !== null) return;

		// 하나라도 선택됐으면 필터 적용
		if (
			selectedRegions.length ||
			selectedCategories.length ||
			selectedTimes.length
		) {
			let filtered = groups;

			if (selectedRegions.length) {
				filtered = filtered.filter((g) =>
					selectedRegions.includes(g.region as Region),
				);
			}
			if (selectedCategories.length) {
				filtered = filtered.filter((g) =>
					selectedCategories.includes(g.category as Category),
				);
			}
			if (selectedTimes.length) {
				filtered = filtered.filter((g) =>
					selectedTimes.includes(g.meetingTime),
				);
			}

			setDisplayedGroups(filtered);
		}
	}, [
		groups,
		selectedRegions,
		selectedCategories,
		selectedTimes,
		searchResults,
	]);

	// C) 검색바 결과 들어오면 서버검색 모드로 전환
	const handleSearchResult = (res: SearchGroupResponse | null) => {
		if (res?.groups) {
			setSearchResults(res.groups);
			setDisplayedGroups(res.groups);
		} else {
			setSearchResults(null);
		}
	};

	// D) StudyGroupsList에 넘길 최종 props 계산
	const finalSearchResults =
		// 검색바 모드 or 클라이언트 필터 모드일 땐 여기로 강제 렌더링
		searchResults !== null ||
		selectedRegions.length + selectedCategories.length + selectedTimes.length >
			0
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
			/>

			<StudyGroupsList
				searchResults={finalSearchResults}
				myGroupIds={myGroupIds}
			/>
		</div>
	);
}
