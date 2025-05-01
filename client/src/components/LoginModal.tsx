import React from 'react';
import './LoginModal.scss';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';

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
		<div className="login-modal-overlay">
			<div
				className="login-modal-box flex-col-center"
				onClick={(e) => e.stopPropagation()}
			>
				<p className="login-modal-message body3">로그인이 필요한 기능입니다.</p>
				<div className="login-modal-buttons">
					<button className="confirm-button body3" onClick={onConfirm}>
						로그인 하러 가기
					</button>
					<button className="cancel-button body3" onClick={onClose}>
						닫기
					</button>
				</div>
			</div>
		</div>
	);
};

export default LoginModal;
