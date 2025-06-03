import api from './instance';
import { getAuthHeaders } from './auth';

export interface Ranking {
	id: number;
	weeklyPeriodId: number;
	studyGroupId: number;
	studyMemberId: number;
	nickname: string;
	completedSubGoals: number;
	ranking: number;
	rankLevel: number;
}

export const updateRanking = (groupId: number, date: string) => {
	return api.post<Ranking[]>('/api/ranking/update', null, {
		params: {
			groupId,
			date,
		},
		headers: getAuthHeaders(),
	});
};

export const viewRanking = (groupId: number, date: string) => {
	return api.get<Ranking[]>('/api/ranking/view', {
		params: {
			groupId,
			date,
		},
		headers: getAuthHeaders(),
	});
};
