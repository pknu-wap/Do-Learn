import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from 'pages/MainPage';
import LoginPage from 'pages/LoginPage';
import SignupPage from 'pages/SignupPage';
import MyPage from 'pages/MyPage';
import GroupPage from 'pages/GroupPage';
import Layout from 'components/Layout';
import { useEffect } from 'react';
import { reissue } from 'api/auth';

function App() {
	useEffect(() => {
		const interval = setInterval(
			() => {
				const refreshToken =
					localStorage.getItem('refreshToken') ||
					sessionStorage.getItem('refreshToken');
				if (!refreshToken) return;

				reissue()
					.then((res) => {
						const authHeader = res.headers['authorization'];

						if (!authHeader) {
							console.warn('Authorization 헤더 없음');
							return;
						}

						const newAccessToken = authHeader.replace('Bearer ', '');

						if (localStorage.getItem('refreshToken')) {
							localStorage.setItem('accessToken', newAccessToken);
						} else {
							sessionStorage.setItem('accessToken', newAccessToken);
						}
					})
					.catch((err) => {
						console.error('토큰 재발급 실패', err);
						localStorage.removeItem('accessToken');
						localStorage.removeItem('refreshToken');
						sessionStorage.removeItem('refreshToken');
						window.location.href = '/login';
					});
			},
			39 * 60 * 1000,
		);

		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<BrowserRouter>
				<Layout>
					<Routes>
						<Route path="/" element={<MainPage />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/signup" element={<SignupPage />} />
						<Route path="/mypage" element={<MyPage />} />
						<Route path="/group-detail/:studyGroupId" element={<GroupPage />} />
					</Routes>
				</Layout>
			</BrowserRouter>
		</>
	);
}

export default App;
