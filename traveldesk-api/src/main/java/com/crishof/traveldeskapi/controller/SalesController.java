package com.crishof.traveldeskapi.controller;

import com.crishof.traveldeskapi.dto.MessageResponse;
import com.crishof.traveldeskapi.dto.SaleRequest;
import com.crishof.traveldeskapi.dto.SaleResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/sales")
@RequiredArgsConstructor
@Slf4j
public class SalesController {

    //  ===============
    //  GET SALES
    //  ===============

    @Operation(summary = "Get sales")
    @ApiResponse(responseCode = "200", description = "Sales retrieved successfully")
    @GetMapping
    public ResponseEntity<java.util.List<SaleResponse>> getSales() {
        log.info("Get sales request received");
        return ResponseEntity.ok(java.util.List.of());
    }

    //  ===============
    //  CREATE SALE
    //  ===============

    @Operation(summary = "Create a new sale")
    @ApiResponse(responseCode = "201", description = "Sale created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request")
    @PostMapping
    public ResponseEntity<SaleResponse> createSale(@Valid @RequestBody SaleRequest request) {
        log.info("Create sale request received for clientName={}", request.clientName());
        return ResponseEntity.ok().build();
    }

    //  ===============
    //  UPDATE SALE
    //  ===============

    @Operation(summary = "Update a sale")
    @ApiResponse(responseCode = "200", description = "Sale updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request")
    @PutMapping("/{id}")
    public ResponseEntity<SaleResponse> updateSale(@PathVariable Long id, @Valid @RequestBody SaleRequest request) {
        log.info("Update sale request received for id={}", id);
        return ResponseEntity.ok().build();
    }

    //  ===============
    //  DELETE SALE
    //  ===============

    @Operation(summary = "Delete a sale")
    @ApiResponse(responseCode = "200", description = "Sale deleted successfully")
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteSale(@PathVariable Long id) {
        log.info("Delete sale request received for id={}", id);
        return ResponseEntity.ok().build();
    }
}