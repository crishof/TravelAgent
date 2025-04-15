package com.crishof.travelagent.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AgentResponse {

    private Long id;
    private String name;
    private String lastName;
    private String email;
    private String username;
    private String password;
}
