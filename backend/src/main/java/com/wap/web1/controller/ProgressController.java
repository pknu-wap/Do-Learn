package com.wap.web1.controller;

import com.wap.web1.config.CurrentUser;
import com.wap.web1.domain.StudyMember;
import com.wap.web1.domain.User;
import com.wap.web1.dto.CustomUserDetails;
import com.wap.web1.dto.WeeklyProgressDto;
import com.wap.web1.repository.StudyMemberRepository;
import com.wap.web1.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;
    private final StudyMemberRepository studyMemberRepository;

    @GetMapping
    public ResponseEntity<List<WeeklyProgressDto>> getWeeklyProgress(
            @CurrentUser CustomUserDetails customUserDetails,
            @RequestParam Long studyGroupId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)LocalDate date
    ) {
        User user = customUserDetails.getUser();

        StudyMember member = studyMemberRepository.findByStudyGroupIdAndUserId(studyGroupId,user.getId())
                .orElseThrow(() -> new IllegalArgumentException("해당 스터디 그룹이 참여하고 있지 않습니다."));

        List<WeeklyProgressDto> progressList = progressService.getWeeklyProgress(studyGroupId,date);
        return ResponseEntity.ok(progressList);
    }

    @GetMapping("/me")
    public ResponseEntity<WeeklyProgressDto> getMyWeeklyProgress(
            @CurrentUser CustomUserDetails customUserDetails,
            @RequestParam Long studyGroupId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        User user = customUserDetails.getUser();

        // 본인이 그룹에 속한지 확인
        StudyMember member = studyMemberRepository.findByStudyGroupIdAndUserId(studyGroupId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("해당 스터디 그룹에 속해있지 않습니다."));

        WeeklyProgressDto myProgress = progressService.getMyWeeklyProgress(member, date);
        return ResponseEntity.ok(myProgress);
    }
}
