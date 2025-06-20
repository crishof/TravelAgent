package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.UserRequest;
import com.crishof.travelagent.model.Role;
import com.crishof.travelagent.model.User;
import com.crishof.travelagent.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User getProfile(Authentication auth) {
        return (User) auth.getPrincipal();
    }

    @Override
    public List<User> getUsersByAgency(Authentication auth) {
        User user = (User) auth.getPrincipal();
        return userRepository.findAllByAgencyId(user.getAgency().getId());
    }

    @Override
    public User createUser(UserRequest request, Authentication auth) {
        User admin = (User) auth.getPrincipal();

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .agency(admin.getAgency())
                .build();

        return userRepository.save(user);
    }

    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}