import api from './instance';

const joinGroupApi = async (studyGroupId: number) => {
	const token =
		localStorage.getItem('accessToken') ||
		sessionStorage.getItem('accessToken');

	if (!token) {
		throw new Error('로그인이 필요합니다.');
	}

	try {
		const response = await api.post(`/api/main/${studyGroupId}/join`, null, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data.message;
	} catch (error) {
		console.error('스터디 가입 요청 실패:', error);
		throw error;
	}
};

export default joinGroupApi;
