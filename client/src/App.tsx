import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from 'pages/MainPage';
import LoginPage from 'pages/LoginPage';
import SignupPage from 'pages/SignupPage';
import MyPage from 'pages/MyPage';
import GroupPage from 'pages/GroupPage';

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<MainPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/signup" element={<SignupPage />} />
					<Route path="/mypage" element={<MyPage />} />
					<Route path="/group-detail/:id" element={<GroupPage />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
