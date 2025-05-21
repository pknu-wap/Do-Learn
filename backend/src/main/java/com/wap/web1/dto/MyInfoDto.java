package com.wap.web1.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyInfoDto {
    private Long id;
    private String email;
    private String nickname;
    private Integer profileImage;
}
