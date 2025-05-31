package com.wap.web1.scheduler;

import com.wap.web1.domain.StudyGroup;
import com.wap.web1.repository.StudyGroupRepository;
import com.wap.web1.service.RankingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class RankingScheduler {

    private final RankingService rankingService;
    private final StudyGroupRepository studyGroupRepository;

    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    public void updateAllGroupRankings() {
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Seoul"));
        List<StudyGroup> allGroups = studyGroupRepository.findAll();

        for(StudyGroup group : allGroups) {
            updateGroupRankingAsync(group.getId(),today);
        }
    }

    @Async
    public void updateGroupRankingAsync(Long studyGroupId, LocalDate today) {
        try{
            rankingService.updateWeeklyRanking(studyGroupId,today);
            log.info("[랭킹 갱신 완료]그룹 ID : {}, studyGroupId");
        } catch(Exception e) {
            log.error("[랭킹 갱신 실패] 그룹 ID : {},{}",studyGroupId,e.getMessage(),e);
        }
    }
}
