import api from './instance';
import { getAuthHeaders } from './auth';

// 서버에서 내려주는 랭킹 객체 타입
export interface Ranking {
	id: number;
	weeklyPeriodId: number;
	studyGroupId: number;
	studyMemberId: number;
	nickname: string;
	completedSubGoals: number;
	ranking: number;
	rankLevel: 'A' | 'B' | 'C' | 'D';
}

/**
 * 랭킹을 강제로 갱신하기 위한 API
 * - POST /api/ranking/update?groupId={groupId}&date={yyyy-MM-dd}
 * @param groupId 스터디 그룹 ID
 * @param date 기준 날짜 (yyyy-MM-dd)
 * @returns Promise<AxiosResponse<Ranking[]>>
 */
export const updateRanking = (groupId: number, date: string) => {
	return api.post<Ranking[]>('/api/ranking/update', null, {
		params: {
			groupId,
			date,
		},
		headers: getAuthHeaders(),
	});
};

/**
 * 이미 저장된(갱신된) 랭킹을 조회하기 위한 API
 * - GET /api/ranking/view?groupId={groupId}&date={yyyy-MM-dd}
 * @param groupId 스터디 그룹 ID
 * @param date 기준 날짜 (yyyy-MM-dd)
 * @returns Promise<AxiosResponse<Ranking[]>>
 */
export const viewRanking = (groupId: number, date: string) => {
	return api.get<Ranking[]>('/api/ranking/view', {
		params: {
			groupId,
			date,
		},
		headers: getAuthHeaders(),
	});
};
