import React from 'react';

interface LoginModalProps {
	visible: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
	visible,
	onClose,
	onConfirm,
}) => {
	if (!visible) return null;

	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100vw',
				height: '100vh',
				backgroundColor: 'rgba(0, 0, 0, 0.5)',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				zIndex: 1000,
			}}
		>
			<div
				style={{
					backgroundColor: '#fff',
					padding: '2rem',
					borderRadius: '10px',
					boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
					minWidth: '300px',
					textAlign: 'center',
				}}
			>
				<p style={{ marginBottom: '1.5rem' }}>로그인이 필요한 기능입니다.</p>
				<div style={{ display: 'flex', justifyContent: 'space-around' }}>
					<button
						onClick={onConfirm}
						style={{
							padding: '0.5rem 1rem',
							backgroundColor: '#98D387',
							color: '#fff',
							border: 'none',
							borderRadius: '5px',
							cursor: 'pointer',
						}}
					>
						로그인 하러 가기
					</button>
					<button
						onClick={onClose}
						style={{
							padding: '0.5rem 1rem',
							backgroundColor: '#ccc',
							color: '#333',
							border: 'none',
							borderRadius: '5px',
							cursor: 'pointer',
						}}
					>
						닫기
					</button>
				</div>
			</div>
		</div>
	);
};

export default LoginModal;
