package com.crishof.travelagent.controller;

import com.crishof.travelagent.dto.SupplierRequest;
import com.crishof.travelagent.dto.SupplierResponse;
import com.crishof.travelagent.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/supplier")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping("/getAll")
    public ResponseEntity<List<SupplierResponse>> getAll() {
        return ResponseEntity.ok(supplierService.getAll());
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<SupplierResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(supplierService.getById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<SupplierResponse> update(@PathVariable Long id, @RequestBody SupplierRequest supplierRequest) {
        return ResponseEntity.ok(supplierService.update(id, supplierRequest));
    }

    @PostMapping("/save")
    public ResponseEntity<SupplierResponse> save(@RequestBody SupplierRequest supplierRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(supplierService.create(supplierRequest));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") long id) {
        return ResponseEntity.status(HttpStatus.OK).body(supplierService.delete(id));
    }
}
