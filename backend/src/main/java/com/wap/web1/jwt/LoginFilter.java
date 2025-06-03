package com.wap.web1.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wap.web1.domain.RefreshToken;
import com.wap.web1.domain.User;
import com.wap.web1.dto.JoinDto;
import com.wap.web1.repository.RefreshRepository;
import com.wap.web1.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;

@Slf4j
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public LoginFilter(AuthenticationManager authenticationManager,JWTUtil jwtUtil,RefreshRepository refreshRepository,BCryptPasswordEncoder passwordEncoder,UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.refreshRepository = refreshRepository;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;

        setFilterProcessesUrl("/auth/login");
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        log.info("LoginFilter: Attempting authentication...");
        log.info("Attempting authentication for email: " + request.getParameter("email"));
        try{
            ObjectMapper objectMapper = new ObjectMapper();
            JoinDto joinDto = objectMapper.readValue(request.getInputStream(), JoinDto.class);
            String email = joinDto.getEmail();
            String password = joinDto.getPassword();

            // 이메일과 비밀번호가 제대로 파싱되었는지 확인
            log.info("Received login attempt for email: " + email + " with password: " + password);

            if (email == null || password == null) {
                throw new BadCredentialsException("email or password not provided");
            }

            User user = userRepository.findByEmail(email).orElse(null);
            if(user == null || !passwordEncoder.matches(password,user.getPassword())) {
                throw new BadCredentialsException("Invalid email or password");
            }
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email,password);
            return authenticationManager.authenticate(authToken);
        }
        catch (IOException e) {
            throw new BadCredentialsException("Invalid request format",e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain,Authentication authentication) {

        //유저 정보
        String email = authentication.getName();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        //토큰 생성
        String access = jwtUtil.createJwt("access",email,role,2400000L);
        String refresh = jwtUtil.createJwt("refresh",email,role,86400000L);

        addRefreshToken(email,refresh,86400000L);

        //응답 설정
        response.setHeader("Authorization", "Bearer " + access);
        response.setHeader("Refresh",refresh);
        response.setStatus(HttpStatus.OK.value());

        log.info("Authentication successful for user: "+authentication.getName());

    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                              AuthenticationException failed) throws IOException {
        log.error("Authentication failed for user: " + request.getParameter("email"));
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication failed");
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
