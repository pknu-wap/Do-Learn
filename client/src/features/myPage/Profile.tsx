// src/features/myPage/Profile.tsx
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { getMyPageInfo, updateMyPageInfo } from 'api/myInfoApi';
import { Pencil } from 'lucide-react';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './Profile.scss';

interface UserState {
	profileImageId: number;
	nickname: string;
}

// 프로필 이미지 맵 (ID → URL)
const profileImageMap: Record<number, string> = {
	1: '/assets/profile_images/profile-1st.png',
	2: '/assets/profile_images/profile-2nd.png',
	3: '/assets/profile_images/profile-3rd.png',
	4: '/assets/profile_images/profile-default.png',
};

const Profile: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<UserState | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState('');
	const [isImageModalOpen, setIsImageModalOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	// 1) 사용자 정보 로드 (profileImageId: number 으로 받음)
	useEffect(() => {
		(async () => {
			try {
				const resp = await getMyPageInfo();
				setUser({
					profileImageId: Number(resp.data.profileImage),
					nickname: resp.data.nickname,
				});
				setDraft(resp.data.nickname);
			} catch (error: any) {
				if (error.response?.status === 401) {
					alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
					window.location.href = '/login';
				} else {
					alert('사용자 정보를 불러오는 중 오류가 발생했습니다.');
					window.location.href = '/login';
				}
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	// 2) 닉네임 입력란 자동 크기 조정
	useLayoutEffect(() => {
		if (inputRef.current) {
			const text = isEditing ? draft : user?.nickname || '';
			const span = document.createElement('span');
			span.style.visibility = 'hidden';
			span.style.position = 'absolute';
			span.style.whiteSpace = 'pre';
			span.style.font = getComputedStyle(inputRef.current).font;
			span.textContent = text;
			document.body.appendChild(span);
			inputRef.current.style.width = `${span.offsetWidth + 8}px`;
			document.body.removeChild(span);
		}
	}, [draft, isEditing, user?.nickname]);

	// 닉네임 편집 토글
	const handleEditClick = () => {
		isEditing ? handleFinishEdit() : setIsEditing(true);
	};

	// 닉네임 변경
	const handleFinishEdit = async () => {
		if (!user) return;
		const trimmed = draft.trim();
		if (trimmed.length < 2 || trimmed.length > 10) {
			alert('닉네임은 2~10자 사이로 입력해주세요.');
			return;
		}
		if (trimmed === user.nickname) {
			setIsEditing(false);
			return;
		}
		// TODO: 중복 확인 로직
		try {
			await updateMyPageInfo({ nickname: trimmed });
			setUser({ ...user, nickname: trimmed });
			setIsEditing(false);
		} catch (error: any) {
			if (error.response?.status === 401) {
				alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
				window.location.href = '/login';
			} else {
				alert('닉네임 변경 중 오류가 발생했습니다.');
			}
		}
	};

	// 아바타 클릭 → 모달 열기
	const handleAvatarClick = () => setIsImageModalOpen(true);

	// 이미지 선택 → ID 보내고 상태 업데이트
	const handleImageSelect = async (id: number) => {
		if (!user) return;
		try {
			await updateMyPageInfo({ profileImage: id }); // 백엔드에 ID 전송
			setUser({ ...user, profileImageId: id });
			setIsImageModalOpen(false);
		} catch (error: any) {
			alert('프로필 이미지 변경 중 오류가 발생했습니다.');
			console.error(error);
		}
	};

	if (loading) {
		return <div className="profile-header body2 flex-center">로딩중…</div>;
	}
	if (!user) {
		return (
			<div className="profile-header body2 flex-center">
				유저 정보를 불러올 수 없습니다.
			</div>
		);
	}

	return (
		<>
			{/* 이미지 선택 모달 */}
			{isImageModalOpen && (
				<div className="image-modal-overlay flex-center">
					<div className="image-modal body2">
						<div className="image-title heading2 flex-center">프로필 사진</div>
						<div className="image-sub-title body3 flex-center">
							마음에 드는 두런이 선택하기
						</div>
						<button
							type="button"
							className="modal-close-button"
							onClick={() => setIsImageModalOpen(false)}
							aria-label="모달 닫기"
						>
							✕
						</button>
						<div className="image-options flex-row-center">
							{Object.entries(profileImageMap).map(([key, src]) => {
								const id = Number(key);
								return (
									<img
										key={id}
										src={src}
										alt={`profile-${id}`}
										className={`image-option ${
											id === user.profileImageId ? 'selected' : ''
										}`}
										onClick={() => handleImageSelect(id)}
									/>
								);
							})}
						</div>
					</div>
				</div>
			)}

			{/* 프로필 페이지 */}
			<div className="profile-page flex-center">
				<div className="profile-header flex-center">
					<div className="content flex-center">
						<img
							src={profileImageMap[user.profileImageId] || profileImageMap[4]}
							alt="프로필 이미지"
							className="avatar flex-center"
							onClick={handleAvatarClick}
						/>
						<div className="name-wrapper flex-center">
							<input
								type="text"
								ref={inputRef}
								className={`body3 nickname-input ${isEditing ? 'editable' : ''}`}
								value={isEditing ? draft : user.nickname}
								readOnly={!isEditing}
								onChange={(e) => setDraft(e.target.value)}
								onBlur={handleFinishEdit}
								onKeyDown={(e) => e.key === 'Enter' && handleFinishEdit()}
							/>
							<button
								type="button"
								className="edit-button"
								onClick={handleEditClick}
								aria-label="닉네임 수정"
							>
								<Pencil size={12} />
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Profile;
