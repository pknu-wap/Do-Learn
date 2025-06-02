import React, {
	useState,
	useEffect,
	useRef,
	useLayoutEffect,
	useCallback,
} from 'react';
import { getMyPageInfo, updateMyPageInfo } from 'api/myInfoApi';
import { Pencil } from 'lucide-react';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './Profile.scss';

import {
	userProfileImageMap,
	getUserProfileImageUrl,
} from 'utils/profileImageMap';

interface UserState {
	profileImageId: number;
	nickname: string;
}

const Profile: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<UserState | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState('');
	const [isImageModalOpen, setIsImageModalOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	// 중복 실행 방지
	const isSavingRef = useRef(false);
	const enterTriggeredRef = useRef(false);

	// 1) 사용자 정보 불러오기
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

	// 2) input width 자동 조정
	useLayoutEffect(() => {
		if (!inputRef.current) return;
		const text = isEditing ? draft : user?.nickname || '';
		const span = document.createElement('span');
		Object.assign(span.style, {
			visibility: 'hidden',
			position: 'absolute',
			whiteSpace: 'pre',
			font: getComputedStyle(inputRef.current).font,
		});
		span.textContent = text;
		document.body.appendChild(span);
		inputRef.current.style.width = `${span.offsetWidth + 8}px`;
		document.body.removeChild(span);
	}, [draft, isEditing, user?.nickname]);

	// 3) 연필 클릭 → 편집 모드
	const handleEditClick = useCallback(() => {
		setIsEditing(true);
		setTimeout(() => inputRef.current?.focus(), 0);
	}, []);

	// 4) 저장 로직
	const saveNickname = useCallback(async () => {
		if (!user || isSavingRef.current) return;
		isSavingRef.current = true;

		const trimmed = draft.trim();
		if (trimmed.length < 2 || trimmed.length > 10) {
			alert('닉네임은 2~10자 사이로 입력해주세요.');
			isSavingRef.current = false;
			return;
		}
		if (trimmed === user.nickname) {
			setIsEditing(false);
			isSavingRef.current = false;
			return;
		}

		try {
			await updateMyPageInfo({ nickname: trimmed });
			setUser((u) => (u ? { ...u, nickname: trimmed } : u));
			setIsEditing(false);
		} catch (error: any) {
			const status = error.response?.status;
			const serverMsg = error.response?.data?.message || '';

			if (status === 400 && serverMsg.includes('이미')) {
				alert('이미 사용 중인 닉네임입니다.');
				setIsEditing(true);
				setTimeout(() => inputRef.current?.focus(), 0);
			} else if (status === 400) {
				alert('잘못된 닉네임 입니다. 오류가 발생했습니다.');
				setIsEditing(false);
			} else if (status === 401) {
				alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
				window.location.href = '/login';
			} else {
				alert('닉네임 변경 중 오류가 발생했습니다.');
				setIsEditing(false);
			}
		} finally {
			isSavingRef.current = false;
		}
	}, [draft, user]);

	// blur 핸들러: enter 이미 처리됐으면 skip
	const handleBlur = useCallback(() => {
		if (enterTriggeredRef.current) {
			enterTriggeredRef.current = false;
			return;
		}
		saveNickname();
	}, [saveNickname]);

	// keydown 핸들러: Enter
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				enterTriggeredRef.current = true;
				saveNickname();
			}
		},
		[saveNickname],
	);

	// 5) 프로필 이미지 모달 열기/선택
	const handleAvatarClick = () => setIsImageModalOpen(true);
	const handleImageSelect = async (id: number) => {
		if (!user) return;
		try {
			await updateMyPageInfo({ profileImage: id });
			setUser((u) => (u ? { ...u, profileImageId: id } : u));
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
							{(
								Object.entries(userProfileImageMap) as Array<[string, string]>
							).map(([key, src]) => {
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

			{/* 프로필 헤더 */}
			<div className="profile-page flex-center">
				<div className="profile-header flex-center">
					<div className="content flex-center">
						<img
							src={getUserProfileImageUrl(user.profileImageId)}
							alt="프로필 이미지"
							className="avatar flex-center"
							onClick={handleAvatarClick}
						/>
						<div className="name-wrapper">
							<input
								type="text"
								ref={inputRef}
								className={`body3 nickname-input ${
									isEditing ? 'editable' : ''
								}`}
								value={isEditing ? draft : user.nickname}
								readOnly={!isEditing}
								onChange={(e) => setDraft(e.target.value)}
								onBlur={handleBlur}
								onKeyDown={handleKeyDown}
							/>
							<div className="edit-box">
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
			</div>
		</>
	);
};

export default Profile;
