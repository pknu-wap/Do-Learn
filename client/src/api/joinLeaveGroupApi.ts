import api from './instance';
import { getAuthHeaders } from './auth';

export const joinGroupApi = async (studyGroupId: number): Promise<string> => {
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

export const leaveStudyGroup = async (studyGroupId: number): Promise<string> => {
	try {
		const res = await api.delete(`/api/studygroup/${studyGroupId}/leave`, {
			headers: {
				...getAuthHeaders(),
			},
		});
		return res.data.message;
	} catch (error: any) {
		console.error('스터디 탈퇴 요청 실패:', error);

		const responseData = error.response?.data;
		const serverMsg =
			typeof responseData === 'string' ? responseData : (responseData?.message ?? '알 수 없는 서버 오류');

		throw new Error(serverMsg);
	}
};
