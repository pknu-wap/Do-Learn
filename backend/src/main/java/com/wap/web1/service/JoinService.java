package com.wap.web1.service;

import com.wap.web1.domain.User;
import com.wap.web1.dto.JoinDto;
import com.wap.web1.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.regex.Pattern;

@Service
public class JoinService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public JoinService(UserRepository userRepository,BCryptPasswordEncoder bCryptPasswordEncoder){
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public ResponseEntity<String> joinProcess(JoinDto joinDto){

        String email = joinDto.getEmail();
        String password = joinDto.getPassword();
        String nickname = joinDto.getNickname();
        int profileImage = 4;

        if (userRepository.existsByEmail(email)){
            return new ResponseEntity<>("Email is already registered", HttpStatus.BAD_REQUEST);
        }

        if(userRepository.existsByNickname(nickname)) {
            return new ResponseEntity<>("Nickname is already registered",HttpStatus.BAD_REQUEST);
        }

        if(!isValidPassword(password)) {
            return new ResponseEntity<>("Password must be between 6 and 15 characters, and contain at least one lowercase letter, one uppercase letter, and one special character.",HttpStatus.BAD_REQUEST);
        }

        String encodedpassword = bCryptPasswordEncoder.encode(password);
        User user = User.builder()
                .email(email)
                .password(encodedpassword)
                .nickname(nickname)
                .role("ROLE_USER")
                .profileImage(profileImage)
                .provider("local")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        return new ResponseEntity<>("Local user successfully created",HttpStatus.CREATED);
    }

    private boolean isValidPassword(String password) {
        String passwordPattern ="(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).*";
        return password.length() >= 6 && password.length() <= 15 && Pattern.matches(passwordPattern,password);
    }
}
