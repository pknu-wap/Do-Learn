package com.wap.web1.controller;

import com.wap.web1.dto.WeeklyPeriodDto;
import com.wap.web1.service.WeeklyPeriodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/weekly-periods")
@RequiredArgsConstructor
public class WeeklyPeriodController {

    private final WeeklyPeriodService weeklyPeriodService;

    @GetMapping("/reslove")
    public ResponseEntity<WeeklyPeriodDto> resolveWeeklyPeriod(
            @RequestParam Long studyGroupId,
            @RequestParam LocalDate referenceDate
    ){
        WeeklyPeriodDto dto = weeklyPeriodService.resolveWeeklyPeriod(studyGroupId,referenceDate);
        return ResponseEntity.ok(dto);
    }
}
