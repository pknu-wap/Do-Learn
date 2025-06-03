package com.wap.web1.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "weekly_goal")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class WeeklyGoal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="study_group_id", nullable = false)
    private StudyGroup studyGroup;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "weekly_period_id", nullable = false)
    @Embedded
    private WeeklyPeriod weeklyPeriod;

    private String mainCategory;

    private boolean deleted;
}
