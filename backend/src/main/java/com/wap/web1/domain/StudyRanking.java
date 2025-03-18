package com.wap.web1.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "study_ranking",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"study_group_id", "user_id"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyRanking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "study_group_id", referencedColumnName = "study_group_id"),
            @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    })
    private StudyMember studyMember;

    private Integer rank;
}
