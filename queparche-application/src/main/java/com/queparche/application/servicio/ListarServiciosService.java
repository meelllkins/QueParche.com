package com.queparche.application.servicio;

import com.queparche.application.servicio.port.in.ListarServiciosUseCase;
import com.queparche.domain.servicio.Servicio;
import com.queparche.domain.servicio.port.out.ServicioRepositoryPort;
import com.queparche.domain.usuario.Usuario;
import com.queparche.domain.usuario.port.out.UsuarioRepositoryPort;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Caso de uso de lectura: devuelve todos los servicios publicados,
 * enriquecidos con el nombre del emprendedor que los ofrece.
 *
 * El dominio referencia al emprendedor solo por UUID (frontera de
 * agregados). Resolver el nombre es responsabilidad de orquestación,
 * así que se hace aquí coordinando los dos puertos — igual que ya hace
 * CrearServicioService para verificar el rol.
 */
public class ListarServiciosService implements ListarServiciosUseCase {

    private static final String EMPRENDEDOR_DESCONOCIDO = "Emprendedor desconocido";

    private final ServicioRepositoryPort servicioRepositorio;
    private final UsuarioRepositoryPort usuarioRepositorio;

    public ListarServiciosService(ServicioRepositoryPort servicioRepositorio,
                                   UsuarioRepositoryPort usuarioRepositorio) {
        this.servicioRepositorio = servicioRepositorio;
        this.usuarioRepositorio = usuarioRepositorio;
    }

    @Override
    public List<ServicioListado> listar() {
        List<Servicio> servicios = servicioRepositorio.buscarTodos();

        // Caché local: varios servicios suelen pertenecer al mismo
        // emprendedor, así se evita repetir la consulta (problema N+1).
        Map<UUID, String> nombresPorId = new HashMap<>();

        return servicios.stream()
                .map(servicio -> new ServicioListado(
                        servicio.getId(),
                        servicio.getNombre(),
                        servicio.getDescripcion(),
                        servicio.getFechaHora(),
                        servicio.getUbicacion().getLatitud(),
                        servicio.getUbicacion().getLongitud(),
                        servicio.getUbicacion().getDireccion(),
                        servicio.getEmprendedorId(),
                        resolverNombre(nombresPorId, servicio.getEmprendedorId())
                ))
                .toList();
    }

    /**
     * Nombre del emprendedor, o un texto neutro si ya no existe.
     * Un listado público no debe romperse porque falte un usuario.
     */
    private String resolverNombre(Map<UUID, String> cache, UUID emprendedorId) {
        return cache.computeIfAbsent(emprendedorId, id ->
                usuarioRepositorio.buscarPorId(id)
                        .map(Usuario::getNombre)
                        .orElse(EMPRENDEDOR_DESCONOCIDO)
        );
    }
}
