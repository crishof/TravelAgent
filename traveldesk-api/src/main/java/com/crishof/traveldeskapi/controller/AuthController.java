package com.crishof.traveldeskapi.controller;

import com.crishof.traveldeskapi.dto.AuthMeResponse;
import com.crishof.traveldeskapi.dto.AuthResponse;
import com.crishof.traveldeskapi.dto.LoginRequest;
import com.crishof.traveldeskapi.dto.LogoutRequest;
import com.crishof.traveldeskapi.dto.MessageResponse;
import com.crishof.traveldeskapi.dto.RefreshTokenRequest;
import com.crishof.traveldeskapi.dto.SignupRequest;
import com.crishof.traveldeskapi.dto.AcceptInviteRequest;
import com.crishof.traveldeskapi.security.SecurityUser;
import com.crishof.traveldeskapi.service.AuthService;
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

    //  ===============
    //  SIGNUP
    //  ===============

    @Operation(summary = "Sign up a new user")
    @ApiResponse(responseCode = "201", description = "User created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request")
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        log.info("Signup request received for email={}", request.email());
        return ResponseEntity.status(HttpStatusCode.valueOf(201)).body(authService.signup(request));
    }

    //  ===============
    //  LOGIN
    //  ===============

    @Operation(summary = "Login a user")
    @ApiResponse(responseCode = "200", description = "User logged in successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request received for email={}", request.email());
        return ResponseEntity.ok(authService.login(request));
    }

    //  ===============
    //  ACCEPT INVITE
    //  ===============

    @Operation(summary = "Accept a team invitation")
    @ApiResponse(responseCode = "200", description = "Invitation accepted successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request")
    @PostMapping("/accept-invite")
    public ResponseEntity<MessageResponse> acceptInvite(@Valid @RequestBody AcceptInviteRequest request) {
        log.info("Accept invite request received for email={}", request.email());
        return ResponseEntity.ok(new MessageResponse("Invitation accepted successfully"));
    }

    //  ===============
    //  LOGOUT
    //  ===============

    @Operation(summary = "Logout the authenticated user")
    @ApiResponse(responseCode = "200", description = "User logged out successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request")
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(@Valid @RequestBody LogoutRequest request) {
        log.info("Logout request received");
        return ResponseEntity.ok(new MessageResponse("Logout successful"));
    }

    //  ===============
    //  ME (GET AUTHENTICATED USER DETAILS)
    //  ===============

    @Operation(summary = "Get authenticated user details")
    @ApiResponse(responseCode = "200", description = "User details retrieved successfully")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<AuthMeResponse> me(@AuthenticationPrincipal SecurityUser user) {
        return ResponseEntity.ok(new AuthMeResponse(
                user.getId(),
                user.getEmail(),
                user.getRole().name(),
                user.getStatus().name()
        ));
    }

    // ============================
    // REFRESH TOKEN
    // ============================

    @Operation(summary = "Refresh JWT token", description = "Generates new access token using refresh token")
    @ApiResponse(responseCode = "200", description = "Token refreshed successfully")
    @ApiResponse(responseCode = "401", description = "Invalid refresh token")
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("Refresh token request received");
        return ResponseEntity.ok(authService.refreshToken(request.refreshToken()));
    }

}
