import api from './instance';
import { getAuthHeaders } from './auth';

export interface MyPageInfo {
	id: number;
	email: string;
	nickname: string;
	profileImage: number;
}

type UpdateMyPageInfoPayload = Partial<Pick<MyPageInfo, 'nickname' | 'profileImage'>>;

const getAccessToken = () => localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') || '';

// 내 정보 조회
export const getMyPageInfo = () => {
	const token = getAccessToken();
	return api.get<MyPageInfo>('/api/mypage/info', {
		headers: getAuthHeaders(),
	});
};

// 내 정보 업데이트 (명세서 반영)
export const updateMyPageInfo = (payload: UpdateMyPageInfoPayload) => {
	const token = getAccessToken();
	return api.patch<{ message: string }>('/api/mypage/updateInfo', payload, {
		headers: getAuthHeaders(),
	});
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
	const token = getAccessToken();
	return api.get<{ studygroups: JoinedGroup[] }>('/api/mypage/studygroups', {
		headers: getAuthHeaders(),
	});
};
