package com.wap.web1.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "study_ranking",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"study_group_id", "user_id","weekly_period_id"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyRanking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "weekly_period_id", nullable = false)
    private WeeklyPeriod weeklyPeriod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_group_id", nullable = false)
    private StudyGroup studyGroup;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_member_id", nullable = false)
    private StudyMember studyMember;

    // 해당 주차에 완료한 소목표 수
    private int completedSubGoals;

    @Enumerated(EnumType.STRING)
    private RankLevel rankLevel;

    private Integer ranking;

    public enum RankLevel {
        A, B, C, D
    }
}
