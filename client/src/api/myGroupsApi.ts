import api from './instance';
import { getAuthHeaders } from './auth';
import { StudyGroup } from './studyGroupApi';

export const fetchMyGroups = async (): Promise<StudyGroup[]> => {
	const res = await api.get('/api/mypage/studygroups', {
		headers: {
			...getAuthHeaders(),
		},
	});
	return res.data?.studygroups ?? [];
};
