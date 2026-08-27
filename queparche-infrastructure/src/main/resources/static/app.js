/* ============================================================
   QueParche — app.js
   ------------------------------------------------------------
   JavaScript nativo, sin frameworks ni build.
     1. Carga los parches desde la API REST y los renderiza.
     2. Controla el modal de inicio de sesión.
   ============================================================ */

(function () {
  'use strict';

  // ── API ───────────────────────────────────────────────────
  // Ruta tomada de ServicioController.java:
  //   @RestController
  //   @RequestMapping("/api/v1/servicios")
  var ENDPOINT_PARCHES = '/api/v1/servicios';

  /**
   * Trae los parches publicados desde el backend.
   *
   * El controller responde con el envoltorio BaseResponse<T>:
   *   { timestamp, status, message, data: [...] }
   * Se acepta también un array pelado por si el contrato cambia.
   */
  async function obtenerParches() {
    var respuesta = await fetch(ENDPOINT_PARCHES, {
      headers: { Accept: 'application/json' }
    });

    if (!respuesta.ok) {
      var error = new Error('HTTP ' + respuesta.status);
      error.status = respuesta.status;
      throw error;
    }

    var cuerpo = await respuesta.json();
    var lista = cuerpo && cuerpo.data !== undefined ? cuerpo.data : cuerpo;
    return Array.isArray(lista) ? lista : [];
  }

  // ── Utilidades ────────────────────────────────────────────

  /**
   * Escapa texto antes de inyectarlo como HTML.
   * Imprescindible: estos datos vienen de la base de datos, los
   * escribe un emprendedor y sin esto habría XSS.
   */
  function escaparHtml(valor) {
    return String(valor === null || valor === undefined ? '' : valor).replace(
      /[&<>"']/g,
      function (caracter) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[caracter];
      }
    );
  }

  /**
   * `fechaHora` llega como ISO-8601 (LocalDateTime de Java, sin zona).
   * Si no se puede interpretar, se devuelve el valor crudo.
   */
  function formatearFecha(valor) {
    if (!valor) return 'Sin fecha';

    var fecha = new Date(valor);
    if (isNaN(fecha.getTime())) return String(valor);

    var dia = fecha.toLocaleDateString('es-CO', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
    var hora = fecha.toLocaleTimeString('es-CO', {
      hour: 'numeric',
      minute: '2-digit'
    });
    return dia + ' · ' + hora;
  }

  // ── Renderizado ───────────────────────────────────────────

  var rejilla = document.getElementById('rejilla-parches');
  var contador = document.getElementById('contador-parches');

  // Rota los tres colores de la paleta "Medellín Nocturna"
  var COLORES_INSIGNIA = ['insignia--violeta', 'insignia--magenta', 'insignia--cian'];

  /** Campos según ServicioResponse.java (id, nombre, descripcion,
   *  fechaHora, latitud, longitud, direccion, emprendedorId). */
  function plantillaParche(parche, indice) {
    var colorInsignia = COLORES_INSIGNIA[indice % COLORES_INSIGNIA.length];

    return [
      '<article class="carta carta--interactiva">',
      '  <div>',
      '    <span class="insignia ' + colorInsignia + '">' +
        escaparHtml(formatearFecha(parche.fechaHora)) +
        '</span>',
      '  </div>',
      '  <h3 class="parche__titulo">' + escaparHtml(parche.nombre) + '</h3>',
      '  <p class="parche__descripcion">' + escaparHtml(parche.descripcion) + '</p>',
      '  <div class="parche__pie">',
      '    <span>📍 ' + escaparHtml(parche.direccion) + '</span>',
      '  </div>',
      '</article>'
    ].join('\n');
  }

  /** Inyecta un mensaje que ocupa el ancho completo de la cuadrícula. */
  function mostrarMensaje(html, clase) {
    if (!rejilla) return;
    rejilla.innerHTML =
      '<div style="grid-column: 1 / -1">' +
      (clase ? '<div class="' + clase + '">' + html + '</div>' : html) +
      '</div>';
  }

  function actualizarContador(texto) {
    if (contador) contador.textContent = texto;
  }

  /** Traduce el fallo en un mensaje útil sin exponer detalles internos. */
  function detalleDelError(error) {
    if (error && error.status === 405) {
      // La ruta existe (POST), pero el backend todavía no expone GET.
      return 'El backend todavía no expone <code class="texto-acento">GET ' +
        ENDPOINT_PARCHES +
        '</code>.';
    }
    if (error && error.status) {
      return 'El servidor respondió con un error ' + escaparHtml(error.status) + '.';
    }
    return 'No hay conexión con el servidor. ¿Está corriendo la aplicación?';
  }

  async function renderizarParches() {
    if (!rejilla) return;

    mostrarMensaje('<p style="color: var(--texto-suave)">Cargando parches…</p>');
    actualizarContador('');

    try {
      var parches = await obtenerParches();

      if (parches.length === 0) {
        mostrarMensaje(
          '<p style="color: var(--texto-suave)">Todavía no hay parches publicados. ' +
            '¡Sé el primero en publicar el tuyo!</p>'
        );
        actualizarContador('0 parches');
        return;
      }

      rejilla.innerHTML = parches.map(plantillaParche).join('\n');
      actualizarContador(parches.length + (parches.length === 1 ? ' parche' : ' parches'));
    } catch (error) {
      mostrarMensaje(
        '<p style="margin: 0">No se pudieron cargar los parches en este momento.</p>' +
          '<p style="margin: 0.5rem 0 0; font-size: 0.85rem; opacity: 0.85">' +
          detalleDelError(error) +
          '</p>',
        'alerta-error'
      );
      actualizarContador('');
      if (typeof console !== 'undefined' && console.error) {
        console.error('[QueParche] Fallo al cargar ' + ENDPOINT_PARCHES + ':', error);
      }
    }
  }

  // ── Modal de inicio de sesión ─────────────────────────────

  var modal = document.getElementById('modal-login');
  var elementoPrevio = null;

  function abrirModal() {
    if (!modal) return;
    elementoPrevio = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    var primerCampo = modal.querySelector('.campo');
    if (primerCampo) primerCampo.focus();
  }

  function cerrarModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';

    // Devuelve el foco al botón que lo abrió
    if (elementoPrevio && typeof elementoPrevio.focus === 'function') {
      elementoPrevio.focus();
    }
    elementoPrevio = null;
  }

  /** Mantiene el foco dentro del modal mientras está abierto. */
  function atraparFoco(evento) {
    if (evento.key !== 'Tab' || !modal || modal.hidden) return;

    var enfocables = modal.querySelectorAll('button, input, a[href]');
    if (enfocables.length === 0) return;

    var primero = enfocables[0];
    var ultimo = enfocables[enfocables.length - 1];

    if (evento.shiftKey && document.activeElement === primero) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primero.focus();
    }
  }

  function conectarModal() {
    if (!modal) return;

    // Botones que abren el modal
    ['btn-abrir-login', 'btn-hero-login'].forEach(function (id) {
      var boton = document.getElementById(id);
      if (boton) boton.addEventListener('click', abrirModal);
    });

    // Botón de cerrar y clic en el fondo
    modal.querySelectorAll('[data-cerrar-modal]').forEach(function (elemento) {
      elemento.addEventListener('click', cerrarModal);
    });

    // Tecla Escape
    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape') cerrarModal();
      atraparFoco(evento);
    });

    // Envío del formulario.
    // El backend todavía NO tiene endpoint de autenticación, así que
    // no simulamos una sesión: solo se avisa del estado real.
    var formulario = document.getElementById('form-login');
    var aviso = document.getElementById('aviso-login');

    if (formulario && aviso) {
      formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();
        aviso.hidden = false;
        aviso.textContent =
          'El inicio de sesión aún no está conectado al backend. Próximamente.';
      });
    }
  }

  // ── Arranque ──────────────────────────────────────────────
  function iniciar() {
    renderizarParches();
    conectarModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
