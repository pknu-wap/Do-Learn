import api from './instance';

export const getGroupNotice = async (groupId: number) => {
	const accessToken =
		localStorage.getItem('accessToken') ||
		sessionStorage.getItem('accessToken');
	const response = await api.get(`/api/studygroup/${groupId}/notice`, {
		headers: {
			Authorization: accessToken ? `Bearer ${accessToken}` : '',
		},
	});
	return response.data;
};
