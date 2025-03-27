// src/api/auth.tsx
import axios from 'axios';

// Axios 인스턴스 생성 (기본 URL 및 쿠키 설정 등)
const api = axios.create({
	baseURL: 'https://your-api-url.com', // 실제 API 서버 주소로 교체
	withCredentials: true, // 쿠키 포함 (로그아웃 및 리프레시 토큰 관련)
});

// 로그인 API
const login = async (email: string, password: string) => {
	try {
		const response = await api.post('/auth/login', {
			email,
			password,
		});
		return response.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || '로그인 실패');
	}
};

// 로그아웃 API
const logout = async () => {
	try {
		const response = await api.post('/auth/logout');
		return response.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || '로그아웃 실패');
	}
};

export { login, logout };
