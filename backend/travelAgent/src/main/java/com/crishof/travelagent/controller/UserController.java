package com.crishof.travelagent.controller;

import com.crishof.travelagent.dto.UserRequest;
import com.crishof.travelagent.dto.UserResponse;
import com.crishof.travelagent.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {
        return ResponseEntity.ok(userService.getProfile(authentication));
    }

    @GetMapping("/agency")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getUsersInAgency(Authentication auth) {
        return ResponseEntity.ok(userService.getUsersByAgency(auth));
    }

    @PostMapping("/register-agent")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> createAgent(@RequestBody UserRequest dto, Authentication auth) {
        userService.createAgent(dto, auth);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}