import api from './instance';

export const getGroupNotice = async (groupId: number) => {
	const response = await api.get(`/api/studygroup/${groupId}/notice`);
	return response.data;
};
