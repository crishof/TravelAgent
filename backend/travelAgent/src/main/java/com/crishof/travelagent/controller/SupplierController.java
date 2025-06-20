package com.crishof.travelagent.controller;

import com.crishof.travelagent.dto.SupplierRequest;
import com.crishof.travelagent.dto.SupplierResponse;
import com.crishof.travelagent.mapper.SupplierMapper;
import com.crishof.travelagent.model.Supplier;
import com.crishof.travelagent.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supplier")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;
    private final SupplierMapper supplierMapper;


    @GetMapping("/getAll")
    public ResponseEntity<List<SupplierResponse>> getAll() {
        List<Supplier> suppliers = supplierService.getAll();
        List<SupplierResponse> responses = suppliers.stream()
                .map(supplierMapper::toDto)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<SupplierResponse> getById(@PathVariable Long id) {

        return ResponseEntity.ok(supplierMapper.toDto(supplierService.getById(id)));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<SupplierResponse> update(@PathVariable Long id, @RequestBody SupplierRequest supplierRequest) {
        return ResponseEntity.ok(supplierMapper.toDto(supplierService.update(id, supplierRequest)));
    }

    @PostMapping("/save")
    public ResponseEntity<SupplierResponse> save(@RequestBody SupplierRequest supplierRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(supplierMapper.toDto(supplierService.create(supplierRequest)));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") long id) {
        return ResponseEntity.status(HttpStatus.OK).body(supplierService.delete(id));
    }
}
