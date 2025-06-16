package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.UserRequest;
import com.crishof.travelagent.dto.UserResponse;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface UserService {

    UserResponse getProfile(Authentication auth);

    List<UserResponse> getUsersByAgency(Authentication auth);

    UserResponse createUser(UserRequest request, Authentication auth);
}