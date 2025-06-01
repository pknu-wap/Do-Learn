import React, { useEffect, useState } from 'react';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './RankingTab.scss';

import { viewRanking, updateRanking, Ranking } from 'api/rankingApi';
import { fetchGroupMembers, GroupMember } from 'api/memberListApi';
import { getProfileImageUrl } from 'utils/profileImageMap';

interface MemberRanking {
	rank: number;
	displayRank: number;
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

				if (Array.isArray(data) && data.length > 0) {
					const mapped: MemberRanking[] = data.map((r) => {
						const imageId = r.ranking <= 3 ? r.ranking : 4;
						return {
							rank: r.ranking,
							displayRank: r.ranking,
							nickname: r.nickname,
							avatarUrl: getProfileImageUrl(imageId),
						};
					});
					setRankings(mapped);
				} else {
					throw new Error('no-ranking-data');
				}
			} catch (viewErr) {
				console.warn('viewRanking 실패 또는 빈 데이터:', viewErr);

				try {
					const updRes = await updateRanking(studyGroupId, dateString);
					const updatedData: Ranking[] = updRes.data;

					if (Array.isArray(updatedData) && updatedData.length > 0) {
						const mappedAfterUpdate: MemberRanking[] = updatedData.map((r) => {
							const imageId = r.ranking <= 3 ? r.ranking : 4;
							return {
								rank: r.ranking,
								displayRank: r.ranking,
								nickname: r.nickname,
								avatarUrl: getProfileImageUrl(imageId),
							};
						});
						setRankings(mappedAfterUpdate);
					} else {
						throw new Error('no-ranking-after-update');
					}
				} catch (updateErr) {
					console.warn('updateRanking 실패 또는 빈 배열:', updateErr);

					try {
						const members: GroupMember[] =
							await fetchGroupMembers(studyGroupId);

						if (Array.isArray(members) && members.length > 0) {
							const mappedMembers: MemberRanking[] = members.map((m, idx) => ({
								rank: idx + 4,
								displayRank: idx + 1,
								nickname: m.nickname,
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
							<div key={rankNum} className="flex-col-center top-container">
								<div className={`rank-card flex-col-between rank-${rankNum}`}>
									{rankNum === 1 && <div className="crown-icon" />}
									<div className="avatar">
										<img src={member.avatarUrl} alt={member.nickname} />
									</div>
									<div className="rank-number body3">{member.displayRank}</div>
								</div>
								<div className="nickname body3">{member.nickname}</div>
							</div>
						);
					})}
				</div>

				<div className="rest-list">
					{others.map((member) => (
						<div key={member.rank} className="rest-item flex-center">
							<div className="rank-num body3">{member.displayRank}.</div>
							<div className="avatar-small">
								<img src={member.avatarUrl} alt={member.nickname} />
							</div>
							<div className="nickname body3">{member.nickname}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default RankingTab;
