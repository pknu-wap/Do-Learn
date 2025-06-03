package com.wap.web1.controller;

import com.wap.web1.config.CurrentUser;
import com.wap.web1.dto.CustomUserDetails;
import com.wap.web1.dto.StudyRankDto;
import com.wap.web1.service.RankingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/ranking")
public class RankingController {

    private final RankingService rankingService;

    @PostMapping("/update")
    public ResponseEntity<List<StudyRankDto>> updateRanking (
            @RequestParam("groupId") Long groupId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @CurrentUser CustomUserDetails customUserDetails) {

        log.info("인증 사용자: {}",customUserDetails.getUser().getNickname());
        List<StudyRankDto> rankingResult = rankingService.updateWeeklyRanking(groupId,date);

        return ResponseEntity.ok(rankingResult);
    }

    @GetMapping("/view")
    public ResponseEntity<List<StudyRankDto>> getRanking (
            @RequestParam("groupId") Long groupId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @CurrentUser CustomUserDetails customUserDetails) {

        List<StudyRankDto> rankingList = rankingService.getSavedRanking(groupId,date);
        return ResponseEntity.ok(rankingList);
    }
}
