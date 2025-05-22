import api from './instance';
import { getAuthHeaders } from './auth';

export const fetchGroupMembers = async (studyGroupId: number) => {
	const response = await api.get(`/api/studygroup/${studyGroupId}/members`, {
		headers: {
			...getAuthHeaders(),
		},
	});
	return response.data.members;
};
