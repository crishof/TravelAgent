package com.crishof.traveldeskapi.controller;

import com.crishof.traveldeskapi.dto.MessageResponse;
import com.crishof.traveldeskapi.dto.TeamInviteRequest;
import com.crishof.traveldeskapi.dto.TeamMemberRequest;
import com.crishof.traveldeskapi.dto.TeamMemberResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/team")
@RequiredArgsConstructor
@Slf4j
public class TeamController {

    //  ===============
    //  GET TEAM MEMBERS
    //  ===============

    @Operation(summary = "Get team members")
    @ApiResponse(responseCode = "200", description = "Team members retrieved successfully")
    @GetMapping
    public ResponseEntity<java.util.List<TeamMemberResponse>> getTeamMembers() {
        log.info("Get team members request received");
        return ResponseEntity.ok(java.util.List.of());
    }

    //  ===============
    //  INVITE TEAM MEMBER
    //  ===============

    @Operation(summary = "Invite a team member")
    @ApiResponse(responseCode = "201", description = "Invitation sent successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request")
    @PostMapping("/invite")
    public ResponseEntity<MessageResponse> inviteMember(@Valid @RequestBody TeamInviteRequest request) {
        log.info("Invite team member request received for email={}", request.email());
        return ResponseEntity.ok().build();
    }

    //  ===============
    //  UPDATE TEAM MEMBER
    //  ===============

    @Operation(summary = "Update a team member")
    @ApiResponse(responseCode = "200", description = "Team member updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request")
    @PutMapping("/{id}")
    public ResponseEntity<TeamMemberResponse> updateMember(@PathVariable Long id, @Valid @RequestBody TeamMemberRequest request) {
        log.info("Update team member request received for id={}", id);
        return ResponseEntity.ok().build();
    }

    //  ===============
    //  DELETE TEAM MEMBER
    //  ===============

    @Operation(summary = "Delete a team member")
    @ApiResponse(responseCode = "200", description = "Team member deleted successfully")
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteMember(@PathVariable Long id) {
        log.info("Delete team member request received for id={}", id);
        return ResponseEntity.ok().build();
    }
}