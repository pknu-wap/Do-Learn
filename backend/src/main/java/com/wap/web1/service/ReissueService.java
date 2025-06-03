package com.wap.web1.service;

import com.wap.web1.domain.RefreshToken;
import com.wap.web1.jwt.JWTUtil;
import com.wap.web1.repository.RefreshRepository;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class ReissueService {

    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;

    public ReissueService(JWTUtil jwtUtil,RefreshRepository refreshRepository) {
        this.jwtUtil = jwtUtil;
        this.refreshRepository = refreshRepository;
    }

    public String reissueTokens(String refresh) {

        // JWT 만료 확인
        try{
            jwtUtil.isExpired(refresh);
        }catch(ExpiredJwtException e) {
            throw new RuntimeException("Refresh token expired");
        }

        // 토큰이 refresh인지 확인
        String category = jwtUtil.getCategory(refresh);
        if(!category.equals("refresh")) {
            throw new RuntimeException("Invalid refresh token");
        }

        String email = jwtUtil.getEmail(refresh);
        String role = jwtUtil.getRole(refresh);

        String newAccess = jwtUtil.createJwt("access",email,role,2400000L);
        String newRefresh = jwtUtil.createJwt("refresh",email,role,86400000L);

        //Refresh 토큰 저장 DB에 기존의 Refresh 토큰 삭제 후 새 Refresh 토큰 저장
        refreshRepository.deleteByRefresh(refresh);
        addRefreshToken(email,newRefresh,86400000L);

        return newAccess + " " + newRefresh;

    }

    private void addRefreshToken(String email,String refresh,Long expiredMs) {
        Date date = new Date(System.currentTimeMillis() + expiredMs);
        RefreshToken refreshToken = RefreshToken.builder()
                .email(email)
                .refresh(refresh)
                .expiration(date.toString())
                .build();
        refreshRepository.save(refreshToken);
    }
}
