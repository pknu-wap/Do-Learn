import api from './instance';
import { getAuthHeaders } from './auth';

export const fetchMyGroups = async () => {
	const res = await api.get('/api/mypage/studygroups', {
		headers: {
			...getAuthHeaders(),
		},
	});
	return res.data.studygroups;
};
