package com.wap.web1.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "weekly_sub_goal")
@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class WeeklySubGoal {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "weekly_goal_id", nullable = false)
    private WeeklyGoal weeklyGoal; //어떤 대범주에 속하는 소범주인지

    private String content;

    private boolean deleted;
}
