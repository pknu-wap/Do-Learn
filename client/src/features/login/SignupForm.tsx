import React, { useState } from 'react';

const SignupForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [nickname, setNickname] = useState('');

	const handleSignup = () => {
		if (password !== passwordConfirm) {
			alert('비밀번호가 일치하지 않습니다.');
			return;
		}

		// 실제 회원가입 로직 추가 예정 (예: API 호출)
		console.log('회원가입 정보:', {
			email,
			password,
			nickname,
		});

		alert('회원가입 완료!');
	};

	return (
		<div style={{ padding: 20 }}>
			<h2>회원가입</h2>

			<input
				type="email"
				placeholder="이메일"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<br />

			<input
				type="password"
				placeholder="비밀번호"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<br />

			<input
				type="password"
				placeholder="비밀번호 확인"
				value={passwordConfirm}
				onChange={(e) => setPasswordConfirm(e.target.value)}
			/>
			<br />

			<input
				type="text"
				placeholder="닉네임"
				value={nickname}
				onChange={(e) => setNickname(e.target.value)}
			/>
			<br />
			<br />

			<button onClick={handleSignup}>회원가입</button>
		</div>
	);
};

export default SignupForm;
