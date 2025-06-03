package com.wap.web1.controller;

import com.wap.web1.config.CurrentUser;
import com.wap.web1.domain.User;
import com.wap.web1.dto.CustomUserDetails;
import com.wap.web1.dto.WeeklyGoalCompletionResponse;
import com.wap.web1.dto.WeeklyPlanRequest;
import com.wap.web1.dto.WeeklyPlanResponse;
import com.wap.web1.service.WeeklyPlanService;
import com.wap.web1.service.MemberWeeklyPlanService;
import com.wap.web1.service.PersonalTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/weekly-plans")
public class WeeklyPlanController {

    private final WeeklyPlanService weeklyPlanService;
    private final MemberWeeklyPlanService memberWeeklyPlanService;
    private final PersonalTaskService personalTaskService;

    // 주차별 계획 생성 또는 수정 (대범주 + 개인과제)
    @PostMapping
    public ResponseEntity<WeeklyPlanResponse> createOrUpdateWeeklyPlans(
            @CurrentUser CustomUserDetails customUserDetails,
            @RequestParam Long groupId,
            @RequestBody WeeklyPlanRequest request
    ) {
        WeeklyPlanResponse response = weeklyPlanService.createOrUpdatePlans(customUserDetails.getUser(), groupId, request);
        return ResponseEntity.ok(response);
    }

    // 주차별 계획 조회
    @GetMapping
    public ResponseEntity<WeeklyPlanResponse> getWeeklyPlans(
            @CurrentUser CustomUserDetails customUserDetails,
            @RequestParam Long groupId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate referenceDate
    ) {
        WeeklyPlanResponse response = weeklyPlanService.getWeeklyPlans(customUserDetails.getUser(), groupId, referenceDate);
        return ResponseEntity.ok(response);
    }

    // 대범주 계획 완료 상태 변경
    @PatchMapping("/member-goals/{planId}/completion")
    public ResponseEntity<WeeklyGoalCompletionResponse> updateMemberGoalCompletion(
            @CurrentUser CustomUserDetails customUserDetails,
            @PathVariable Long planId,
            @RequestParam boolean completed
    ) {
        WeeklyGoalCompletionResponse response = memberWeeklyPlanService.updateCompletion(customUserDetails.getUser(), planId, completed);
        return ResponseEntity.ok(response);
    }

    // 개인과제 완료 상태 변경
    @PatchMapping("/personal-tasks/{taskId}/completion")
    public ResponseEntity<WeeklyGoalCompletionResponse> updatePersonalTaskCompletion(
            @CurrentUser CustomUserDetails customUserDetails,
            @PathVariable Long taskId,
            @RequestParam boolean completed
    ) {
        WeeklyGoalCompletionResponse response = personalTaskService.updateCompletion(customUserDetails.getUser(), taskId, completed);
        return ResponseEntity.ok(response);
    }
}
