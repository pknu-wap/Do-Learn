package com.wap.web1.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 255)
    private String email;

    @Column(length = 255)
    private String password;

    @Column(length = 20)
    private String nickname;

    @Column(nullable = false, length = 255)
    private String profileImage;

    @Column(length = 255)
    private String provider;

    @Column(length = 255)
    private String oauthId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}