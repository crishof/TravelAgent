package com.crishof.travelagent.controller;

import com.crishof.travelagent.dto.CustomerRequest;
import com.crishof.travelagent.dto.CustomerResponse;
import com.crishof.travelagent.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/client")
@RequiredArgsConstructor
public class CustomerController {

    private final ClientService clientService;

    @GetMapping("/getAll")
    public ResponseEntity<List<CustomerResponse>> getAll() {
        return ResponseEntity.ok(clientService.getAll());
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<CustomerResponse> getById(@PathVariable("id") long id) {
        return ResponseEntity.ok(clientService.getById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CustomerResponse> update(@PathVariable("id") long id, @RequestBody CustomerRequest customerRequest) {
        return ResponseEntity.ok(clientService.update(id, customerRequest));
    }

    @PostMapping("/save")
    public ResponseEntity<CustomerResponse> save(@RequestBody CustomerRequest customerRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clientService.create(customerRequest));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") long id) {
        return ResponseEntity.status(HttpStatus.OK).body(clientService.delete(id));
    }
}
