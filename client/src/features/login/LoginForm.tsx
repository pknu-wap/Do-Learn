import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, logout } from 'api/auth/auth';

const LoginForm = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	const handleLogin = async () => {
		try {
			const res = await login(email, password);

			// ✅ 토큰 저장
			localStorage.setItem('accessToken', res.data.accessToken);
			localStorage.setItem('refreshToken', res.data.refreshToken);

			setIsLoggedIn(true);
			setErrorMsg('');
			console.log('로그인 성공:', res);

			// ✅ 메인 페이지로 이동
			navigate('/');
		} catch (err: any) {
			console.error('로그인 실패:', err);

			// ✅ 서버에서 보내는 에러 메시지 보여주기
			const msg = err.response?.data?.message || '로그인에 실패했습니다.';
			setErrorMsg(msg);
		}
	};

	const handleLogout = async () => {
		try {
			await logout();
			setIsLoggedIn(false);
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			console.log('로그아웃 성공');
		} catch (err: any) {
			alert(err.message || '로그아웃 실패');
		}
	};

	const goToSignup = () => {
		navigate('/signup');
	};

	return (
		<div style={{ padding: 20 }}>
			<h2>로그인</h2>

			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="이메일"
			/>
			<br />

			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="비밀번호"
			/>
			<br />

			<button onClick={handleLogin}>로그인</button>

			{/* ✅ 로그인 상태일 때만 로그아웃 버튼 표시 */}
			{isLoggedIn && <button onClick={handleLogout}>로그아웃</button>}

			<br />
			<br />

			{/* ✅ 회원가입 이동 버튼 */}
			<button onClick={goToSignup}>회원가입</button>

			{/* ✅ 에러 메시지 표시 */}
			{errorMsg && <p style={{ color: 'red', marginTop: 10 }}>{errorMsg}</p>}
		</div>
	);
};

export default LoginForm;
