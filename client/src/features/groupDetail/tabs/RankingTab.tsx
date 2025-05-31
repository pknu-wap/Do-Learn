import React, { useEffect, useState } from 'react';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './RankingTab.scss';

import { viewRanking, updateRanking, Ranking } from 'api/rankingApi';
import { fetchGroupMembers, GroupMember } from 'api/memberListApi';
import { getProfileImageUrl } from 'utils/profileImageMap'; // ← 새로 추가

interface MemberRanking {
	rank: number;
	nickname: string;
	avatarUrl: string;
}

interface RankingTabProps {
	studyGroupId: number;
}

const RankingTab: React.FC<RankingTabProps> = ({ studyGroupId }) => {
	const [rankings, setRankings] = useState<MemberRanking[]>([]);

	useEffect(() => {
		const fetchRankings = async () => {
			const today = new Date();
			const year = today.getFullYear();
			const month = String(today.getMonth() + 1).padStart(2, '0');
			const day = String(today.getDate()).padStart(2, '0');
			const dateString = `${year}-${month}-${day}`;

			try {
				const res = await viewRanking(studyGroupId, dateString);
				const data: Ranking[] = res.data;

				if (data.length > 0) {
					const mapped: MemberRanking[] = data.map((r) => ({
						rank: r.ranking,
						nickname: r.nickname,
						avatarUrl: getProfileImageUrl(4), // 랭킹 API에는 profileImage 정보가 없으므로 기본 이미지 사용
					}));
					setRankings(mapped);
				} else {
					throw new Error('no-ranking-data');
				}
			} catch (viewErr) {
				console.warn('viewRanking 실패 또는 빈 데이터:', viewErr);

				try {
					const updRes = await updateRanking(studyGroupId, dateString);
					const updatedData: Ranking[] = updRes.data;

					if (updatedData.length > 0) {
						const mappedAfterUpdate: MemberRanking[] = updatedData.map((r) => ({
							rank: r.ranking,
							nickname: r.nickname,
							avatarUrl: getProfileImageUrl(4),
						}));
						setRankings(mappedAfterUpdate);
					} else {
						throw new Error('no-ranking-after-update');
					}
				} catch (updateErr) {
					console.warn('updateRanking 실패 또는 데이터 없음:', updateErr);

					try {
						const members: GroupMember[] =
							await fetchGroupMembers(studyGroupId);

						if (members.length > 0) {
							const mappedMembers: MemberRanking[] = members.map((m, idx) => ({
								rank: idx + 4,
								nickname: m.nickname,
								// 이제 getProfileImageUrl로 바로 매핑
								avatarUrl: getProfileImageUrl(m.profileImage),
							}));
							setRankings(mappedMembers);
						} else {
							setRankings([]);
						}
					} catch (memberErr) {
						console.error('fetchGroupMembers 실패:', memberErr);
						setRankings([]);
					}
				}
			}
		};

		fetchRankings();
	}, [studyGroupId]);

	const top3 = rankings.filter((m) => m.rank <= 3);
	const others = rankings.filter((m) => m.rank > 3);
	const podiumOrder = [2, 1, 3] as const;

	return (
		<div className="container">
			<div className="ranking-container">
				<div className="top-three flex-row-center">
					{podiumOrder.map((rankNum) => {
						const member = top3.find((m) => m.rank === rankNum);
						if (!member) return null;

						return (
							<div key={rankNum} className="flex-col-center">
								<div className={`rank-card flex-col-between rank-${rankNum}`}>
									{rankNum === 1 && <div className="crown-icon" />}
									<div className="avatar">
										<img src={member.avatarUrl} alt={member.nickname} />
									</div>
									<div className="rank-number typo-h4">{rankNum}</div>
								</div>
								<div className="nickname typo-body">{member.nickname}</div>
							</div>
						);
					})}
				</div>

				<div className="rest-list">
					{others.map((member) => (
						<div key={member.rank} className="rest-item flex-center">
							<div className="rank-num typo-body">{member.rank}.</div>
							<div className="avatar-small">
								<img src={member.avatarUrl} alt={member.nickname} />
							</div>
							<div className="nickname typo-body">{member.nickname}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default RankingTab;
