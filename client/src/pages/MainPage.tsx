import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import StudyGroupForm from 'features/StudyGroupForm';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import StudyGroupsList from 'features/studyGroupList/StudyGroupsList';

const MainPage = () => {
	const navigate = useNavigate();
	const [isStudyGroupFormOpen, setIsStudyGroupFormOpen] = useState(false);

	const isLoggedIn = false;

	const goToLogin = () => {
		navigate('/login');
	};

	const openStudyGroupForm = () => {
		setIsStudyGroupFormOpen(true);
	};

	const closeStudyGroupForm = () => {
		setIsStudyGroupFormOpen(false);
	};

	return (
		<div className="">
			<div>
				{/* 헤더 컴포넌트 */}
				{/* 검색 컴포넌트 */}
				<StudyGroupsList />
				{/* 하단바 컴포넌트 */}

				{!isLoggedIn && <button onClick={goToLogin}>로그인</button>}
				{isLoggedIn && <p>환영합니다! 😄</p>}

				<button onClick={openStudyGroupForm}>스터디 그룹 생성</button>

				{/* 모달 조건부 렌더링 */}
				{isStudyGroupFormOpen && (
					<div
						style={{
							position: 'fixed',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							backgroundColor: 'rgba(0,0,0,0.5)',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							zIndex: 1000,
						}}
					>
						<div
							style={{
								background: 'white',
								borderRadius: '16px',
								padding: '32px',
								width: '400px',
								position: 'relative',
								boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
							}}
						>
							<button
								onClick={closeStudyGroupForm}
								style={{
									position: 'absolute',
									top: '16px',
									right: '16px',
									fontSize: '24px',
									background: 'none',
									border: 'none',
									cursor: 'pointer',
								}}
							>
								✕
							</button>
							<StudyGroupForm />
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default MainPage;
