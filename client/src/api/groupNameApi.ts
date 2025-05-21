import api from './instance';

const getAccessToken = (): string | null => {
	return (
		localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
	);
};

export const fetchGroupName = async (studyGroupId: number): Promise<string> => {
	const token = getAccessToken();

	if (!token) {
		throw new Error('액세스 토큰이 존재하지 않습니다.');
	}

	try {
		const response = await api.get(`/api/studygroup/${studyGroupId}/name`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error('그룹 이름 불러오기 실패:', error);
		throw error;
	}
};
