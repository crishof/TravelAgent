package com.crishof.traveldeskapi.service.auth;

import com.crishof.traveldeskapi.exception.EmailAlreadyExistException;
import com.crishof.traveldeskapi.exception.InvalidCredentialException;
import com.crishof.traveldeskapi.exception.ResourceNotFoundException;
import com.crishof.traveldeskapi.exception.UnauthorizedActionException;
import com.crishof.traveldeskapi.model.Role;
import com.crishof.traveldeskapi.model.User;
import com.crishof.traveldeskapi.model.UserStatus;
import com.crishof.traveldeskapi.repository.UserRepository;
import com.crishof.traveldeskapi.security.JwtService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthResponse signup(SignupRequest request) {
        String normalizedEmail = normalizeEmail(request.email());

        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new EmailAlreadyExistException("Email " + normalizedEmail + " is already in use");
        }

        User user = new User();
        user.setFullName(request.fullName().trim());
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER);
        user.setStatus(UserStatus.ACTIVE);

        User savedUser = userRepository.save(user);
        return buildAuthResponse(savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = normalizeEmail(request.email());

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(normalizedEmail, request.password())
            );
        } catch (DisabledException _) {
            throw new UnauthorizedActionException("User is disabled or blocked");
        } catch (BadCredentialsException _) {
            throw new InvalidCredentialException("Invalid email or password");
        }

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + normalizedEmail));

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        Map<String, Object> claims = Map.of(
                "role", user.getRole().name(),
                "status", user.getStatus().name()
        );

        String accessToken = jwtService.generateToken(claims, user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.from(user, accessToken, refreshToken);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}