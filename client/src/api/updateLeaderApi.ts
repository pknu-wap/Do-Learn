import api from './instance';
import { getAuthHeaders } from './auth';

export const updateLeaderApi = async (groupId: number, userId: number) => {
	return api.patch(
		`/api/mypage/studygroups/${groupId}/updateLeader/${userId}`,
		{},
		{
			headers: { ...getAuthHeaders() },
		},
	);
};
