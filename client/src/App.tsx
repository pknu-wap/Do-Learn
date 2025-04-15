import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from 'pages/MainPage';
import LoginPage from 'pages/LoginPage';
import SignupPage from 'pages/SignupPage';
import MyPage from 'pages/MyPage';
import GroupPage from 'pages/GroupPage';
import Layout from 'components/Layout';
import { useEffect } from 'react';

function App() {
	return (
		<>
			<BrowserRouter>
				<Layout>
					<Routes>
						<Route path="/" element={<MainPage />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/signup" element={<SignupPage />} />
						<Route path="/mypage" element={<MyPage />} />
						<Route path="/group-detail/:id" element={<GroupPage />} />
					</Routes>
				</Layout>
			</BrowserRouter>
		</>
	);
}

export default App;
