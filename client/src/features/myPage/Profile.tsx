import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import './Profile.scss';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import { getMyPageInfo, updateMyPageInfo } from 'api/myInfoApi';
import { Pencil } from 'lucide-react';

interface UserState {
	profileImage: string;
	nickname: string;
}

const Profile: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<UserState | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		(async () => {
			try {
				const resp = await getMyPageInfo();
				setUser({
					profileImage: resp.data.profileImage,
					nickname: resp.data.nickname,
				});
				setDraft(resp.data.nickname);
			} catch (error: any) {
				if (error.response?.status === 401) {
					alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
					window.location.href = '/login';
				} else {
					alert(
						'사용자 정보를 불러오는 중 오류가 발생했습니다. 다시 로그인해주세요.',
					);
					window.location.href = '/login';
				}
			} finally {
				setLoading(false);
			}
		})();
	}, []);

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

	const handleEditClick = () => {
		if (isEditing) {
			handleFinishEdit();
		} else {
			setIsEditing(true);
		}
	};

	const handleFinishEdit = async () => {
		if (!user) return;
		const trimmed = draft.trim();

		if (trimmed.length > 10) {
			alert('닉네임은 10자 이하로 입력해주세요.');
			return;
		}
		if (trimmed === '') {
			alert('닉네임을 입력해주세요.');
			return;
		}
		if (trimmed === user.nickname) {
			setIsEditing(false);
			return;
		}

		const isDuplicated = false; // 중복 확인 API 연동 해야함
		if (isDuplicated) {
			alert('이미 사용 중인 닉네임입니다.');
			return;
		}

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
		<div className="profile-page flex-center">
			<div className="profile-header flex-center">
				<div className="content flex-center">
					<img
						src={user.profileImage}
						alt="프로필 이미지"
						className="avatar flex-center"
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
	);
};

export default Profile;
