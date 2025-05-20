import api from './instance';

export const fetchMyGroups = async () => {
	const token =
		localStorage.getItem('accessToken') ||
		sessionStorage.getItem('accessToken');
	if (!token) throw new Error('로그인이 필요합니다.');

	const res = await api.get('/api/mypage/studygroups', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data.studygroups;
};
