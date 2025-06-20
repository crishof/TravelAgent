package com.crishof.travelagent.controller;

import com.crishof.travelagent.dto.UserRequest;
import com.crishof.travelagent.dto.UserResponse;
import com.crishof.travelagent.mapper.UserMapper;
import com.crishof.travelagent.service.UserService;
import lombok.RequiredArgsConstructor;
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
    private final UserMapper userMapper;

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {
        return ResponseEntity.ok(userMapper.toDto(userService.getProfile(authentication)));
    }

    @GetMapping("/agency")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getUsersInAgency(Authentication auth) {
        return ResponseEntity.ok(userService.getUsersByAgency(auth).stream()
                .map(userMapper::toDto).toList());
    }

    @PostMapping("/register-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> createAgent(@RequestBody UserRequest dto, Authentication auth) {
        return ResponseEntity.ok(userMapper.toDto(userService.createUser(dto, auth)));
    }
}