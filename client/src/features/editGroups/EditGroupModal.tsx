import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudyGroupForm from 'features/studyGroupForm/StudyGroupForm';
import { editMyGroupApi } from 'api/editMyGroupApi';
import { getGroupNotice } from 'api/groupNotice';
import { deleteStudyGroup } from 'api/studyGroupApi';
import { isLoggedIn } from 'utils/auth';
import './EditGroupModal.scss';

interface EditGroupModalProps {
	studyGroupId: number;
	initialData: any;
	onClose: () => void;
}

const EditGroupModal: React.FC<EditGroupModalProps> = ({ studyGroupId, initialData, onClose }) => {
	const [recruitStatus, setRecruitStatus] = useState<'RECRUITING' | 'CLOSED'>(initialData.recruitStatus);
	const [fullInitialData, setFullInitialData] = useState<any>(initialData);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchNotice = async () => {
			try {
				if (!isLoggedIn()) {
					alert('로그인 후 이용해주세요.');
					window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
					return;
				}
				const res = await getGroupNotice(studyGroupId);
				setFullInitialData({ ...initialData, notice: res.notice });
			} catch (e: any) {
				const status = e.response?.status;
				const serverMessage = e.response?.data?.message || '';
				if (status === 401 && serverMessage === 'access token expired') {
					if (isLoggedIn()) {
						alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
					} else {
						alert('로그인 후 이용해주세요.');
					}
					window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
				} else {
					console.error('공지사항 불러오기 실패:', e);
					setFullInitialData({ ...initialData, notice: '' });
				}
			}
		};
		fetchNotice();
	}, [studyGroupId, initialData]);

	const handleSubmit = async (formData: any) => {
		const payload: any = {};
		for (const key in formData) {
			if (formData[key] !== fullInitialData[key]) {
				payload[key] = formData[key];
			}
		}
		if (recruitStatus !== fullInitialData.recruitStatus) {
			payload.recruitStatus = recruitStatus;
		}
		if (Object.keys(payload).length === 0) {
			alert('변경된 내용이 없습니다.');
			return;
		}
		try {
			if (!isLoggedIn()) {
				alert('로그인 후 이용해주세요.');
				window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
				return;
			}
			await editMyGroupApi(studyGroupId, payload);
			navigate(0);
			onClose();
		} catch (error: any) {
			const status = error.response?.status;
			const serverMessage = error.response?.data?.message || '';
			if (status === 401 && serverMessage === 'access token expired') {
				if (isLoggedIn()) {
					alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
				} else {
					alert('로그인 후 이용해주세요.');
				}
				window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
			} else {
				console.error('그룹 수정 중 오류:', error);
				alert('그룹 수정에 실패했습니다.');
			}
		}
	};

	const handleDelete = async () => {
		if (!window.confirm('정말 이 스터디 그룹을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
			return;
		}
		try {
			if (!isLoggedIn()) {
				alert('로그인 후 이용해주세요.');
				window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
				return;
			}
			const { message } = await deleteStudyGroup(studyGroupId);
			alert(message);
			navigate(0);
			onClose();
		} catch (error: any) {
			const status = error.response?.status;
			const serverMessage = error.response?.data?.message || '';
			console.error('스터디 그룹 삭제 중 오류:', error);
			if (status === 401 && serverMessage === 'access token expired') {
				if (isLoggedIn()) {
					alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
				} else {
					alert('로그인 후 이용해주세요.');
				}
				window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
			} else {
				alert('그룹 삭제에 실패했습니다.');
			}
		}
	};

	return (
		<div className="edit-group-modal-overlay" onClick={onClose}>
			<div className="edit-group-modal-box" onClick={(e) => e.stopPropagation()}>
				<button className="edit-group-modal-close" onClick={onClose}>
					✕
				</button>

				<div className="edit-group-modal-scroll-area">
					<div className="scroll-padding-top" />
					{fullInitialData ? (
						<StudyGroupForm
							initialData={fullInitialData}
							onSubmit={handleSubmit}
							isEdit={true}
							onClose={onClose}
							recruitStatus={recruitStatus}
							setRecruitStatus={setRecruitStatus}
						/>
					) : (
						<div>공지사항 불러오는 중...</div>
					)}
					<div className="delete-group-button button2" onClick={handleDelete}>
						그룹 삭제하기
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditGroupModal;
