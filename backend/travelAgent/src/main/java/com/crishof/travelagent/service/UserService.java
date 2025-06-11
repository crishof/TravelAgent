package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.UserRequest;
import com.crishof.travelagent.dto.UserResponse;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface UserService {

    UserResponse getProfile(Authentication auth);

    List<UserResponse> getUsersByAgency(Authentication auth);

    void createAgent(UserRequest request, Authentication auth);
}