package com.wap.web1.service;

import com.wap.web1.domain.WeeklyPeriod;
import com.wap.web1.dto.WeeklyPeriodDto;
import com.wap.web1.repository.WeeklyPeriodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class WeeklyPeriodService {

    private final WeeklyPeriodRepository weeklyPeriodRepository;

    public WeeklyPeriodDto resolveWeeklyPeriod(Long studyGroupId, LocalDate referenceDate) {
        WeeklyPeriod period = weeklyPeriodRepository
                .findByStudyGroupIdAndDateWithinPeriod(studyGroupId, referenceDate)
                .orElseThrow(()-> new IllegalArgumentException("해당 날짜에 대한 주차 정보가 없습니다."));

        return WeeklyPeriodDto.builder()
                .weeklyPeriodId(period.getId())
                .startDate(period.getStartDate())
                .endDate(period.getEndDate())
                .startDayOfWeek(period.getStartDayOfWeek())
                .build();
    }
}
