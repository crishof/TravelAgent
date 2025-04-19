package com.crishof.travelagent.exception;

public class AgentNotFoundException extends RuntimeException {

    public AgentNotFoundException() {
        super();
    }

    public AgentNotFoundException(String message) {
        super(message);
    }

    public AgentNotFoundException(Long id) {
        super("Agent with id " + id + " not found");
    }
}
