package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.AgentRequest;
import com.crishof.travelagent.dto.AgentResponse;
import com.crishof.travelagent.exception.AgentNotFoundException;
import com.crishof.travelagent.model.Agent;
import com.crishof.travelagent.repository.AgentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AgentServiceImpl implements AgentService {
    private final AgentRepository agentRepository;

    @Override
    public List<AgentResponse> getAll() {

        List<Agent> agents = agentRepository.findAll();
        return agents.stream()
                .map(this::toAgentResponse)
                .toList();
    }

    @Override
    public AgentResponse getById(Long id) {

        Agent agent = agentRepository.findById(id).orElseThrow(() -> new AgentNotFoundException(id));
        return this.toAgentResponse(agent);
    }

    @Override
    public AgentResponse create(AgentRequest agentRequest) {

        Agent agent = new Agent();

        agent.setName(agentRequest.getName());
        agent.setLastname(agentRequest.getLastname());
        agent.setEmail(agentRequest.getEmail());
        agent.setUsername(agentRequest.getUsername());
        agent.setPassword(agentRequest.getPassword());

        return this.toAgentResponse(agentRepository.save(agent));
    }

    @Override
    public AgentResponse update(Long id, AgentRequest agentRequest) {

        Agent agent = agentRepository.findById(id).orElseThrow(() -> new AgentNotFoundException(id));

        agent.setName(agentRequest.getName());
        agent.setLastname(agentRequest.getLastname());
        agent.setEmail(agentRequest.getEmail());
        agent.setUsername(agentRequest.getUsername());
        if (agentRequest.getPassword() != null && !agentRequest.getPassword().isBlank()) {
            agent.setPassword(agentRequest.getPassword());
        }

        return this.toAgentResponse(agentRepository.save(agent));

    }

    @Override
    public String delete(Long id) {
        Agent agent = agentRepository.findById(id).orElseThrow(() -> new AgentNotFoundException(id));
        agentRepository.delete(agent);
        return "Agent successfully deleted";
    }

    private AgentResponse toAgentResponse(Agent agent) {
        AgentResponse agentResponse = new AgentResponse();

        agentResponse.setId(agent.getId());
        agentResponse.setName(agent.getName());
        agentResponse.setLastname(agent.getLastname());
        agentResponse.setUsername(agent.getUsername());
        agentResponse.setEmail(agent.getEmail());
        agentResponse.setPassword(agent.getPassword());
        return agentResponse;

    }
}
