import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './SignupForm.scss';
import { signup } from 'api/auth';

const SignupForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [nickname, setNickname] = useState('');
	const [nicknameDuplicateError, setNicknameDuplicateError] = useState('');
	const navigate = useNavigate();
	const [submitError, setSubmitError] = useState('');

	const [errors, setErrors] = useState({
		email: '',
		password: '',
		passwordConfirm: '',
		nickname: '',
	});

	const [touched, setTouched] = useState({
		email: false,
		password: false,
		passwordConfirm: false,
		nickname: false,
	});

	const validateField = (field: string, value: string) => {
		switch (field) {
			case 'email':
				if (value.trim() === '') return '이메일을 입력해주세요.';
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(value)) return '이메일 형식이 올바르지 않습니다.';
				return '';
			case 'password':
				return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,15}$/.test(value)
					? ''
					: '6~15자, 소문자/대문자/특수문자 각각 1개 이상 포함해야 합니다.';
			case 'passwordConfirm':
				return value !== password ? '비밀번호가 일치하지 않습니다.' : '';
			case 'nickname':
				return value.length < 1 || value.length > 20 ? '닉네임은 1자 이상 20자 이하로 입력해주세요.' : '';
			default:
				return '';
		}
	};

	const handleChange = (field: string, value: string) => {
		switch (field) {
			case 'email':
				setEmail(value);
				break;
			case 'password':
				setPassword(value);
				break;
			case 'passwordConfirm':
				setPasswordConfirm(value);
				break;
			case 'nickname':
				setNickname(value);
				setNicknameDuplicateError('');
				break;
		}

		if (touched[field as keyof typeof touched]) {
			const errorMsg = validateField(field, value);
			setErrors((prev) => ({ ...prev, [field]: errorMsg }));
		}
	};

	const handleBlur = (field: string, value: string) => {
		setTouched((prev) => ({ ...prev, [field]: true }));
		const errorMsg = validateField(field, value);
		setErrors((prev) => ({ ...prev, [field]: errorMsg }));
	};

	const handleSignup = async () => {
		const newErrors = {
			email: validateField('email', email),
			password: validateField('password', password),
			passwordConfirm: validateField('passwordConfirm', passwordConfirm),
			nickname: validateField('nickname', nickname),
		};
		setErrors(newErrors);
		setTouched({
			email: true,
			password: true,
			passwordConfirm: true,
			nickname: true,
		});

		if (Object.values(newErrors).some((msg) => msg !== '')) return;

		try {
			const response = await signup(email, password, nickname);
			console.log('회원가입이 완료되었습니다!');
			navigate('/login');
		} catch (error: any) {
			// console.log('서버 응답 전체:', error.response?.data);

			const data = error.response?.data;
			const serverErrors = data?.errors;
			const message = data?.message;

			if (serverErrors) {
				setErrors((prev) => ({
					...prev,
					...serverErrors,
				}));
				setSubmitError('');
			} else if (typeof data === 'string' && data.includes('Email is already registered')) {
				setErrors((prev) => ({ ...prev }));
				setSubmitError('이미 등록된 이메일입니다.');
			} else if (typeof data === 'string' && data.includes('Nickname is already registered')) {
				setNicknameDuplicateError('이미 사용 중인 닉네임입니다.');
				setSubmitError('');
			} else {
				setSubmitError('알 수 없는 오류입니다.');
			}
		}
	};

	return (
		<div className="flex-col-center" style={{ height: '90vh' }}>
			<div className="form-container body3">
				<div className="heading2 form-title">회원가입</div>

				<div className="form-label">이메일*</div>
				<input
					className="form-input"
					type="email"
					value={email}
					onChange={(e) => handleChange('email', e.target.value)}
					onBlur={() => handleBlur('email', email)}
				/>
				<div
					className="signup-error"
					style={{
						visibility: touched.email && errors.email ? 'visible' : 'hidden',
					}}
				>
					{errors.email || ' '}
				</div>

				<div className="form-label">비밀번호*</div>
				<input
					className="form-input"
					type="password"
					value={password}
					onChange={(e) => handleChange('password', e.target.value)}
					onBlur={() => handleBlur('password', password)}
				/>
				<div
					className="signup-error"
					style={{
						visibility: touched.password && errors.password ? 'visible' : 'hidden',
					}}
				>
					{errors.password || ' '}
				</div>

				<div className="form-label">비밀번호 확인*</div>
				<input
					className="form-input"
					type="password"
					value={passwordConfirm}
					onChange={(e) => handleChange('passwordConfirm', e.target.value)}
					onBlur={() => handleBlur('passwordConfirm', passwordConfirm)}
				/>
				<div
					className="signup-error"
					style={{
						visibility: touched.passwordConfirm && errors.passwordConfirm ? 'visible' : 'hidden',
					}}
				>
					{errors.passwordConfirm || ' '}
				</div>

				<div className="form-label">닉네임*</div>
				<input
					className="form-input"
					type="text"
					value={nickname}
					onChange={(e) => handleChange('nickname', e.target.value)}
					onBlur={() => handleBlur('nickname', nickname)}
				/>
				<div
					className="signup-error"
					style={{
						visibility: errors.nickname || nicknameDuplicateError ? 'visible' : 'hidden',
					}}
				>
					{nicknameDuplicateError || errors.nickname || ' '}
				</div>

				<button className="signup-btn body3" onClick={handleSignup}>
					회원가입
				</button>
				{submitError && <div className="signup-error">{submitError}</div>}
			</div>
		</div>
	);
};

export default SignupForm;
