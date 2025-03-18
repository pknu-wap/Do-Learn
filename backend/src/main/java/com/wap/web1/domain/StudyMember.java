package com.wap.web1.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "study_member",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"study_group_id", "user_id"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "study_group_id", nullable = false)
    private StudyGroup studyGroup;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private Status status;

    private Integer progress;

    @Enumerated(EnumType.STRING)
    private Role role;

    public enum Status {
        ACTIVE, BANNED, LEFT
    }

    public enum Role {
        LEADER, MEMBER
    }
}
