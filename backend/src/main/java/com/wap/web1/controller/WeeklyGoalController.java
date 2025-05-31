package com.wap.web1.controller;

import com.wap.web1.config.CurrentUser;
import com.wap.web1.domain.User;
import com.wap.web1.dto.CustomUserDetails;
import com.wap.web1.dto.WeeklyGoalDto;
import com.wap.web1.service.WeeklyGoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/weekly-goals")
@RequiredArgsConstructor
public class WeeklyGoalController {

    private final WeeklyGoalService weeklyGoalService;

    // 대범주 생성
    @PostMapping
    public ResponseEntity<WeeklyGoalDto> createWeeklyGoal(@RequestBody WeeklyGoalDto dto,
                                                          @CurrentUser CustomUserDetails customUserDetails) {
        WeeklyGoalDto created = weeklyGoalService.createWeeklyGoal(dto, customUserDetails.getUser());
        return ResponseEntity.ok(created);
    }

    // 대범주 하나 조회
    @GetMapping("/{goalId}")
    public ResponseEntity<WeeklyGoalDto> getWeeklyGoal(@PathVariable Long goalId) {
        WeeklyGoalDto goal = weeklyGoalService.getWeeklyGoal(goalId);
        return ResponseEntity.ok(goal);
    }

    // 전체 대범주 조회
    @GetMapping
    public ResponseEntity<List<WeeklyGoalDto>> getAllWeeklyGoals(
            @RequestParam Long studyGroupId,
            @RequestParam LocalDate referenceDate,
            @RequestParam DayOfWeek startDayOfWeek
    ) {
        List<WeeklyGoalDto> goals = weeklyGoalService.getAllWeeklyGoals(studyGroupId, referenceDate, startDayOfWeek);
        return ResponseEntity.ok(goals);
    }

    // 대범주 수정
    @PutMapping("/{goalId}")
    public ResponseEntity<WeeklyGoalDto> updateWeeklyGoal(@PathVariable Long goalId,
                                                          @RequestBody WeeklyGoalDto dto,
                                                          @CurrentUser CustomUserDetails customUserDetails) {
        WeeklyGoalDto updated = weeklyGoalService.updateWeeklyGoal(goalId, dto, customUserDetails.getUser());
        return ResponseEntity.ok(updated);
    }

    // 대범주 삭제
    @DeleteMapping("/{goalId}")
    public ResponseEntity<Void> deleteWeeklyGoal(@PathVariable Long goalId,
                                                 @CurrentUser CustomUserDetails customUserDetails) {
        weeklyGoalService.deleteWeeklyGoal(goalId, customUserDetails.getUser());
        return ResponseEntity.noContent().build();
    }
}
