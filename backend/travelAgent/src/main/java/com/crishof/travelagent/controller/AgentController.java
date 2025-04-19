package com.crishof.travelagent.controller;

import com.crishof.travelagent.dto.AgentRequest;
import com.crishof.travelagent.dto.AgentResponse;
import com.crishof.travelagent.service.AgentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/agent")
@RequiredArgsConstructor
public class AgentController {

    private final AgentService agentService;

    @GetMapping("/getAll")
    public ResponseEntity<List<AgentResponse>> getAll() {
        return ResponseEntity.ok(agentService.getAll());
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<AgentResponse> getById(@PathVariable("id") long id) {
        return ResponseEntity.ok(agentService.getById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<AgentResponse> update(@PathVariable("id") long id, @RequestBody AgentRequest agentRequest) {
        return ResponseEntity.ok(agentService.update(id, agentRequest));
    }

    @PostMapping("/save")
    public ResponseEntity<AgentResponse> save(@RequestBody AgentRequest agentRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(agentService.create(agentRequest));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") long id) {
        return ResponseEntity.status(HttpStatus.OK).body(agentService.delete(id));
    }
}
