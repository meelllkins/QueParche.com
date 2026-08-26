package com.queparche.application.servicio;

import com.queparche.application.servicio.port.in.CrearServicioUseCase;
import com.queparche.application.shared.exception.AccesoDenegadoException;
import com.queparche.domain.servicio.Servicio;
import com.queparche.domain.servicio.port.out.ServicioRepositoryPort;
import com.queparche.domain.servicio.vo.Ubicacion;
import com.queparche.domain.usuario.Usuario;
import com.queparche.domain.usuario.port.out.UsuarioRepositoryPort;

import java.time.LocalDateTime;
import java.util.logging.Logger;

public class CrearServicioService implements CrearServicioUseCase {

    // java.util.logging: cero dependencias externas en la capa de aplicación
    private static final Logger AUDITORIA = Logger.getLogger(CrearServicioService.class.getName());

    private final UsuarioRepositoryPort usuarioRepositorio;
    private final ServicioRepositoryPort servicioRepositorio;

    public CrearServicioService(UsuarioRepositoryPort usuarioRepositorio,
                                 ServicioRepositoryPort servicioRepositorio) {
        this.usuarioRepositorio = usuarioRepositorio;
        this.servicioRepositorio = servicioRepositorio;
    }

    @Override
    public Servicio crear(ServicioCommand command) {
        // 1. Verificación de autorización — estándar de segregación de funciones
        Usuario emprendedor = usuarioRepositorio.buscarPorId(command.emprendedorId())
                .orElseThrow(() -> new AccesoDenegadoException(command.emprendedorId()));

        if (!emprendedor.esEmprendedor()) {
            throw new AccesoDenegadoException(command.emprendedorId());
        }

        // 2. Construcción del VO y la entidad — las invariantes se validan en el dominio
        Ubicacion ubicacion = new Ubicacion(command.latitud(), command.longitud(), command.direccion());
        Servicio servicio = Servicio.crear(
                command.nombre(),
                command.descripcion(),
                command.fechaHora(),
                ubicacion,
                command.emprendedorId()
        );

        // 3. Persistencia
        servicioRepositorio.guardar(servicio);

        // 4. Trazabilidad de auditoría — estándar bancario
        AUDITORIA.info(String.format(
                "[AUDIT-LOG] Acción: CREAR_SERVICIO | Usuario: %s | Fecha: %s",
                command.emprendedorId(), LocalDateTime.now()
        ));

        return servicio;
    }
}
