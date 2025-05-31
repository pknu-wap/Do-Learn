package com.wap.web1.util;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class WeeklyPeriodCalculator {

    private static final ZoneId KST_ZONE = ZoneId.of("Asia/Seoul");

    public static WeeklyPeriodDateRange calculateWeeklyPeriod(LocalDate referenceDate, DayOfWeek startDayOfWeek) {
        // 한국 시간 기준으로 보정
        ZonedDateTime kstNow = referenceDate.atStartOfDay(KST_ZONE);
        LocalDate baseDate = kstNow.toLocalDate();

        LocalDate startDate = calculateStartDate(baseDate,startDayOfWeek);
        LocalDate endDate = startDate.plusDays(6);

        return new WeeklyPeriodDateRange(startDate,endDate);
    }

    public static LocalDate calculateStartDate(LocalDate referenceDate, DayOfWeek startDayOfWeek) {
        DayOfWeek referenceDay = referenceDate.getDayOfWeek();
        int daysDifference = referenceDay.getValue() - startDayOfWeek.getValue();
        if(daysDifference < 0) daysDifference += 7;
        return referenceDate.minusDays(daysDifference);
    }

    public static class WeeklyPeriodDateRange {
        private final LocalDate startDate;
        private final LocalDate endDate;

        public WeeklyPeriodDateRange(LocalDate startDate,LocalDate endDate) {
            this.startDate = startDate;
            this.endDate = endDate;
        }

        public LocalDate getStartDate() {
            return startDate;
        }

        public LocalDate getEndDate() {
            return endDate;
        }
    }
}
