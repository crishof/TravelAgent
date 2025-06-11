package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.UserRequest;
import com.crishof.travelagent.dto.UserResponse;
import com.crishof.travelagent.model.Role;
import com.crishof.travelagent.model.User;
import com.crishof.travelagent.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse getProfile(Authentication auth) {
        User user = (User) auth.getPrincipal();
        return UserResponse.from(user);
    }

    @Override
    public List<UserResponse> getUsersByAgency(Authentication auth) {
        User user = (User) auth.getPrincipal();
        return userRepository.findAllByAgencyId(user.getAgency().getId())
                .stream().map(UserResponse::from).toList();
    }

    @Override
    public void createAgent(UserRequest request, Authentication auth) {
        User admin = (User) auth.getPrincipal();

        User newAgent = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .agency(admin.getAgency())
                .build();

        userRepository.save(newAgent);
    }
}