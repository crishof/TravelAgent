package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.AgentRequest;
import com.crishof.travelagent.dto.AgentResponse;

import java.util.List;

public interface AgentService {

    List<AgentResponse> getAll();

    AgentResponse getById(Long id);

    AgentResponse create(AgentRequest agentRequest);

    AgentResponse update(Long id, AgentRequest agentRequest);

    String delete(Long id);
}
