package com.crishof.travelagent.service;

import com.crishof.travelagent.config.JwtService;
import com.crishof.travelagent.dto.AuthRequest;
import com.crishof.travelagent.dto.AuthResponse;
import com.crishof.travelagent.dto.RegisterRequest;
import com.crishof.travelagent.exception.EmailAlreadyExistException;
import com.crishof.travelagent.model.Agency;
import com.crishof.travelagent.model.Role;
import com.crishof.travelagent.model.User;
import com.crishof.travelagent.repository.AgencyRepository;
import com.crishof.travelagent.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AgencyRepository agencyRepository;

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistException("Email Already Exist on Database");
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

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword()));
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        var claims = new HashMap<String, Object>();
        claims.put("roles", List.of("ROLE_" + user.getRole().name()));

        var jwtToken = jwtService.generateToken(claims, user);
        return AuthResponse.builder().token(jwtToken).build();
    }
}
