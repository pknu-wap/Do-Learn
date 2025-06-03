import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from 'api/auth';
import './LoginForm.scss';
import 'assets/style/_typography.scss';
import 'assets/style/_flex.scss';

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
			const rawAccess = res.headers['authorization'];
			const refreshToken = res.headers['refresh'];
			const accessToken = rawAccess?.replace('Bearer ', '');

			if (accessToken && refreshToken) {
				if (autoLogin) {
					localStorage.setItem('accessToken', accessToken);
					localStorage.setItem('refreshToken', refreshToken);
				} else {
					sessionStorage.setItem('accessToken', accessToken);
					sessionStorage.setItem('refreshToken', refreshToken);
				}
				setErrorMsg('');
				navigate('/');
			}
		} catch (err: any) {
			console.log('에러 응답 데이터:', err.response?.data);
			setErrorMsg('이메일 또는 비밀번호가 올바르지 않습니다.');
		}
	};

	const goToSignup = () => {
		navigate('/signup');
	};

	return (
		<div className="flex-col-center" style={{ height: '90vh' }}>
			<div className="login-container">
				<div className="heading2 login-title">로그인</div>
				<input
					className="login-input button2"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="이메일"
				/>
				<input
					className="login-input button2"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="비밀번호"
				/>

				<div className="auto-login-radio" onClick={() => setAutoLogin(!autoLogin)}>
					<span className={`circle ${autoLogin ? 'selected' : ''}`} />
					<label className="button2">자동 로그인</label>
				</div>

				<div className="login-error button2" style={{ visibility: errorMsg ? 'visible' : 'hidden' }}>
					{errorMsg || '　'}
				</div>

				<button className="login-button body3" onClick={handleLogin}>
					로그인
				</button>
				<div className="signup-page-btn button2" onClick={goToSignup}>
					회원가입
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
