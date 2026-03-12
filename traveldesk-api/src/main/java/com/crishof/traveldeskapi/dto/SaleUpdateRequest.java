public record SaleStatusUpdateRequest(
        @NotBlank(message = "Status is required")
        @Size(max = 30, message = "Status must not exceed 30 characters")
        String status
) {
}
