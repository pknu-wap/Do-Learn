package com.wap.web1.service;

import com.wap.web1.domain.StudyGroup;
import com.wap.web1.domain.StudyMember;
import com.wap.web1.domain.StudyRanking;
import com.wap.web1.domain.WeeklyPeriod;
import com.wap.web1.dto.MemberRankingDto;
import com.wap.web1.dto.StudyRankDto;
import com.wap.web1.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class RankingService {

    private final MemberWeeklyPlanRepository memberWeeklyPlanRepository;
    private final WeeklyPeriodRepository weeklyPeriodRepository;
    private final StudyRankingRepository studyRankingRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final StudyMemberRepository studyMemberRepository;

    @Transactional
    public List<StudyRankDto> updateWeeklyRanking(Long studyGroupId, LocalDate currentDate) {

        Optional<WeeklyPeriod> optionalPeriod =
                weeklyPeriodRepository.findPeriodByGroupAndDate(studyGroupId,currentDate);

        if(optionalPeriod.isEmpty()) {
            log.warn("그룹 {} 에 대한 {} 날짜의 주차 정보가 존재하지 않습니다.", studyGroupId,currentDate);
            return Collections.emptyList();
        }

        WeeklyPeriod weeklyPeriod = optionalPeriod.get();

        StudyGroup studyGroup = studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 스터디 그룹 ID: " + studyGroupId));

        // 기존 랭킹 삭제
        studyRankingRepository.deleteByWeeklyPeriodIdAndStudyGroupId(weeklyPeriod.getId(),studyGroupId);


        List<MemberRankingDto> rankings = memberWeeklyPlanRepository
                .getWeeklyRankingForGroup(
                        studyGroupId,
                        weeklyPeriod.getStartDate(),
                        weeklyPeriod.getEndDate());

        if(rankings.isEmpty()) return Collections.emptyList();

        int totalMembers = rankings.size();
        boolean allZero = rankings.stream().allMatch(dto -> dto.getCompletedCount() == 0);

        Map<Long, Integer> memberIdToRanking = new LinkedHashMap<>();
        Map<Long, StudyRanking.RankLevel> memberIdToRankLevel = new HashMap<>();

        int currentRank = 1;
        int realRank = 1;
        Long lastCount = null;

        // 랭킹 계산( 동점자 처리 포함)
        for(int i = 0; i < totalMembers; i++) {
            MemberRankingDto dto = rankings.get(i);
            Long completed = dto.getCompletedCount();

            if(lastCount != null && !completed.equals(lastCount)) {
                currentRank = realRank;
            }

            lastCount = completed;
            memberIdToRanking.put(dto.getMemberId(),currentRank);
            realRank++;
        }

        List<StudyRankDto> result = new ArrayList<>();

        for(MemberRankingDto dto : rankings) {
            Long memberId = dto.getMemberId();
            int rank = memberIdToRanking.get(memberId);
            StudyRanking.RankLevel level = allZero
                    ? StudyRanking.RankLevel.D
                    :getRankLevel(rank,totalMembers);

            StudyMember studyMember = studyMemberRepository.findById(memberId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 멤버 ID: " + memberId));

            StudyRanking studyRanking = StudyRanking.builder()
                    .weeklyPeriod(weeklyPeriod)
                    .studyGroup(studyGroup)
                    .studyMember(studyMember)
                    .completedSubGoals(dto.getCompletedCount().intValue())
                    .ranking(rank)
                    .rankLevel(level)
                    .build();

            studyRankingRepository.save(studyRanking);

            StudyRankDto rankDto = StudyRankDto.builder()
                    .id(studyRanking.getId())
                    .weeklyPeriodId(weeklyPeriod.getId())
                    .studyGroupId(studyGroupId)
                    .studyMemberId(memberId)
                    .nickname(dto.getNickname())
                    .completedSubGoals(dto.getCompletedCount().intValue())
                    .ranking(rank)
                    .rankLevel(level)
                    .build();
            result.add(rankDto);
        }
        return  result;
    }

    @Transactional(readOnly = true)
    public List<StudyRankDto> getSavedRanking(Long studyGroupId, LocalDate currentDate) {
        Optional<WeeklyPeriod> optionalPeriod =
                weeklyPeriodRepository.findPeriodByGroupAndDate(studyGroupId,currentDate);

        if(optionalPeriod.isEmpty()) {
            log.warn("[조회실패] groupId ={}, date ={} 에 해당 주차 정보 없음",studyGroupId,currentDate);
            return Collections.emptyList();
        }

        WeeklyPeriod weeklyPeriod = optionalPeriod.get();
        return studyRankingRepository.findRankingDtos(weeklyPeriod.getId(),studyGroupId);
    }

    private StudyRanking.RankLevel getRankLevel(int rank, int totalMembers) {
        if(totalMembers == 3) {
            return switch (rank) {
                case 0 -> StudyRanking.RankLevel.A;
                case 1 -> StudyRanking.RankLevel.B;
                default -> StudyRanking.RankLevel.C;
            };
        }
        int quartile = (int) Math.ceil(totalMembers / 4.0);
        if(rank < quartile) return StudyRanking.RankLevel.A;
        if(rank < quartile * 2) return StudyRanking.RankLevel.B;
        if(rank < quartile * 3) return StudyRanking.RankLevel.C;
        return StudyRanking.RankLevel.D;
    }
}
