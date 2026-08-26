-- QueParche — Esquema de base de datos (Fase II)
-- Ejecutar manualmente antes de arrancar la aplicación.

CREATE TABLE usuarios (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    uuid             VARCHAR(36)  NOT NULL UNIQUE,
    nombre           VARCHAR(100) NOT NULL,
    email            VARCHAR(150) NOT NULL UNIQUE,
    password_hash    VARCHAR(255) NOT NULL,
    rol              ENUM('CLIENTE','EMPRENDEDOR') NOT NULL,
    telefono         VARCHAR(20),
    correo_secundario VARCHAR(150),
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuario_redes (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id  BIGINT       NOT NULL,
    plataforma  VARCHAR(50)  NOT NULL,
    url_perfil  VARCHAR(255) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE servicios (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    uuid           VARCHAR(36)  NOT NULL UNIQUE,
    emprendedor_id BIGINT       NOT NULL,
    nombre         VARCHAR(100) NOT NULL,
    descripcion    TEXT,
    fecha_hora     DATETIME     NOT NULL,
    latitud        DOUBLE       NOT NULL,
    longitud       DOUBLE       NOT NULL,
    direccion      VARCHAR(255) NOT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emprendedor_id) REFERENCES usuarios(id)
);

CREATE TABLE auditoria_operaciones (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_uuid    VARCHAR(36)  NOT NULL,
    accion          VARCHAR(100) NOT NULL,
    fecha_registro  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    detalles        TEXT
);
