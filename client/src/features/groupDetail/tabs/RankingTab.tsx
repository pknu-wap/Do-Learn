import React, { useEffect, useState } from 'react';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './RankingTab.scss';

import { viewRanking, updateRanking, Ranking } from 'api/rankingApi';
import { fetchGroupMembers, GroupMember } from 'api/memberListApi';
import { getGroupMemberProfileImageUrl } from 'utils/profileImageMap';

interface MemberRanking {
	rank: number; // 1, 2, 3은 포디엄 자리, 4 이상은 rest-list
	displayRank: number; // UI에 보여줄 순번
	nickname: string;
	avatarUrl: string;
}

interface RankingTabProps {
	studyGroupId: number;
}

const RankingTab: React.FC<RankingTabProps> = ({ studyGroupId }) => {
	const [rankings, setRankings] = useState<MemberRanking[]>([]);

	useEffect(() => {
		const fetchAndMerge = async () => {
			let members: GroupMember[] = [];
			try {
				members = await fetchGroupMembers(studyGroupId);
			} catch {
				members = [];
			}

			let rankingData: Ranking[] = [];
			const today = new Date();
			const year = today.getFullYear();
			const month = String(today.getMonth() + 1).padStart(2, '0');
			const day = String(today.getDate()).padStart(2, '0');
			const dateString = `${year}-${month}-${day}`;

			try {
				const res = await viewRanking(studyGroupId, dateString);
				if (Array.isArray(res.data)) {
					rankingData = res.data;
				}
			} catch {
				try {
					const updRes = await updateRanking(studyGroupId, dateString);
					if (Array.isArray(updRes.data)) {
						rankingData = updRes.data;
					}
				} catch {
					rankingData = [];
				}
			}

			// 맵: studyMemberId → Ranking 객체
			const rankedMap = new Map<number, Ranking>();
			const rankedNickSet = new Set<string>();
			rankingData.forEach((r) => {
				if (!rankedMap.has(r.studyMemberId)) {
					rankedMap.set(r.studyMemberId, r);
					rankedNickSet.add(r.nickname);
				}
			});

			const podiumMembers: MemberRanking[] = [];
			const restMembersTmp: MemberRanking[] = [];

			members.forEach((m) => {
				if (rankedNickSet.has(m.nickname)) {
					const info = Array.from(rankedMap.values()).find((r) => r.nickname === m.nickname);
					if (info) {
						const lvl = info.rankLevel;
						if (lvl <= 3) {
							podiumMembers.push({
								rank: lvl,
								displayRank: lvl,
								nickname: info.nickname,
								avatarUrl: getGroupMemberProfileImageUrl(lvl),
							});
						} else {
							restMembersTmp.push({
								rank: 4,
								displayRank: 0,
								nickname: m.nickname,
								avatarUrl: getGroupMemberProfileImageUrl(4),
							});
						}
					}
				} else {
					restMembersTmp.push({
						rank: 4,
						displayRank: 0,
						nickname: m.nickname,
						avatarUrl: getGroupMemberProfileImageUrl(4),
					});
				}
			});

			podiumMembers.sort((a, b) => a.rank - b.rank);
			const podiumCount = podiumMembers.length;

			restMembersTmp.forEach((m, idx) => {
				m.displayRank = podiumCount + idx + 1;
			});

			setRankings([...podiumMembers, ...restMembersTmp]);
		};

		fetchAndMerge();
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
						<div key={member.displayRank} className="rest-item flex-center">
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
