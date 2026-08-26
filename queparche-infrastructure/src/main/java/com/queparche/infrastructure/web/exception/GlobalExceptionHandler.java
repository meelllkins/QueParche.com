package com.queparche.infrastructure.web.exception;

import com.queparche.application.shared.exception.AccesoDenegadoException;
import com.queparche.application.shared.exception.EmailYaRegistradoException;
import com.queparche.application.shared.exception.UsuarioNoEncontradoException;
import com.queparche.domain.servicio.exception.FechaServicioInvalidaException;
import com.queparche.domain.shared.exception.DomainValidationException;
import com.queparche.infrastructure.web.dto.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(DomainValidationException.class)
    public ResponseEntity<ErrorResponse> handleDomainValidation(
            DomainValidationException ex, HttpServletRequest request) {
        return build(HttpStatus.BAD_REQUEST, "VALIDACION_DOMINIO", ex.getMessage(), request);
    }

    @ExceptionHandler(FechaServicioInvalidaException.class)
    public ResponseEntity<ErrorResponse> handleFechaInvalida(
            FechaServicioInvalidaException ex, HttpServletRequest request) {
        return build(HttpStatus.BAD_REQUEST, "FECHA_INVALIDA", ex.getMessage(), request);
    }

    @ExceptionHandler(EmailYaRegistradoException.class)
    public ResponseEntity<ErrorResponse> handleEmailDuplicado(
            EmailYaRegistradoException ex, HttpServletRequest request) {
        return build(HttpStatus.CONFLICT, "EMAIL_DUPLICADO", ex.getMessage(), request);
    }

    @ExceptionHandler(AccesoDenegadoException.class)
    public ResponseEntity<ErrorResponse> handleAccesoDenegado(
            AccesoDenegadoException ex, HttpServletRequest request) {
        return build(HttpStatus.FORBIDDEN, "ACCESO_DENEGADO", ex.getMessage(), request);
    }

    @ExceptionHandler(UsuarioNoEncontradoException.class)
    public ResponseEntity<ErrorResponse> handleUsuarioNoEncontrado(
            UsuarioNoEncontradoException ex, HttpServletRequest request) {
        return build(HttpStatus.NOT_FOUND, "USUARIO_NO_ENCONTRADO", ex.getMessage(), request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(
            Exception ex, HttpServletRequest request) {
        log.error("Error inesperado en {}: {}", request.getRequestURI(), ex.getMessage(), ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "ERROR_INTERNO",
                "Ocurrió un error inesperado", request);
    }

    private ResponseEntity<ErrorResponse> build(
            HttpStatus status, String error, String message, HttpServletRequest request) {
        return ResponseEntity.status(status).body(new ErrorResponse(
                Instant.now().toString(),
                status.value(),
                error,
                message,
                request.getRequestURI()
        ));
    }
}
