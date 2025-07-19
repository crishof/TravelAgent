package com.crishof.travelagent.service;


import com.crishof.travelagent.dto.AuthRequest;
import com.crishof.travelagent.dto.AuthResponse;
import com.crishof.travelagent.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse authenticate(AuthRequest request);


    AuthResponse refreshToken(String refreshToken);
}
