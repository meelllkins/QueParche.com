package com.queparche.domain.usuario;

public enum TipoRol {
    CLIENTE,
    EMPRENDEDOR;

    public boolean puedeGestionarServicios() {
        return this == EMPRENDEDOR;
    }
}
