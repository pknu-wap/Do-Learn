package com.wap.web1.controller;

import com.wap.web1.config.CurrentUser;
import com.wap.web1.dto.CustomUserDetails;
import com.wap.web1.dto.StudyGroupResponse;
import com.wap.web1.dto.StudyGroupWithMemberCountDto;
import com.wap.web1.response.Response;
import com.wap.web1.service.MainService;
import com.wap.web1.service.StudyGroupListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/main")
@RequiredArgsConstructor
public class MainController {
    private final MainService mainService;
    private final StudyGroupListService studyGroupListService;

    @PostMapping("/{study_group_id}/join")
    public ResponseEntity<Response> joinStudyGroup(
            @PathVariable("study_group_id") Long studyGroupId,
            @CurrentUser CustomUserDetails currentUser
    ) {
        Long userId = currentUser.getUser().getId();
        Response response = mainService.joinStudyGroup(studyGroupId, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/grouplist")
    public StudyGroupResponse<StudyGroupWithMemberCountDto> getStudyGroups(
            @RequestParam(required = false) Long cursor,
            @RequestParam(defaultValue = "7") int size,
            @RequestParam(required = false) List<String> category,
            @RequestParam(required = false) List<String> region) {

        return studyGroupListService.getStudyGroups(cursor, size, category, region);
    }

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("서버 돌아가는중");
    }
}

