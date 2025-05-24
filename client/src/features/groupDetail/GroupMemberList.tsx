import { useEffect, useState } from 'react';
import { fetchGroupMembers } from 'api/memberListApi';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './GroupMemberList.scss';

interface Member {
	userId: number;
	nickname: string;
	profileImage: number;
}

const profileImageMap: Record<number, string> = {
	1: '/assets/profile_images/profile-1st.png',
	2: '/assets/profile_images/profile-2nd.png',
	3: '/assets/profile_images/profile-3rd.png',
	4: '/assets/profile_images/profile-default.png',
};

const GroupMemberList = ({ studyGroupId }: { studyGroupId: number }) => {
	const [members, setMembers] = useState<Member[]>([]);

	useEffect(() => {
		const loadMembers = async () => {
			try {
				const data = await fetchGroupMembers(studyGroupId);
				setMembers(data);
			} catch (error) {
				console.error('그룹 멤버 불러오기 실패:', error);
			}
		};

		loadMembers();
	}, [studyGroupId]);

	return (
		<div className="group-member body2">
			<div className="group-member-title body1">그룹 멤버</div>
			<div className="group-member-grid">
				{members.map((member) => (
					<div key={member.userId} className="member-card flex-col">
						<img
							className="avatar"
							src={profileImageMap[member.profileImage] || profileImageMap[4]}
							alt="profile"
						/>
						<div className="nickname button2">{member.nickname}</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default GroupMemberList;
