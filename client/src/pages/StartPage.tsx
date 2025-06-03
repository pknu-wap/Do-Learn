import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './StartPage.scss';

const StartPage: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="startpage-container flex-col">
			<div className="h1 flex-row">
				<div className="do heading1">Do</div>
				<div className="learn heading1">Learn.</div>
			</div>
			<div className="h2">
				<div className="h2-1 body3">함께할 스터디를 만들고,</div>
				<div className="h2-2 body3">같이 성장하는 여정을 시작하세요.</div>
			</div>

			<img
				src="/assets/img/good-dolearn.png"
				alt="두런이"
				className="dolearn"
				onClick={() => navigate('/login')}
				style={{ cursor: 'pointer' }}
			/>
		</div>
	);
};

export default StartPage;
