package com.wap.web1.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table( name = "member_weekly_plan")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class MemberWeeklyPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "study_member_id", nullable = false)
    private StudyMember studyMember;

    @ManyToOne
    @JoinColumn(name = "weekly_sub_goal_id", nullable = false)
    private WeeklySubGoal weeklySubGoal;

    @Enumerated(EnumType.STRING)
    private DayOfWeek dayofWeek;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "weekly_period_id")
    private WeeklyPeriod weeklyPeriod;

    private boolean completed;

    private LocalDate date;

    private boolean deleted = false;

    private Boolean lastCompletedStatus;

    private LocalDateTime lastModifiedAt;

    private boolean weeklyGoalCompleted = false;

    private LocalDateTime weeklyGoalCompletedAt;

    public static MemberWeeklyPlan create(StudyMember member, WeeklySubGoal subGoal, WeeklyPeriod period, LocalDate date, DayOfWeek dayOfWeek, boolean completed) {
        MemberWeeklyPlan plan = new MemberWeeklyPlan();
        plan.studyMember = member;
        plan.weeklySubGoal = subGoal;
        plan.weeklyPeriod = period;
        plan.date = date;
        plan.dayofWeek = dayOfWeek;
        plan.completed = completed;
        return plan;
    }

    public void updatePlan(LocalDate date, DayOfWeek dayOfWeek, boolean completed) {
        this.date = date;
        this.dayofWeek = dayOfWeek;
        this.completed = completed;
        this.deleted = false;
    }

    // 소목표 완료 상태 변경
    public void markCompleted(boolean newCompletedStatus, LocalDateTime now) {
        this.lastCompletedStatus = this.completed;
        this.lastModifiedAt = now;
        this.completed = newCompletedStatus;
    }

    public void markWeeklyGoalCompleted(LocalDateTime timestamp) {
        this.weeklyGoalCompleted = true;
        this.weeklyGoalCompletedAt = timestamp;
    }

    public void unmarkWeeklyGoalCompleted() {
        this.weeklyGoalCompleted = false;
        this.weeklyGoalCompletedAt = null;
    }

    public void delete() {
        this.deleted = true;
    }

    public boolean isOwnedBy(StudyMember member) {
        return this.studyMember.equals(member);
    }
}
