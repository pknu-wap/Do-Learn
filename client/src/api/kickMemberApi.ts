import api from './instance';
import { getAuthHeaders } from './auth';

export const kickMemberApi = async (groupId: number, userId: number) => {
	return api.delete(`/api/mypage/studygroups/${groupId}/kick/${userId}`, {
		headers: { ...getAuthHeaders() },
	});
};
