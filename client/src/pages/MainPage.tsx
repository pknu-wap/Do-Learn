import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const MainPage = () => {
	const navigate = useNavigate();

	// 임시 로그인 여부 (나중엔 전역 상태나 토큰 검사로 대체 가능)
	const isLoggedIn = false;

	const goToLogin = () => {
		navigate('/login');
	};

	const goToMyPage = () => {
		navigate('/mypage');
	};

	const goToGroup = () => {
		navigate('/group-detail/:id'); // 그룹 ID는 나중에 동적으로 설정
	};

	return (
		<div>
			{/* 임시 작성 */}
			<h1>메인 페이지</h1>

			{!isLoggedIn && <button onClick={goToLogin}>로그인</button>}
			<button onClick={goToMyPage}>마이페이지</button>
			{isLoggedIn && <p>환영합니다! 😄</p>}
			<p
				onClick={goToGroup}
				style={{
					cursor: 'pointer',
					color: 'blue',
					textDecoration: 'underline',
				}}
			>
				스터디 그룹 보러 가기
			</p>
		</div>
	);
};

export default MainPage;
