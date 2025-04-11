import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from 'api/auth';
import './LoginForm.scss';

const LoginForm = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const [autoLogin, setAutoLogin] = useState(false);

	const handleLogin = async () => {
		if (!email || !password) {
			setErrorMsg('이메일과 비밀번호를 모두 입력해주세요.');
			return;
		}

		try {
			const res = await login(email, password);

			if (autoLogin) {
				localStorage.setItem('accessToken', res.data.accessToken);
				localStorage.setItem('refreshToken', res.data.refreshToken);
			} else {
				sessionStorage.setItem('accessToken', res.data.accessToken);
				sessionStorage.setItem('refreshToken', res.data.refreshToken);
			}

			setErrorMsg('');
			navigate('/');
		} catch (err: any) {
			console.error('로그인 실패:', err);
			setErrorMsg('이메일 또는 비밀번호가 올바르지 않습니다.');
		}
	};

	const goToSignup = () => {
		navigate('/signup');
	};

	return (
		<div className="flex-col-center" style={{ height: '100vh' }}>
			<div className="login-container">
				<div className="login-title">로그인</div>

				<input
					className="login-input"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="이메일"
				/>

				<input
					className="login-input"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="비밀번호"
				/>
				<div className="auto-login-checkbox">
					<input
						type="checkbox"
						id="autoLogin"
						checked={autoLogin}
						onChange={() => setAutoLogin(!autoLogin)}
					/>
					<label htmlFor="autoLogin">자동 로그인</label>
				</div>
				{errorMsg && <div className="login-error">{errorMsg}</div>}

				<button className="login-button" onClick={handleLogin}>
					로그인
				</button>
				<div className="signup-page-btn" onClick={goToSignup}>
					회원가입
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
