package com.crishof.traveldeskapi.service;

import com.crishof.traveldeskapi.dto.AuthResponse;
import com.crishof.traveldeskapi.dto.LoginRequest;
import com.crishof.traveldeskapi.dto.SignupRequest;
import com.crishof.traveldeskapi.model.User;

public interface AuthService {
    AuthResponse signup(SignupRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse buildAuthResponse(User user);
}
