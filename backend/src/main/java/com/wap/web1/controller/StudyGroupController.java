package com.wap.web1.controller;

import com.wap.web1.config.CurrentUser;
import com.wap.web1.dto.*;
import com.wap.web1.response.Response;
import com.wap.web1.service.StudyGroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/studygroup")
@RequiredArgsConstructor
public class StudyGroupController {

    private final StudyGroupService studyGroupService;

    @PostMapping("/create")
    public ResponseEntity<Response> createStudyGroup(
            @RequestBody @Valid StudyGroupCreateDto dto,
            @CurrentUser CustomUserDetails currentUser
    ){
        Long userId = currentUser.getUser().getId();

        Response response = studyGroupService.createStudyGroup(dto, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{studyGroupId}/members")
    public ResponseEntity<GroupMembersDto> getMembers(@PathVariable Long studyGroupId){
        GroupMembersDto response = studyGroupService.getStudyGroupMembers(studyGroupId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{studyGroupId}/notice")
    public ResponseEntity<GroupNoticeDto> getNotice(@PathVariable Long studyGroupId){
        GroupNoticeDto response = studyGroupService.getNotice(studyGroupId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("{studyGroupId}/attendance")
    public ResponseEntity<Response> takeAttendance(
            @PathVariable Long studyGroupId,
            @CurrentUser CustomUserDetails currentUser
    ) {
        studyGroupService.takeAttendance(studyGroupId, currentUser.getUser().getId());
        return ResponseEntity.ok(new Response("출석 완료"));
    }

    @GetMapping("{studyGroupId}/attendance/calendar")
    public ResponseEntity<List<AttendanceCalendarDto>> getMonthlyAttendance(
        @PathVariable Long studyGroupId,
        @RequestParam int year,
        @RequestParam int month,
        @CurrentUser CustomUserDetails currentUser
    ) {
        List<AttendanceCalendarDto> result = studyGroupService.getMonthlyAttendance(
                studyGroupId, currentUser.getUser().getId(), year, month);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{studyGroupId}/name")
    public ResponseEntity<String> getStudyGroupName(@PathVariable Long studyGroupId){
        String name = studyGroupService.getGroupName(studyGroupId);
        return ResponseEntity.ok(name);
    }

    @DeleteMapping("{studyGroupId}/leave")
    public ResponseEntity<Response> leaveStudyGroup(
            @PathVariable Long studyGroupId,
            @CurrentUser CustomUserDetails currentUser
    ){
        Long userId = currentUser.getUser().getId();
        Response response = studyGroupService.leaveStudyGroup(studyGroupId, userId);
        return ResponseEntity.ok(response);
    }
}


