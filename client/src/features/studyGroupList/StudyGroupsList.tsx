import React from 'react';
import { useStudyGroups } from './useStudyGroups';
import './StudyGroupsList.scss';
import 'assets/style/_flex.scss';

const StudyGroupsList = () => {
	const { groups, loadMore, hasMore, loading } = useStudyGroups();

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
		},
	];

	return (
		<div className="list-container">
			{/* 연동 후 -> groups.map */}
			{dummyGroups.map((group) => (
				<div className="list-box" key={group.id}>
					<div className="top-row flex-between">
						<div className="group-name">{group.name}</div>
						{group.meetingType && (
							<div className="meeting-type">{group.meetingType}</div>
						)}
					</div>

					<div className="middle-row flex-row">
						<div>
							<span className="info-label">주기</span> {group.meetingDays}
						</div>
						<div>
							<span className="info-label">시간</span> {group.meetingTime}
						</div>
					</div>

					<div className="bottom-row flex-row">
						<div>
							<span className="info-label">인원</span> {group.currentMembers} /{' '}
							{group.maxMembers}명
						</div>
						{group.department && (
							<div>
								<span className="info-label">학과</span> {group.department}
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	);
};

export default StudyGroupsList;
