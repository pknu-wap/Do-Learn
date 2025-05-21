import api from './instance';
import { getAuthHeaders } from './auth';

export const fetchGroupName = async (studyGroupId: number): Promise<string> => {
	try {
		const response = await api.get(`/api/studygroup/${studyGroupId}/name`, {
			headers: {
				...getAuthHeaders(),
			},
		});
		return response.data;
	} catch (error) {
		console.error('그룹 이름 불러오기 실패:', error);
		throw error;
	}
};
