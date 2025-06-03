import api from './instance';
import { getAuthHeaders } from './auth';

interface EditGroupPayload {
	name?: string;
	maxMembers?: number;
	notice?: string;
	meetingDays?: string;
	meetingTime?: string;
	meetingType?: string;
	region?: string;
	category?: string;
	type?: string;
	startDate?: string; // YYYY-MM-DD
	recruitStatus?: 'RECRUITING' | 'CLOSED';
}

export const editMyGroupApi = async (studyGroupId: number, payload: Partial<EditGroupPayload>) => {
	const response = await api.patch(`/api/mypage/studygroups/${studyGroupId}`, payload, {
		headers: {
			...getAuthHeaders(),
		},
	});
	return response.data;
};
