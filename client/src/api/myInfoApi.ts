import api from './instance';

export interface MyPageInfo {
	id: number;
	email: string;
	nickname: string;
	profileImage: string;
}

// 내 정보 조회
export const getMyPageInfo = () => {
	const token = localStorage.getItem('accessToken') || '';
	return api.get<MyPageInfo>('/mypage/info', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

// 닉네임 수정
export const updateMyNickname = (nickname: string) => {
	const token = localStorage.getItem('accessToken') || '';
	return api.patch<{ nickname: string }>(
		'/mypage/nickname',
		{ nickname },
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	);
};

export interface JoinedGroup {
	id: number;
	name: string;
	meetingDays: string;
	meetingTime: string;
	meetingType: string;
	currentMembers: number;
	maxMembers: number;
	region: string;
	category: string;
	type: string;
}

// 내가 가입한 그룹 목록 조회
export const getJoinedGroups = () => {
	const token = localStorage.getItem('accessToken') || '';
	return api.get<JoinedGroup[]>('/mypage/groups', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};
