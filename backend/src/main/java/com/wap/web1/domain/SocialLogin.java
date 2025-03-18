package com.wap.web1.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "social_login")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialLogin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(length = 255)
    private String provider;

    @Column(length = 255)
    private String oauthId;
}
