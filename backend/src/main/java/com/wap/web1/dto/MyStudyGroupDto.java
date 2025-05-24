package com.wap.web1.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.wap.web1.domain.Category;
import com.wap.web1.domain.RecruitStatus;
import com.wap.web1.domain.Region;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyStudyGroupDto {
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
    private RecruitStatus recruitStatus;
    @JsonProperty("isLeader")
    private boolean isLeader;
}