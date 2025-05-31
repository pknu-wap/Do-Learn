package com.wap.web1.controller;

import com.wap.web1.config.CurrentUser;
import com.wap.web1.domain.User;
import com.wap.web1.dto.CustomUserDetails;
import com.wap.web1.dto.WeeklySubGoalDto;
import com.wap.web1.service.WeeklySubGoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weekly-sub-goals")
@RequiredArgsConstructor
public class WeeklySubGoalController {

    private final WeeklySubGoalService subGoalService;

    // 소범주 생성
    @PostMapping("/{goalId}")
    public ResponseEntity<Void> createSubGoal(@PathVariable Long goalId,
                                              @RequestBody WeeklySubGoalDto dto,
                                              @CurrentUser CustomUserDetails customUserDetails) {
        subGoalService.createSubGoal(goalId, dto, customUserDetails.getUser());
        return ResponseEntity.ok().build();
    }

    // 소범주 수정
    @PutMapping("/{subGoalId}")
    public ResponseEntity<Void> updateSubGoal(@PathVariable Long subGoalId,
                                              @RequestBody WeeklySubGoalDto dto,
                                              @CurrentUser CustomUserDetails customUserDetails) {
        subGoalService.updateSubGoal(subGoalId, dto, customUserDetails.getUser());
        return ResponseEntity.ok().build();
    }

    // 소범주 삭제
    @DeleteMapping("/{subGoalId}")
    public ResponseEntity<Void> deleteSubGoal(@PathVariable Long subGoalId,
                                              @CurrentUser CustomUserDetails customUserDetails) {
        subGoalService.deleteSubGoal(subGoalId, customUserDetails.getUser());
        return ResponseEntity.noContent().build();
    }
}

