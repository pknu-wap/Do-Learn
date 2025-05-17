import './Profile.scss';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getMyPageInfo, updateMyNickname } from 'api/myInfoApi';

const Profile: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<{
		profileImage: string;
		nickname: string;
	} | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState('');

	// 마이페이지 정보 로드
	useEffect(() => {
		(async () => {
			try {
				const resp = await getMyPageInfo();
				setUser({
					profileImage: resp.data.profileImage,
					nickname: resp.data.nickname,
				});
				setDraft(resp.data.nickname);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const handleEditClick = () => setIsEditing(true);

	const finishEdit = async () => {
		if (!user) return;
		const trimmed = draft.trim();
		if (trimmed && trimmed !== user.nickname) {
			await updateMyNickname(trimmed);
			setUser({ ...user, nickname: trimmed });
		}
		setIsEditing(false);
	};

	const handleBlur = () => {
		finishEdit();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			finishEdit();
		}
	};

	if (loading) {
		return <div className="profile">로딩중…</div>;
	}

	if (!user) {
		return <div className="profile">유저 정보를 불러올 수 없습니다.</div>;
	}

	return (
		<div className="profile">
			<div className="profile__image-wrapper">
				<img src={user.profileImage || ''} alt="" className="profile__image" />
			</div>
			<div className="profile__nickname-wrapper">
				<input
					type="text"
					className="profile__nickname-input"
					value={isEditing ? draft : user.nickname}
					readOnly={!isEditing}
					onChange={(e) => setDraft(e.target.value)}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
				/>
				<button
					type="button"
					className="profile__edit-button"
					onClick={handleEditClick}
				>
					<Search />
				</button>
			</div>
		</div>
	);
};

export default Profile;
