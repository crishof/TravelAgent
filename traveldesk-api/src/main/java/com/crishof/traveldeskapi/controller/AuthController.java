package com.crishof.traveldeskapi.controller;

import com.crishof.traveldeskapi.security.SecurityUser;
import com.crishof.traveldeskapi.dto.AuthResponse;
import com.crishof.traveldeskapi.service.auth.AuthService;
import com.crishof.traveldeskapi.dto.LoginRequest;
import com.crishof.traveldeskapi.dto.SignupRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final AuthService authService;


    @Operation(summary = "Sign up a new user")
    @ApiResponse(responseCode = "201", description = "User created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request")
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        log.info("Signup request received for email={}", request.email());
        return ResponseEntity.status(HttpStatusCode.valueOf(201)).body(authService.signup(request));
    }

    @Operation(summary = "Login a user")
    @ApiResponse(responseCode = "200", description = "User logged in successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request received for email={}", request.email());
        return ResponseEntity.ok(authService.login(request));
    }

    @Operation(summary = "Get authenticated user details")
    @ApiResponse(responseCode = "200", description = "User details retrieved successfully")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<java.util.Map<String, Object>> me(@AuthenticationPrincipal SecurityUser user) {
        return ResponseEntity.ok(java.util.Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "role", user.getRole().name(),
                "status", user.getStatus().name()
        ));
    }
}
