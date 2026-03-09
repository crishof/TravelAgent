package com.crishof.traveldeskapi.controller;

import com.crishof.traveldeskapi.dto.MessageResponse;
import com.crishof.traveldeskapi.dto.ClientRequest;
import com.crishof.traveldeskapi.dto.ClientResponse;
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
@RequestMapping("/api/v1/clients")
@RequiredArgsConstructor
@Slf4j
public class ClientController {

    //  ===============
    //  GET CLIENTS
    //  ===============

    @Operation(summary = "Get clients")
    @ApiResponse(responseCode = "200", description = "Clients retrieved successfully")
    @GetMapping
    public ResponseEntity<java.util.List<ClientResponse>> getClients() {
        log.info("Get clients request received");
        return ResponseEntity.ok(java.util.List.of());
    }

    //  ===============
    //  CREATE CLIENT
    //  ===============

    @Operation(summary = "Create a new client")
    @ApiResponse(responseCode = "201", description = "Client created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request")
    @PostMapping
    public ResponseEntity<ClientResponse> createClient(@Valid @RequestBody ClientRequest request) {
        log.info("Create client request received for email={}", request.email());
        return ResponseEntity.ok().build();
    }

    //  ===============
    //  UPDATE CLIENT
    //  ===============

    @Operation(summary = "Update a client")
    @ApiResponse(responseCode = "200", description = "Client updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request")
    @PutMapping("/{id}")
    public ResponseEntity<ClientResponse> updateClient(@PathVariable Long id, @Valid @RequestBody ClientRequest request) {
        log.info("Update client request received for id={}", id);
        return ResponseEntity.ok().build();
    }

    //  ===============
    //  DELETE CLIENT
    //  ===============

    @Operation(summary = "Delete a client")
    @ApiResponse(responseCode = "200", description = "Client deleted successfully")
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteClient(@PathVariable Long id) {
        log.info("Delete client request received for id={}", id);
        return ResponseEntity.ok().build();
    }
}