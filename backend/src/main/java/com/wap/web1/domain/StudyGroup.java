package com.wap.web1.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "study_group")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String name;

    private Integer maxMembers;

    @ManyToOne
    @JoinColumn(name = "leader_id", nullable = false)
    private User leader;

    @Column(length = 1000)
    private String notice;

    private String meetingDays;

    @Column(length = 10)
    private String meetingTime;

    private String meetingType;

    @Enumerated(EnumType.STRING)
    private Region region;

    @Enumerated(EnumType.STRING)
    private Category category;

    private String type;

    @Column
    private LocalDate startDate;//스터디 시작일(모집마감일)

    @Enumerated(EnumType.STRING)
    private RecruitStatus recruitStatus;//모집중/모집마감

    public StudyGroup(Long id) {
        this.id = id;
    }
}
