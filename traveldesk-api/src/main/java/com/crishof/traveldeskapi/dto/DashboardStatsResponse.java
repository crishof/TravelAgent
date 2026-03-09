package com.crishof.traveldeskapi.dto;

public record DashboardStatsResponse(
        int totalSales,
        int totalBookings,
        int totalClients,
        int totalProviders
) {
}
