import api from './instance';
import { getAuthHeaders } from './auth';

const joinGroupApi = async (studyGroupId: number) => {
	try {
		const response = await api.post(`/api/main/${studyGroupId}/join`, null, {
			headers: {
				...getAuthHeaders(),
			},
		});
		return response.data.message;
	} catch (error) {
		console.error('스터디 가입 요청 실패:', error);
		throw error;
	}
};

export default joinGroupApi;
