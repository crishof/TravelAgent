package com.crishof.traveldeskapi.controller;

import com.crishof.traveldeskapi.dto.DashboardStatsResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    //  ===============
    //  GET DASHBOARD STATS
    //  ===============

    @Operation(summary = "Get dashboard statistics")
    @ApiResponse(responseCode = "200", description = "Dashboard statistics retrieved successfully")
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getStats() {
        log.info("Dashboard stats request received");
        return ResponseEntity.ok().build();
    }
}
