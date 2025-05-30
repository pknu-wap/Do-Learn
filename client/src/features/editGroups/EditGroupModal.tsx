import { useState, useEffect } from 'react';
import StudyGroupForm from 'features/studyGroupForm/StudyGroupForm';
import { editMyGroupApi } from 'api/editMyGroupApi';
import { getGroupNotice } from 'api/groupNotice';
import { useNavigate } from 'react-router-dom';
import './EditGroupModal.scss';

interface EditGroupModalProps {
	studyGroupId: number;
	initialData: any;
	onClose: () => void;
}

const EditGroupModal: React.FC<EditGroupModalProps> = ({
	studyGroupId,
	initialData,
	onClose,
}) => {
	const [recruitStatus, setRecruitStatus] = useState<'RECRUITING' | 'CLOSED'>(
		initialData.recruitStatus,
	);
	const [fullInitialData, setFullInitialData] = useState<any>(initialData);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchNotice = async () => {
			try {
				const res = await getGroupNotice(studyGroupId);
				setFullInitialData({ ...initialData, notice: res.notice });
			} catch (e) {
				console.error('공지사항 불러오기 실패:', e);
				setFullInitialData({ ...initialData, notice: '' }); // 실패해도 폼은 열 수 있게
			}
		};
		fetchNotice();
	}, [studyGroupId]);

	const handleSubmit = async (formData: any) => {
		const payload: any = {};

		// 초기값과 비교해서 변경된 항목만 추가
		for (const key in formData) {
			if (formData[key] !== fullInitialData[key]) {
				payload[key] = formData[key];
			}
		}

		// 모집상태도 따로 반영
		if (recruitStatus !== fullInitialData.recruitStatus) {
			payload.recruitStatus = recruitStatus;
		}

		if (Object.keys(payload).length === 0) {
			alert('변경된 내용이 없습니다.');
			return;
		}

		await editMyGroupApi(studyGroupId, payload);
		navigate(0);
		onClose();
	};

	return (
		<div className="edit-group-modal-overlay" onClick={onClose}>
			<div
				className="edit-group-modal-box"
				onClick={(e) => e.stopPropagation()}
			>
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
					<div className="scroll-padding-bottom" />
				</div>
			</div>
		</div>
	);
};

export default EditGroupModal;
