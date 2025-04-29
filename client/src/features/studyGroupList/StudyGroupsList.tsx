import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useStudyGroups } from '../../hooks/useStudyGroups';
import StudyGroupItem from './StudyGroupItem';
import { useInView } from 'react-intersection-observer';
import './StudyGroupsList.scss';
import 'assets/style/_flex.scss';

const StudyGroupsList = () => {
	const { groups, loadMore, hasMore, loading } = useStudyGroups();
	const [visibleCount, setVisibleCount] = useState(10);
	const observer = useRef<IntersectionObserver | null>(null);
	const lastGroupElementRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (loading) return;

			if (observer.current) observer.current.disconnect();

			observer.current = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting) {
						if (visibleCount < groups.length) {
							setVisibleCount((prev) => prev + 10); // 현재 불러온 groups 내에서 10개 더
						} else if (hasMore) {
							loadMore(); // 추가 데이터가 있으면 loadMore
						}
					}
				},
				{ rootMargin: '100px' },
			);

			if (node) observer.current.observe(node);
		},
		[loading, visibleCount, groups.length, hasMore, loadMore],
	);

	const visibleGroups = groups.slice(0, visibleCount); // 화면에 보여줄 그룹만 자르기

	const dummyGroups = [
		{
			id: 1,
			name: '프론트엔드 스터디',
			meetingDays: '주 2일',
			meetingTime: '19:00',
			department: '컴퓨터공학과',
			meetingType: '온라인',
			currentMembers: 3,
			maxMembers: 5,
			isJoined: false,
		},
		{
			id: 2,
			name: '백엔드 스터디',
			meetingDays: '주 2일',
			meetingTime: '20:00',
			department: '소프트웨어학과',
			meetingType: '오프라인',
			currentMembers: 2,
			maxMembers: 4,
			isJoined: false,
		},
		{
			id: 3,
			name: '코딩 테스트 대비',
			meetingDays: '주 1일',
			meetingTime: '18:00',
			department: '전기전자공학과',
			meetingType: '온라인',
			currentMembers: 5,
			maxMembers: 6,
			isJoined: false,
		},
		{
			id: 4,
			name: 'CS 스터디',
			meetingDays: '주 1일',
			meetingTime: '10:00',
			department: '정보보호학과',
			meetingType: '오프라인',
			currentMembers: 4,
			maxMembers: 5,
			isJoined: false,
		},
		{
			id: 5,
			name: '면접 준비 스터디',
			meetingDays: '주 1일',
			meetingTime: '14:00',
			department: null,
			meetingType: '온라인',
			currentMembers: 2,
			maxMembers: 3,
			isJoined: false,
		},
		{
			id: 6,
			name: 'AI 논문 읽기',
			meetingDays: '주 2일',
			meetingTime: '21:00',
			department: '인공지능학과',
			meetingType: null,
			currentMembers: 3,
			maxMembers: 5,
			isJoined: false,
		},
		{
			id: 7,
			name: 'UX 리서치 스터디',
			meetingDays: '주 3일',
			meetingTime: '20:00',
			department: '디자인학과',
			meetingType: '오프라인',
			currentMembers: 4,
			maxMembers: 6,
			isJoined: false,
		},
		{
			id: 8,
			name: '데이터 분석 스터디',
			meetingDays: '주 5일',
			meetingTime: '08:00',
			department: '데이터사이언스학과',
			meetingType: '온라인',
			currentMembers: 6,
			maxMembers: 6,
			isJoined: false,
		},
		{
			id: 9,
			name: '데이터 분석 스터디',
			meetingDays: '주 5일',
			meetingTime: '08:00',
			department: '데이터사이언스학과',
			meetingType: '온라인',
			currentMembers: 6,
			maxMembers: 6,
			isJoined: false,
		},
		{
			id: 10,
			name: '데이터 분석 스터디10',
			meetingDays: '주 5일',
			meetingTime: '08:00',
			department: '데이터사이언스학과',
			meetingType: '온라인',
			currentMembers: 6,
			maxMembers: 6,
			isJoined: false,
		},
		{
			id: 11,
			name: '데이터 분석 스터디11',
			meetingDays: '주 5일',
			meetingTime: '08:00',
			department: '데이터사이언스학과',
			meetingType: '온라인',
			currentMembers: 6,
			maxMembers: 6,
			isJoined: true,
		},
	];

	return (
		<div className="list-container">
			{/* 연동 후 -> groups.map */}
			{dummyGroups.map((group, index) => {
				if (index === groups.length - 1) {
					// 마지막 아이템에만 ref 연결
					return (
						<div ref={lastGroupElementRef} key={group.id}>
							<StudyGroupItem group={group} />
						</div>
					);
				} else {
					return (
						<div key={group.id}>
							<StudyGroupItem group={group} />
						</div>
					);
				}
			})}

			{loading && (
				<div className="flex-center" style={{ padding: '20px 0' }}>
					<img
						src="/assets/style/spinner.gif"
						alt="로딩 중"
						style={{ width: '40px', height: '40px' }}
					/>
				</div>
			)}
		</div>
	);
};

export default StudyGroupsList;
