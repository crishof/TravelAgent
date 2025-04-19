package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.AgentRequest;
import com.crishof.travelagent.dto.AgentResponse;

import java.util.List;

public interface AgentService {

    List<AgentResponse> getAll();

    AgentResponse getById(long id);

    AgentResponse create(AgentRequest agentRequest);

    AgentResponse update(long id, AgentRequest agentRequest);

    String delete(long id);
}
