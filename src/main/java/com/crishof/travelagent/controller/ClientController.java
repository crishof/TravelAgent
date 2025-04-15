package com.crishof.travelagent.controller;

import com.crishof.travelagent.dto.ClientRequest;
import com.crishof.travelagent.dto.ClientResponse;
import com.crishof.travelagent.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/client")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @GetMapping("/getAll")
    public ResponseEntity<List<ClientResponse>> getAll() {
        return ResponseEntity.ok(clientService.getAll());
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<ClientResponse> getById(@PathVariable("id") long id) {
        return ResponseEntity.ok(clientService.getById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ClientResponse> update(@PathVariable("id") long id, ClientRequest clientRequest) {
        return ResponseEntity.ok(clientService.update(id, clientRequest));
    }

    @PostMapping("/save")
    public ResponseEntity<ClientResponse> save(@RequestBody ClientRequest clientRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clientService.create(clientRequest));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") long id) {
        return ResponseEntity.status(HttpStatus.OK).body(clientService.delete(id));
    }
}
