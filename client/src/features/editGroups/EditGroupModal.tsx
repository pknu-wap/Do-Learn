import { useEffect, useState } from 'react';
import StudyGroupForm from 'features/studyGroupForm/StudyGroupForm';
import { editMyGroupApi } from 'api/editMyGroupApi';
import { fetchGroupMembers } from 'api/memberListApi';

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

	const handleSubmit = async (formData: any) => {
		const payload: any = {};

		// 초기값과 비교해서 변경된 항목만 추가
		for (const key in formData) {
			if (formData[key] !== initialData[key]) {
				payload[key] = formData[key];
			}
		}

		// 모집상태도 따로 반영
		if (recruitStatus !== initialData.recruitStatus) {
			payload.recruitStatus = recruitStatus;
		}

		if (Object.keys(payload).length === 0) {
			alert('변경된 내용이 없습니다.');
			return;
		}

		await editMyGroupApi(studyGroupId, payload);
		alert('스터디 정보가 수정되었습니다.');
		onClose();
	};

	return (
		<div className="modal">
			<div className="modal-content">
				<StudyGroupForm
					initialData={initialData}
					onSubmit={handleSubmit}
					isEdit={true}
					onClose={onClose}
					recruitStatus={recruitStatus}
					setRecruitStatus={setRecruitStatus}
				/>
			</div>
		</div>
	);
};

export default EditGroupModal;
