package com.crishof.travelagent.dto;

import com.crishof.travelagent.model.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private Role role;
    private Long agencyId;
    private String agencyName;

    public static UserResponse from(com.crishof.travelagent.model.User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .agencyId(user.getAgency() != null ? user.getAgency().getId() : null)
                .agencyName(user.getAgency() != null ? user.getAgency().getName() : null)
                .build();
    }
}
