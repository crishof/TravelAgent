package com.crishof.traveldeskapi.dto;

import java.util.UUID;

public record ClientResponse(
        UUID id,
        String fullName,
        String email,
        String phone
) {
}
