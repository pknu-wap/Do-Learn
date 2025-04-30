import api from './instance';

const login = (email: string, password: string) => {
	return api.post(
		'auth/login',
		{ email, password },
		{
			headers: {
				Authorization: '',
			},
		},
	);
};

const signup = (email: string, password: string, nickname: string) => {
	return api.post(
		'/auth/join',
		{ email, password, nickname },
		{
			headers: {
				Authorization: '',
			},
		},
	);
};

const logout = () => {
	const refreshToken = localStorage.getItem('refreshToken');
	return api.post('/auth/logout', null, {
		headers: {
			Refresh: refreshToken || '',
		},
	});
};

const reissue = () => {
	const refreshToken = localStorage.getItem('refreshToken');
	return api.post('/auth/reissue', null, {
		headers: {
			Refresh: refreshToken || '',
		},
	});
};

export { login, signup, logout, reissue };
