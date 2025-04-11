// src/api/instance.ts
import axios, { AxiosError } from 'axios';
import { reissue } from './auth';

// axios 인스턴스 생성
const api = axios.create({
	baseURL: process.env.REACT_APP_API_ROUTE, // 실제 API URL로 교체
	withCredentials: true,
});

// 요청 인터셉터 – access token 붙이기
api.interceptors.request.use((config) => {
	const accessToken = localStorage.getItem('accessToken');
	if (accessToken) {
		config.headers['Authorization'] = `Bearer ${accessToken}`;
	}
	return config;
});

// 응답 인터셉터 – access 만료 시 자동 재발급 시도
api.interceptors.response.use(
	(response) => response,

	async (error: AxiosError) => {
		const originalRequest = error.config as any;

		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			localStorage.getItem('refreshToken')
		) {
			originalRequest._retry = true;
			try {
				const res = await reissue(); // 백엔드에 /auth/reissue 요청
				const newAccessToken = res.data.accessToken;
				localStorage.setItem('accessToken', newAccessToken);

				originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
				return api(originalRequest); // 원래 요청 재시도
			} catch (reissueError) {
				// refresh token도 만료 → 로그아웃 처리
				localStorage.removeItem('accessToken');
				localStorage.removeItem('refreshToken');
				window.location.href = '/login';
				return Promise.reject(reissueError);
			}
		}

		return Promise.reject(error);
	},
);

export default api;
