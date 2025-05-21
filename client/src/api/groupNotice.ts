import api from './instance';
import { getAuthHeaders } from './auth';

export const getGroupNotice = async (groupId: number) => {
	const response = await api.get(`/api/studygroup/${groupId}/notice`, {
		headers: {
			...getAuthHeaders(),
		},
	});
	return response.data;
};
