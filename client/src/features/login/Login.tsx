import React, { useState } from 'react';
import { login, logout } from 'api/auth/auth';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const handleLogin = async () => {
		try {
			const result = await login(email, password);
			console.log('로그인 성공:', result);
			setIsLoggedIn(true);
		} catch (err: any) {
			alert(err.message || '로그인 실패');
		}
	};

	const handleLogout = async () => {
		try {
			await logout();
			setIsLoggedIn(false);
			console.log('로그아웃 성공');
		} catch (err: any) {
			alert(err.message || '로그아웃 실패');
		}
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
			{isLoggedIn && <button onClick={handleLogout}>로그아웃</button>}
		</div>
	);
};

export default Login;
