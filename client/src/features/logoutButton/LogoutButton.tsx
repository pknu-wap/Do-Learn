import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from 'api/auth';
import './LogoutButton.scss';
import 'assets/style/_flex.scss';

const LogoutButton = () => {
	const [showModal, setShowModal] = useState(false);
	const [hover, setHover] = useState(false);
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logout(); // 서버에 로그아웃 요청
		} catch (error) {
			console.error('로그아웃 요청 실패:', error);
		}

		// 토큰 제거 (성공/실패 관계없이 클라이언트에선 제거)
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		sessionStorage.removeItem('accessToken');
		sessionStorage.removeItem('refreshToken');

		setShowModal(false);
		navigate('/');
	};

	return (
		<>
			<div
				onClick={() => handleLogout()}
				className="flex-center logout-text"
				style={{ paddingTop: '100px' }}
			>
				로그아웃
			</div>
		</>
	);
};

export default LogoutButton;
