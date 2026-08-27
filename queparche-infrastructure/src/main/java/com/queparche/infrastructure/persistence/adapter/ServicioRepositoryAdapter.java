package com.queparche.infrastructure.persistence.adapter;

import com.queparche.domain.servicio.Servicio;
import com.queparche.domain.servicio.port.out.ServicioRepositoryPort;
import com.queparche.infrastructure.persistence.entity.AuditoriaJpaEntity;
import com.queparche.infrastructure.persistence.entity.ServicioJpaEntity;
import com.queparche.infrastructure.persistence.entity.UsuarioJpaEntity;
import com.queparche.infrastructure.persistence.mapper.ServicioMapper;
import com.queparche.infrastructure.persistence.repository.AuditoriaJpaRepository;
import com.queparche.infrastructure.persistence.repository.ServicioJpaRepository;
import com.queparche.infrastructure.persistence.repository.UsuarioJpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@Transactional
public class ServicioRepositoryAdapter implements ServicioRepositoryPort {

    private final ServicioJpaRepository servicioJpaRepository;
    private final UsuarioJpaRepository usuarioJpaRepository;
    private final AuditoriaJpaRepository auditoriaJpaRepository;

    public ServicioRepositoryAdapter(ServicioJpaRepository servicioJpaRepository,
                                      UsuarioJpaRepository usuarioJpaRepository,
                                      AuditoriaJpaRepository auditoriaJpaRepository) {
        this.servicioJpaRepository = servicioJpaRepository;
        this.usuarioJpaRepository = usuarioJpaRepository;
        this.auditoriaJpaRepository = auditoriaJpaRepository;
    }

    @Override
    public void guardar(Servicio servicio) {
        UsuarioJpaEntity emprendedor = usuarioJpaRepository
                .findByUuid(servicio.getEmprendedorId().toString())
                .orElseThrow(() -> new IllegalStateException(
                        "Emprendedor no encontrado en DB: " + servicio.getEmprendedorId()));

        ServicioJpaEntity entity = servicioJpaRepository
                .findByUuid(servicio.getId().toString())
                .orElseGet(ServicioJpaEntity::new);

        ServicioMapper.mapear(entity, servicio, emprendedor);
        servicioJpaRepository.save(entity);

        registrarAuditoria(servicio);
    }

    @Override
    public Optional<Servicio> buscarPorId(UUID id) {
        return servicioJpaRepository.findByUuid(id.toString())
                .map(ServicioMapper::toDomain);
    }

    @Override
    public List<Servicio> buscarPorEmprendedorId(UUID emprendedorId) {
        return servicioJpaRepository.findByEmprendedor_Uuid(emprendedorId.toString())
                .stream()
                .map(ServicioMapper::toDomain)
                .toList();
    }

    @Override
    public List<Servicio> buscarTodos() {
        // El mapeo ocurre dentro de la transacción de clase: ServicioMapper
        // navega a emprendedor.getUuid(), que es LAZY, y fuera de sesión
        // lanzaría LazyInitializationException (open-in-view está en false).
        return servicioJpaRepository.findAll()
                .stream()
                .map(ServicioMapper::toDomain)
                .toList();
    }

    private void registrarAuditoria(Servicio servicio) {
        AuditoriaJpaEntity auditoria = new AuditoriaJpaEntity();
        auditoria.setUsuarioUuid(servicio.getEmprendedorId().toString());
        auditoria.setAccion("CREAR_SERVICIO");
        auditoria.setFechaRegistro(LocalDateTime.now());
        auditoria.setDetalles("Servicio UUID: " + servicio.getId()
                + " | Nombre: " + servicio.getNombre()
                + " | FechaHora: " + servicio.getFechaHora());
        auditoriaJpaRepository.save(auditoria);
    }
}
