package com.queparche.application.usuario.port.in;

import com.queparche.application.usuario.ActualizarPerfilCommand;
import com.queparche.domain.usuario.Usuario;

public interface ActualizarPerfilUseCase {

    Usuario actualizar(ActualizarPerfilCommand command);
}
