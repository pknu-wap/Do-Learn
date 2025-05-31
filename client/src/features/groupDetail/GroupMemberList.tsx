import { useEffect, useState } from 'react';
import { fetchGroupMembers } from 'api/memberListApi';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './GroupMemberList.scss';
import { getProfileImageUrl } from 'utils/profileImageMap';

interface Member {
	userId: number;
	nickname: string;
	profileImage: number;
}

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
							src={getProfileImageUrl(member.profileImage)}
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
