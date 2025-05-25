package com.wap.web1.controller;

import com.wap.web1.comfig.CurrentUser;
import com.wap.web1.dto.*;
import com.wap.web1.response.Response;
import com.wap.web1.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/info")
    public ResponseEntity<MyInfoDto> getMyInfo(@CurrentUser CustomUserDetails currentUser) {
        Long userId = currentUser.getUser().getId();
        MyInfoDto response = userService.getMyInfo(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/studygroups")
    public ResponseEntity<MyGroupsDto> getMyGroups(@CurrentUser CustomUserDetails currentUser){
        Long userId = currentUser.getUser().getId();
        MyGroupsDto response = userService.getMyGroups(userId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/studygroups/{studyGroupId}")
    public ResponseEntity<Response> updateMyGroup(
        @PathVariable Long studyGroupId,
        @RequestBody GroupUpdateDto dto,
        @CurrentUser CustomUserDetails currentUser
        ){
        Long userId = currentUser.getUser().getId();
        Response response = userService.updateMyGroup(studyGroupId, userId, dto);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/updateInfo")
    public ResponseEntity<Response> updateMyInfo(
            @RequestBody MyInfoUpdateDto dto,
            @CurrentUser CustomUserDetails currentUser
    ){
        Long userId = currentUser.getUser().getId();
        Response response = userService.updateMyInfo(userId, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/studygroups/{studyGroupId}/kick/{targetUserId}")
    public ResponseEntity<Response> kickUserFromGroup(
            @PathVariable Long studyGroupId,
            @PathVariable Long targetUserId,
            @CurrentUser CustomUserDetails currentUser
    ) {
        Long userId = currentUser.getUser().getId();
        Response response = userService.kickUserFromGroup(studyGroupId, userId, targetUserId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/studygroups/{studyGroupId}/updateLeader/{targetUserId}")
    public ResponseEntity<Response> updateLeader(
            @PathVariable Long studyGroupId,
            @PathVariable Long targetUserId,
            @CurrentUser CustomUserDetails currentUser
    ){
        Long userId = currentUser.getUser().getId();
        Response response = userService.updateLeader(studyGroupId, userId, targetUserId);
        return ResponseEntity.ok(response);
    }
}


