package com.wap.web1.dto;

import com.wap.web1.domain.Category;
import com.wap.web1.domain.Region;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Calendar;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudyGroupDto {
    private long id;
    private String name;
    private String meetingDays;
    private String meetingTime;
    private String meetingType;
    private int currentMembers;
    private int maxMembers;
    private Region region;
    private Category category;
    private String type;
    private LocalDate startDate;
}
