package com.crishof.travelagent.controller;

import com.crishof.travelagent.dto.CustomerRequest;
import com.crishof.travelagent.dto.CustomerResponse;
import com.crishof.travelagent.mapper.CustomerMapper;
import com.crishof.travelagent.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;
    private final CustomerMapper customerMapper;

    @GetMapping("/getAll")
    public ResponseEntity<List<CustomerResponse>> getAll() {
        return ResponseEntity.ok(customerService.getAll().stream().map(customerMapper::toDto).toList());
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<CustomerResponse> getById(@PathVariable("id") long id) {
        return ResponseEntity.ok(customerMapper.toDto(customerService.getById(id)));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CustomerResponse> update(@PathVariable("id") long id, @RequestBody CustomerRequest customerRequest) {
        return ResponseEntity.ok(customerMapper.toDto(customerService.update(id, customerRequest)));
    }

    @PostMapping("/save")
    public ResponseEntity<CustomerResponse> save(@RequestBody CustomerRequest customerRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(customerMapper.toDto(customerService.create(customerRequest)));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") long id) {
        return ResponseEntity.status(HttpStatus.OK).body(customerService.delete(id));
    }
}
