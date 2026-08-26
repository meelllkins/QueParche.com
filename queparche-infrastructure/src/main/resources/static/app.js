/* ============================================================
   QueParche — app.js
   ------------------------------------------------------------
   JavaScript nativo, sin frameworks ni build.
     1. Renderiza las tarjetas de emprendimiento en la cuadrícula.
     2. Controla el modal de inicio de sesión.

   Los datos de abajo son simulados. Cuando la API REST esté
   disponible, basta con reemplazar `obtenerParches()` por un
   fetch a /api/v1/servicios — el resto del código no cambia.
   ============================================================ */

(function () {
  'use strict';

  // ── Datos simulados ───────────────────────────────────────
  var PARCHES = [
    {
      nombre: 'Arepas de chócolo con quesito',
      especialidad: 'Arepas',
      emprendedor: 'Gloria Restrepo',
      descripcion:
        'Arepa de chócolo dulcecita, asada al momento, con quesito campesino derretido encima. Combo con aguapanela fría.',
      hora: 'Hoy · 4:00 p. m.',
      direccion: 'Parque de los Deseos, Cra. 52 #71-117'
    },
    {
      nombre: 'Chuzos Donde Nelson',
      especialidad: 'Chuzos',
      emprendedor: 'Nelson Cardona',
      descripcion:
        'Chuzo mixto con arepa, papa salada y salsas de la casa. Ambiente de rumba y fútbol en plena 70.',
      hora: 'Hoy · 7:00 p. m.',
      direccion: 'Cra. 70 #44-30, Laureles'
    },
    {
      nombre: 'Mango biche en la 13',
      especialidad: 'Mango biche',
      emprendedor: 'Yesenia Álvarez',
      descripcion:
        'Mango biche frío con sal, limón y pimienta, mientras recorres el graffitour. También maracuyá y piña.',
      hora: 'Mañana · 11:00 a. m.',
      direccion: 'Escaleras eléctricas, Comuna 13'
    }
  ];

  /** Punto único de entrada de datos: hoy simulado, mañana `fetch`. */
  function obtenerParches() {
    return PARCHES;
  }

  // ── Utilidades ────────────────────────────────────────────

  /**
   * Escapa texto antes de inyectarlo como HTML.
   * Hoy los datos son constantes y seguros, pero al conectar la API
   * vendrán de la base de datos: sin esto habría XSS.
   */
  function escaparHtml(valor) {
    return String(valor).replace(/[&<>"']/g, function (caracter) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[caracter];
    });
  }

  // ── Renderizado de tarjetas ───────────────────────────────

  // Rota los tres colores de la paleta "Medellín Nocturna"
  var COLORES_INSIGNIA = ['insignia--violeta', 'insignia--magenta', 'insignia--cian'];

  function plantillaParche(parche, indice) {
    var colorInsignia = COLORES_INSIGNIA[indice % COLORES_INSIGNIA.length];

    return [
      '<article class="carta carta--interactiva">',
      '  <div>',
      '    <span class="insignia ' + colorInsignia + '">' + escaparHtml(parche.hora) + '</span>',
      '  </div>',
      '  <h3 class="parche__titulo">' + escaparHtml(parche.nombre) + '</h3>',
      '  <p class="parche__descripcion">' + escaparHtml(parche.descripcion) + '</p>',
      '  <div class="parche__pie">',
      '    <span>📍 ' + escaparHtml(parche.direccion) + '</span>',
      '    <span>por <span class="parche__autor">' + escaparHtml(parche.emprendedor) + '</span></span>',
      '  </div>',
      '</article>'
    ].join('\n');
  }

  function renderizarParches() {
    var rejilla = document.getElementById('rejilla-parches');
    if (!rejilla) return;

    var parches = obtenerParches();
    rejilla.innerHTML = parches.map(plantillaParche).join('\n');

    var contador = document.getElementById('contador-parches');
    if (contador) {
      contador.textContent = parches.length + (parches.length === 1 ? ' parche' : ' parches');
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
