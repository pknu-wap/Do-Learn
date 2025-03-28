import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from './LoginPage';

const MainPage = () => {
	const navigate = useNavigate();

	// 임시 로그인 여부 (나중엔 전역 상태나 토큰 검사로 대체 가능)
	const isLoggedIn = false;

	const goToLogin = () => {
		navigate('/login');
	};

	return (
		<div>
			<h1>메인 페이지</h1>

			{!isLoggedIn && <button onClick={goToLogin}>로그인</button>}
			{isLoggedIn && <p>환영합니다! 😄</p>}
		</div>
	);
};

export default MainPage;
