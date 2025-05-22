package com.wap.web1.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

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

    @Column(length = 255)
    private Integer profileImage;

    @Column(length = 255)
    private String provider;

    @Column(length = 255)
    private String oauthId;

    @Column(length = 50)
    private String role;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}