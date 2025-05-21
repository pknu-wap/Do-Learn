package com.wap.web1.jwt;

import com.wap.web1.domain.User;
import com.wap.web1.dto.CustomUserDetails;
import com.wap.web1.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.io.PrintWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
public class JWTFilter extends OncePerRequestFilter {
    private static final Logger log = LoggerFactory.getLogger(JWTFilter.class);
    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;

    public JWTFilter(JWTUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        //헤더에서 Authorization 값을 추출
        String authorizationHeader = request.getHeader("Authorization");

        // Authorization 헤더가 없으면 다음 필터로 넘김
        if(authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            log.warn("❗ Authorization 헤더 없음 또는 형식 오류: {}", authorizationHeader);
            filterChain.doFilter(request,response);
            return;
        }

        //Bearer 토큰만 추출
        String accessToken = authorizationHeader.substring(7);
        log.info("받은 JWT Access Token: {}...", accessToken.length() > 10 ? accessToken.substring(0, 10) : accessToken);  // 일부만 출력

        // 토큰 만료 여부 확인, 만료시 다음 필터로 넘기지 않음
        try{
            jwtUtil.isExpired(accessToken);
            log.info("✅ 토큰 만료 확인 통과");
        } catch (ExpiredJwtException e) {
            log.warn("❌ 만료된 토큰 사용 시도 - exp: {}", e.getClaims().getExpiration());

            //response body
            PrintWriter writer = response.getWriter();
            writer.print("access token expired");

            //response status code
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return ;
        }
        try {
            String email = jwtUtil.getEmail(accessToken);
            String role = jwtUtil.getRole(accessToken);
            log.info("🔐 토큰 내 정보 - Email: {}, Role: {}", email, role);

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> {
                        log.warn("❗ DB에 존재하지 않는 사용자 이메일: {}", email);
                        return new RuntimeException("User not found in JWTFilter");
                    });

            CustomUserDetails customUserDetails = new CustomUserDetails(user);

            Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authToken);
            log.info("✅ SecurityContext에 인증 정보 설정 완료 - userId: {}", user.getId());
        } catch (Exception e){
            log.error("❗ 토큰 처리 중 예외 발생: {}", e.getMessage(), e);
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return;
        }
        filterChain.doFilter(request,response);
    }
}
