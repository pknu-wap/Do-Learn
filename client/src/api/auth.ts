import api from './instance';

const login = (email: string, password: string) => {
	return api.post('/auth/login', { email, password });
};

const signup = (email: string, password: string, nickname: string) => {
	return api.post('/auth/signup', { email, password, nickname });
};

const logout = () => {
	return api.post('/auth/logout');
};

// 액세스 토큰 재발급 (Refresh 헤더 사용)
const reissue = () => {
	const refreshToken = localStorage.getItem('refreshToken');
	return api.post('/auth/reissu', null, {
		headers: {
			Refresh: refreshToken || '',
		},
	});
};

export { login, signup, logout, reissue };
