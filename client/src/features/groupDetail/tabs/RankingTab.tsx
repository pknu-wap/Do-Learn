import React, { useEffect, useState } from 'react';
import 'assets/style/_flex.scss';
import 'assets/style/_typography.scss';
import './RankingTab.scss';

import { viewRanking, updateRanking, Ranking } from 'api/rankingApi';
import { fetchGroupMembers, GroupMember } from 'api/memberListApi';
import { getGroupMemberProfileImageUrl } from 'utils/profileImageMap';

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
			// 오늘 날짜를 yyyy-MM-dd 형식으로 계산
			const today = new Date();
			const year = today.getFullYear();
			const month = String(today.getMonth() + 1).padStart(2, '0');
			const day = String(today.getDate()).padStart(2, '0');
			const dateString = `${year}-${month}-${day}`;

			try {
				const res = await viewRanking(studyGroupId, dateString);
				const data: Ranking[] = res.data;

				if (Array.isArray(data) && data.length > 0) {
					const members: GroupMember[] = await fetchGroupMembers(studyGroupId);
					const rankedMap = new Map<number, Ranking>();
					data.forEach((r) => {
						rankedMap.set(r.studyMemberId, r);
					});
					const rankedMembers: MemberRanking[] = data.map((r) => {
						const imageId = r.ranking <= 3 ? r.ranking : 4;
						return {
							rank: r.ranking,
							displayRank: r.ranking,
							nickname: r.nickname,
							avatarUrl: getGroupMemberProfileImageUrl(imageId),
						};
					});
					rankedMembers.sort((a, b) => a.rank - b.rank);

					const nextDisplayStart =
						rankedMembers.length > 0
							? Math.max(...rankedMembers.map((m) => m.displayRank)) + 1
							: 1;

					const unranked = members.filter((m) => !rankedMap.has(m.userId));

					const unrankedMembers: MemberRanking[] = unranked.map((m, idx) => ({
						rank: 4,
						displayRank: nextDisplayStart + idx,
						nickname: m.nickname,
						avatarUrl: getGroupMemberProfileImageUrl(4),
					}));

					setRankings([...rankedMembers, ...unrankedMembers]);
				} else {
					throw new Error('no-ranking-data');
				}
			} catch (viewErr) {
				console.warn('viewRanking 실패 또는 빈 데이터:', viewErr);

				try {
					// 2) 랭킹 갱신 시도
					const updRes = await updateRanking(studyGroupId, dateString);
					const updatedData: Ranking[] = updRes.data;

					if (Array.isArray(updatedData) && updatedData.length > 0) {
						// 그룹원 전체 조회
						const members: GroupMember[] =
							await fetchGroupMembers(studyGroupId);
						const rankedMap = new Map<number, Ranking>();
						updatedData.forEach((r) => {
							rankedMap.set(r.studyMemberId, r);
						});
						const rankedMembers: MemberRanking[] = updatedData.map((r) => {
							const imageId = r.ranking <= 3 ? r.ranking : 4;
							return {
								rank: r.ranking,
								displayRank: r.ranking,
								nickname: r.nickname,
								avatarUrl: getGroupMemberProfileImageUrl(imageId),
							};
						});
						rankedMembers.sort((a, b) => a.rank - b.rank);
						const nextDisplayStart =
							rankedMembers.length > 0
								? Math.max(...rankedMembers.map((m) => m.displayRank)) + 1
								: 1;
						const unranked = members.filter((m) => !rankedMap.has(m.userId));
						const unrankedMembers: MemberRanking[] = unranked.map((m, idx) => ({
							rank: 4,
							displayRank: nextDisplayStart + idx,
							nickname: m.nickname,
							avatarUrl: getGroupMemberProfileImageUrl(4),
						}));
						setRankings([...rankedMembers, ...unrankedMembers]);
					} else {
						throw new Error('no-ranking-after-update');
					}
				} catch (updateErr) {
					console.warn('updateRanking 실패 또는 빈 배열:', updateErr);

					try {
						const members: GroupMember[] =
							await fetchGroupMembers(studyGroupId);
						const fallbackMembers: MemberRanking[] = members.map((m, idx) => ({
							rank: 4,
							displayRank: idx + 1,
							nickname: m.nickname,
							avatarUrl: getGroupMemberProfileImageUrl(4),
						}));
						setRankings(fallbackMembers);
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
				{/* ── 포디엄 (1~3등) ── */}
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

				{/* ── 4등 이하 리스트 ── */}
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
