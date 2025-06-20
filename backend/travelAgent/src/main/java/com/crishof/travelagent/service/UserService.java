package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.UserRequest;
import com.crishof.travelagent.model.User;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface UserService {

    User getProfile(Authentication auth);

    List<User> getUsersByAgency(Authentication auth);

    User createUser(UserRequest request, Authentication auth);

    User getCurrentUser();
}