package com.wap.web1.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "personal_task")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class PersonalTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "study_member_id", nullable = false)
    private StudyMember studyMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "weekly_period_id")
    private WeeklyPeriod weeklyPeriod;

    private String content;

    @Enumerated(EnumType.STRING)
    private DayOfWeek dayofWeek;

    private boolean completed = false;

    private LocalDate date;

    private boolean deleted = false;

    private Boolean lastCompletedStatus = false;

    private LocalDateTime lastModifiedAt;
}
