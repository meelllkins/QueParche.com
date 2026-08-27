package com.queparche.infrastructure.config;

import com.queparche.application.servicio.CrearServicioService;
import com.queparche.application.servicio.ListarServiciosService;
import com.queparche.application.servicio.port.in.CrearServicioUseCase;
import com.queparche.application.servicio.port.in.ListarServiciosUseCase;
import com.queparche.application.usuario.ActualizarPerfilService;
import com.queparche.application.usuario.RegistrarUsuarioService;
import com.queparche.application.usuario.port.in.ActualizarPerfilUseCase;
import com.queparche.application.usuario.port.in.RegistrarUsuarioUseCase;
import com.queparche.domain.servicio.port.out.ServicioRepositoryPort;
import com.queparche.domain.usuario.port.out.UsuarioRepositoryPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfiguration {

    @Bean
    public RegistrarUsuarioUseCase registrarUsuarioUseCase(UsuarioRepositoryPort usuarioRepositoryPort) {
        return new RegistrarUsuarioService(usuarioRepositoryPort);
    }

    @Bean
    public ActualizarPerfilUseCase actualizarPerfilUseCase(UsuarioRepositoryPort usuarioRepositoryPort) {
        return new ActualizarPerfilService(usuarioRepositoryPort);
    }

    @Bean
    public CrearServicioUseCase crearServicioUseCase(UsuarioRepositoryPort usuarioRepositoryPort,
                                                      ServicioRepositoryPort servicioRepositoryPort) {
        return new CrearServicioService(usuarioRepositoryPort, servicioRepositoryPort);
    }

    @Bean
    public ListarServiciosUseCase listarServiciosUseCase(ServicioRepositoryPort servicioRepositoryPort,
                                                          UsuarioRepositoryPort usuarioRepositoryPort) {
        return new ListarServiciosService(servicioRepositoryPort, usuarioRepositoryPort);
    }
}
