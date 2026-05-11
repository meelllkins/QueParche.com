package com.queparche.domain.shared.exception;

public class DomainValidationException extends RuntimeException {

    public DomainValidationException(String message) {
        super(message);
    }

    public DomainValidationException(String field, String reason) {
        super("Campo '" + field + "': " + reason);
    }
}
