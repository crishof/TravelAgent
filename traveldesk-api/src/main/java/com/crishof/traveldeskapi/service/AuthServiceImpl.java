package com.crishof.traveldeskapi.service;

import com.crishof.traveldeskapi.dto.AuthResponse;
import com.crishof.traveldeskapi.dto.LoginRequest;
import com.crishof.traveldeskapi.dto.SignupRequest;
import com.crishof.traveldeskapi.exception.AgencyAlreadyExistException;
import com.crishof.traveldeskapi.exception.EmailAlreadyExistException;
import com.crishof.traveldeskapi.exception.InvalidCredentialException;
import com.crishof.traveldeskapi.exception.ResourceNotFoundException;
import com.crishof.traveldeskapi.exception.UnauthorizedActionException;
import com.crishof.traveldeskapi.model.Agency;
import com.crishof.traveldeskapi.model.Role;
import com.crishof.traveldeskapi.model.User;
import com.crishof.traveldeskapi.model.UserStatus;
import com.crishof.traveldeskapi.repository.AgencyRepository;
import com.crishof.traveldeskapi.repository.UserRepository;
import com.crishof.traveldeskapi.security.JwtService;
import io.jsonwebtoken.JwtException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.Locale;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final AgencyRepository agencyRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public AuthResponse signup(SignupRequest request) {
        String normalizedEmail = normalizeEmail(request.email());
        String displayAgencyName = sanitizeAgencyName(request.agencyName());
        String normalizedAgencyName = normalizeAgencyName(request.agencyName());

        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new EmailAlreadyExistException("Email " + normalizedEmail + " is already in use");
        }

        if (agencyRepository.findByNormalizedName(normalizedAgencyName).isPresent()) {
            throw new AgencyAlreadyExistException("Agency " + displayAgencyName + " already exists");
        }

        Agency agency = new Agency();
        agency.setName(displayAgencyName);
        agency.setNormalizedName(normalizedAgencyName);

        Agency savedAgency = agencyRepository.save(agency);

        User user = new User();
        user.setFullName(request.fullName().trim());
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setAgency(savedAgency);
        user.setRole(Role.USER);
        user.setStatus(UserStatus.ACTIVE);

        User savedUser = userRepository.save(user);
        return buildAuthResponse(savedUser);
    }

    @Override
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

    @Override
    public AuthResponse buildAuthResponse(User user) {
        Map<String, Object> claims = Map.of(
                "role", user.getRole().name(),
                "status", user.getStatus().name()
        );

        String accessToken = jwtService.generateToken(claims, user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.from(user, accessToken, refreshToken);
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token is required");
        }

        final String email;
        try {
            email = jwtService.getUserName(refreshToken);
        } catch (JwtException | IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
        }

        if (email == null || email.isBlank() || !jwtService.isTokenValid(refreshToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
        }

        User user = userRepository.findByEmail(normalizeEmail(email))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account inactive");
        }

        return buildAuthResponse(user);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String sanitizeAgencyName(String agencyName) {
        return agencyName.trim().replaceAll("\\s+", " ");
    }

    private String normalizeAgencyName(String agencyName) {
        return sanitizeAgencyName(agencyName).toLowerCase(Locale.ROOT);
    }
}