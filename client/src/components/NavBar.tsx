import { useState } from 'react';
import { Home, Plus, User, ArrowLeftCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './NavBar.scss';
import StudyGroupForm from 'features/studyGroupForm/StudyGroupForm';
import { isLoggedIn } from 'utils/auth';
import LoginModal from 'components/LoginModal';

const NavBar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [isStudyGroupFormOpen, setIsStudyGroupFormOpen] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);

	const isGroupDetail = location.pathname.startsWith('/group-detail');
	const isMyPage = location.pathname === '/mypage';
	const showBackButton = isGroupDetail || isMyPage;

	const handleBack = () => {
		navigate(-1);
	};

	const handleMypageClick = () => {
		if (isLoggedIn()) {
			navigate('/mypage');
		} else {
			setShowLoginModal(true);
		}
	};

	const isActive = (path: string) => location.pathname === path;

	const openStudyGroupForm = () => {
		if (isLoggedIn()) {
			setIsStudyGroupFormOpen(true);
		} else {
			setShowLoginModal(true);
		}
	};

	const closeStudyGroupForm = () => {
		setIsStudyGroupFormOpen(false);
	};

	return (
		<>
			<nav className="nav-bar flex-center">
				<button onClick={() => navigate('/')} className={isActive('/') ? 'active' : ''}>
					<Home />
				</button>

				{showBackButton ? (
					<button onClick={handleBack} className="back-button">
						<ArrowLeftCircle />
					</button>
				) : (
					<button onClick={openStudyGroupForm} className="plus-button">
						<Plus />
					</button>
				)}

				<button onClick={handleMypageClick} className={isActive('/mypage') ? 'active' : ''}>
					<User />
				</button>
			</nav>

			<LoginModal
				visible={showLoginModal}
				onClose={() => setShowLoginModal(false)}
				onConfirm={() => {
					setShowLoginModal(false);
					navigate('/login');
				}}
			/>

			{isStudyGroupFormOpen && (
				<div
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						backgroundColor: 'rgba(0,0,0,0.2)',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						zIndex: 1500,
					}}
				>
					<div
						style={{
							background: 'white',
							borderRadius: '16px',
							padding: '32px',
							width: '300px',
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
						<StudyGroupForm onClose={closeStudyGroupForm} />
					</div>
				</div>
			)}
		</>
	);
};

export default NavBar;
