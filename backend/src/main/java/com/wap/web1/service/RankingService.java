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
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

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
        int deletedCount = studyRankingRepository
                .deleteByWeeklyPeriodAndStudyGroup(weeklyPeriod.getId(),studyGroupId);
        log.info("[삭제된 기존 랭킹 수] {}", deletedCount);

        List<MemberRankingDto> rankings = memberWeeklyPlanRepository
                .getWeeklyRankingForGroup(
                        studyGroupId,
                        weeklyPeriod.getStartDate(),
                        weeklyPeriod.getEndDate());

        List<StudyMember> allMembers = studyMemberRepository.findByStudyGroupId(studyGroupId);

        Map<Long, Long> memberIdToCompletedCount = rankings.stream()
                .collect(Collectors.toMap(MemberRankingDto::getMemberId, MemberRankingDto::getCompletedCount));

        for(StudyMember member : allMembers) {
            memberIdToCompletedCount.putIfAbsent(member.getId(),0L);
        }

        List<MemberRankingDto> sortedRankings = memberIdToCompletedCount.entrySet().stream()
                .sorted((e1,e2) -> Long.compare(e2.getValue(), e1.getValue())) //완료된 소목표 수 기준 내림차순 정렬
                .map(e -> new MemberRankingDto(e.getKey(),"",e.getValue()))//닉네임은 빈 문자열로 설정
                .collect(Collectors.toList());

        // 모든 멤버의 completedSubGoals가 0인지 확인
        boolean allZero = rankings.stream().allMatch(dto -> dto.getCompletedCount() == 0);

        Map<Long, Integer> memberIdToRanking = new LinkedHashMap<>();
        int currentRank = 1;
        int realRank = 1;
        Long lastCount = null;

        // 랭킹 계산( 동점자 처리 포함)
        for(int i = 0; i < sortedRankings.size(); i++) {
            MemberRankingDto dto = sortedRankings.get(i);
            Long completed = dto.getCompletedCount();

            if(lastCount != null && !completed.equals(lastCount)) {
                currentRank = realRank;
            }

            lastCount = completed;
            memberIdToRanking.put(dto.getMemberId(),currentRank);
            realRank++;
        }

        List<StudyRankDto> result = new ArrayList<>();

        for(MemberRankingDto dto : sortedRankings) {
            Long memberId = dto.getMemberId();
            int rank = memberIdToRanking.get(memberId);

            int rankLevel = allZero ? 4 : (rank >= 4 ? 4 : rank);

            StudyMember studyMember = studyMemberRepository.findById(memberId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 멤버 ID: " + memberId));

            StudyRanking studyRanking = StudyRanking.builder()
                    .weeklyPeriod(weeklyPeriod)
                    .studyGroup(studyGroup)
                    .studyMember(studyMember)
                    .completedSubGoals(dto.getCompletedCount().intValue())
                    .ranking(rank)
                    .rankLevel(rankLevel)
                    .build();

            try{
                studyRankingRepository.save(studyRanking);
            } catch(DataIntegrityViolationException e) {
                log.error("중복 저장 시도: memberId = {}, weeklyPeriodId = {}, studyGroupId = {}",
                        memberId,weeklyPeriod.getId(),studyGroupId,e);
                throw e;
            }

            StudyRankDto rankDto = StudyRankDto.builder()
                    .id(studyRanking.getId())
                    .weeklyPeriodId(weeklyPeriod.getId())
                    .studyGroupId(studyGroupId)
                    .studyMemberId(memberId)
                    .nickname(dto.getNickname())
                    .completedSubGoals(dto.getCompletedCount().intValue())
                    .ranking(rank)
                    .rankLevel(rankLevel)
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

}
