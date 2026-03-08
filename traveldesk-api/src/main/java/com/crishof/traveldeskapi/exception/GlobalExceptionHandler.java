package com.crishof.traveldeskapi.exception;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import java.time.Instant;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    private static final String BAD_REQUEST = "Bad Request";

    @ExceptionHandler(InvalidRequestException.class)
    public ResponseEntity<ApiError> handleBadRequest(InvalidRequestException ex, HttpServletRequest request) {
        log.warn("Bad request: {}", ex.getMessage());
        return respond(HttpStatus.BAD_REQUEST, BAD_REQUEST, ex, request);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
        log.warn("Resource not found: {}", ex.getMessage());
        return respond(HttpStatus.NOT_FOUND, "Not Found", ex, request);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiError> handleBusinessException(BusinessException ex, HttpServletRequest request) {
        log.warn("Business rule violation: {}", ex.getMessage());
        return respond(HttpStatus.UNPROCESSABLE_CONTENT, "Business Rule Violation", ex, request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + " " + err.getDefaultMessage())
                .collect(Collectors.joining(", "));

        log.warn("Validation error: {}", message);
        return respond(HttpStatus.BAD_REQUEST, "Validation Error", message, request);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiError> handleTypeMismatch(MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        String message = "Invalid value for parameter '" + ex.getName() + "'";
        log.warn("Type mismatch: {}", message);
        return respond(HttpStatus.BAD_REQUEST, "Validation Error", message, request);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleUnreadableMessage(HttpMessageNotReadableException ex, HttpServletRequest request) {
        log.warn("Malformed request body: {}", ex.getMessage());
        return respond(HttpStatus.BAD_REQUEST, BAD_REQUEST, "Malformed or unreadable request body", request);
    }

    @ExceptionHandler(UnauthorizedActionException.class)
    public ResponseEntity<ApiError> handleUnauthorizedAction(UnauthorizedActionException ex, HttpServletRequest request) {
        log.warn("Unauthorized action: {}", ex.getMessage());
        return respond(HttpStatus.UNAUTHORIZED, "Unauthorized", ex, request);
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiError> handleConflict(ConflictException ex, HttpServletRequest request) {
        log.warn("Conflict: {}", ex.getMessage());
        return respond(HttpStatus.CONFLICT, "Conflict", ex, request);
    }

    @ExceptionHandler(ExternalServiceException.class)
    public ResponseEntity<ApiError> handleExternalService(ExternalServiceException ex, HttpServletRequest request) {
        log.error("External service error: {}", ex.getMessage());
        return respond(HttpStatus.BAD_GATEWAY, "External Service Error", ex, request);
    }

    @ExceptionHandler(EmailAlreadyExistException.class)
    public ResponseEntity<ApiError> handleEmailAlreadyExist(EmailAlreadyExistException ex, HttpServletRequest request) {
        log.warn("Email already exists: {}", ex.getMessage());
        return respond(HttpStatus.CONFLICT, "Conflict", ex, request);
    }

    @ExceptionHandler(InvalidCredentialException.class)
    public ResponseEntity<ApiError> handleInvalidCredential(InvalidCredentialException ex, HttpServletRequest request) {
        log.warn("Invalid credential: {}", ex.getMessage());
        return respond(HttpStatus.UNAUTHORIZED, "Invalid Credential", ex, request);
    }

    @ExceptionHandler({ForbiddenOperationException.class, AccessDeniedException.class, AuthorizationDeniedException.class})
    public ResponseEntity<ApiError> handleAccessDenied(Exception ex, HttpServletRequest request) {
        log.warn("Access denied: {}", ex.getMessage());
        return respond(HttpStatus.FORBIDDEN, "Access Denied", ex, request);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiError> handleEntityNotFound(EntityNotFoundException ex, HttpServletRequest request) {
        log.warn("Entity not found: {}", ex.getMessage());
        return respond(HttpStatus.NOT_FOUND, "Not Found", ex, request);
    }

    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<ApiError> handleMissingPart(MissingServletRequestPartException ex, HttpServletRequest request) {
        log.warn("Missing request part: {}", ex.getMessage());
        return respond(HttpStatus.BAD_REQUEST, BAD_REQUEST, ex, request);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ApiError> handleUnsupportedMediaType(HttpMediaTypeNotSupportedException ex, HttpServletRequest request) {
        log.warn("Unsupported media type: {}", ex.getMessage());
        return respond(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Unsupported Media Type", ex, request);
    }

    @ExceptionHandler(FileDeletionException.class)
    public ResponseEntity<ApiError> handleFileDeletionException(FileDeletionException ex, HttpServletRequest request) {
        log.error("File deletion error: {}", ex.getMessage());
        return respond(HttpStatus.BAD_GATEWAY, "File Deletion Error", ex, request);
    }

    @ExceptionHandler(FileUploadException.class)
    public ResponseEntity<ApiError> handleUpload(FileUploadException ex, HttpServletRequest request) {
        log.error("File upload error: {}", ex.getMessage());
        return respond(HttpStatus.INTERNAL_SERVER_ERROR, "File Upload Error", ex, request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(Exception ex, HttpServletRequest request) {
        log.error("Unexpected error", ex);
        return respond(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", "Unexpected server error", request);
    }

    private ResponseEntity<ApiError> respond(HttpStatusCode status, String error, Exception ex, HttpServletRequest request) {
        return respond(status, error, ex.getMessage(), request);
    }

    private ResponseEntity<ApiError> respond(HttpStatusCode status, String error, String message, HttpServletRequest request) {
        ApiError apiError = new ApiError(
                Instant.now(),
                status.value(),
                error,
                message,
                request.getRequestURI()
        );
        return ResponseEntity.status(status).body(apiError);
    }
}
