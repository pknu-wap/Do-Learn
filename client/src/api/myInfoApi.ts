import api from './instance';

export interface MyPageInfo {
	id: number;
	email: string;
	nickname: string;
	profileImage: string;
}

// 내 정보 조회
export const getMyPageInfo = () => api.get<MyPageInfo>('/mypage/info');

// 닉네임 수정 (예시 PATCH 엔드포인트)
export const updateMyNickname = (nickname: string) =>
	api.patch<{ nickname: string }>('/mypage/nickname', { nickname });
