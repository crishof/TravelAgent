package com.crishof.travelagent.service;

import com.crishof.travelagent.config.JwtService;
import com.crishof.travelagent.dto.AuthRequest;
import com.crishof.travelagent.dto.AuthResponse;
import com.crishof.travelagent.dto.RegisterRequest;
import com.crishof.travelagent.exception.EmailAlreadyExistException;
import com.crishof.travelagent.exception.InvalidCredentialException;
import com.crishof.travelagent.model.Agency;
import com.crishof.travelagent.model.Role;
import com.crishof.travelagent.model.User;
import com.crishof.travelagent.repository.AgencyRepository;
import com.crishof.travelagent.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AgencyRepository agencyRepository;

    @Override
    public AuthResponse register(RegisterRequest request) {
        logger.info("Register request received");

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistException("This email is already registered. Please log in or use a different one.");
        }

        Agency agency = agencyRepository.save(
                Agency.builder()
                        .name(request.getAgencyName())
                        .build());
        agencyRepository.save(agency);
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .agency(agency)
                .build();
        userRepository.save(user);
        var claims = new HashMap<String, Object>();
        claims.put("roles", List.of("ROLE_" + user.getRole().name()));

        var jwtToken = jwtService.generateToken(claims, user);

        return AuthResponse.builder().token(jwtToken).build();
    }

    @Override
    public AuthResponse authenticate(AuthRequest request) {
        logger.info("Authenticate request received");
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(), request.getPassword()));
        } catch (AuthenticationException exception) {
            throw new InvalidCredentialException("Invalid email and password");
        }
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        var claims = new HashMap<String, Object>();
        claims.put("roles", List.of("ROLE_" + user.getRole().name()));

        String jwtToken = jwtService.generateToken(claims, user);
        String refreshToken = jwtService.generateRefreshToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        logger.info("Refresh Token received");
        String email;

        try {
            email = jwtService.getUserName(refreshToken);
        } catch (ExpiredJwtException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Expired refresh token");
        } catch (JwtException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
        }

        if (email == null || !jwtService.isTokenValid(refreshToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
        }

        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        var claims = new HashMap<String, Object>();
        claims.put("roles", List.of("ROLE_" + user.getRole().name()));

        String newAccessToken = jwtService.generateToken(claims, user);
        String newRefreshToken = jwtService.generateRefreshToken(user); // si quieres renovarlo

        return AuthResponse.builder()
                .token(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
    }
}
