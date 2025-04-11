import React from 'react';
import { useStudyGroups } from './useStudyGroups';

const StudyGroupsList = () => {
	const { groups, loadMore, hasMore, loading } = useStudyGroups();

	const dummyGroups = [
		{
			id: 1,
			name: '프론트엔드 스터디',
			meetingDays: '월, 수',
			meetingTime: '19:00',
			department: '컴퓨터공학과',
			meetingType: '온라인',
			currentMembers: 3,
			maxMembers: 5,
		},
		{
			id: 2,
			name: '백엔드 스터디',
			meetingDays: '화, 목',
			meetingTime: '20:00',
			department: '소프트웨어학과',
			meetingType: '오프라인',
			currentMembers: 2,
			maxMembers: 4,
		},
		{
			id: 3,
			name: '코딩 테스트 대비',
			meetingDays: '금',
			meetingTime: '18:00',
			department: '전기전자공학과',
			meetingType: '온라인',
			currentMembers: 5,
			maxMembers: 6,
		},
		{
			id: 4,
			name: 'CS 스터디',
			meetingDays: '토',
			meetingTime: '10:00',
			department: '정보보호학과',
			meetingType: '오프라인',
			currentMembers: 4,
			maxMembers: 5,
		},
		{
			id: 5,
			name: '면접 준비 스터디',
			meetingDays: '일',
			meetingTime: '14:00',
			department: null,
			meetingType: '온라인',
			currentMembers: 2,
			maxMembers: 3,
		},
		{
			id: 6,
			name: 'AI 논문 읽기',
			meetingDays: '월, 금',
			meetingTime: '21:00',
			department: '인공지능학과',
			meetingType: null,
			currentMembers: 3,
			maxMembers: 5,
		},
	];

	return (
		<div style={{ padding: '16px' }}>
			<h2>스터디 그룹 리스트</h2>
			<div>
				{dummyGroups.map((group) => (
					<div
						key={group.id}
						style={{
							border: '1px solid #ccc',
							borderRadius: '8px',
							padding: '12px',
							marginBottom: '16px',
						}}
					>
						<div style={{ fontSize: '18px', fontWeight: 'bold' }}>
							{group.name}
						</div>
						<div style={{ marginTop: '4px' }}>
							📅 {group.meetingDays} / 🕒 {group.meetingTime}
						</div>
						<div style={{ marginTop: '4px' }}>
							👥 {group.currentMembers} / {group.maxMembers}
						</div>
						{group.department && (
							<div style={{ marginTop: '4px' }}>🎓 {group.department}</div>
						)}
						{group.meetingType && (
							<div style={{ marginTop: '4px' }}>📍 {group.meetingType}</div>
						)}
					</div>
				))}
			</div>

			{/* <ul>
				{groups.map((group) => (
					<li key={group.id}>
						<strong>{group.name}</strong> - {group.meetingDays}{' '}
						{group.meetingTime}({group.currentMembers}/{group.maxMembers})
					</li>
				))}
			</ul>

			{hasMore && (
				<button onClick={loadMore} disabled={loading}>
					{loading ? '로딩 중...' : '더 보기'}
				</button>
			)} */}
		</div>
	);
};

export default StudyGroupsList;
