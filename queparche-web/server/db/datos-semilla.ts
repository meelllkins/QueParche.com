/**
 * Datos de ejemplo: gastronomía callejera real de Medellín.
 * Las coordenadas corresponden a lugares reales de la ciudad y el área
 * metropolitana. Las fechas se calculan SIEMPRE hacia el futuro relativo
 * al momento de sembrar, para que la app se vea viva al arrancar.
 */

/** Fecha futura: hoy + `dias`, a la `horaLocal` de Medellín (UTC-5, sin DST). */
export function fechaFutura(dias: number, horaLocal: number, minutos = 0): string {
  const f = new Date(Date.now() + dias * 24 * 60 * 60 * 1000);
  f.setUTCHours(horaLocal + 5, minutos, 0, 0); // Bogotá/Medellín = UTC-5
  return f.toISOString();
}

export interface SemillaServicio {
  nombre: string;
  descripcion: string;
  dias: number;
  hora: number;
  minutos?: number;
  latitud: number;
  longitud: number;
  direccion: string;
}

export interface SemillaEmprendedor {
  email: string;
  nombre: string;
  especialidad: string;
  descripcion: string;
  telefono: string;
  correoSecundario?: string;
  redesSociales: Record<string, string>;
  servicios: SemillaServicio[];
}

export const EMPRENDEDORES: SemillaEmprendedor[] = [
  {
    email: 'gloria.arepas@queparche.co',
    nombre: 'Gloria Restrepo',
    especialidad: 'Arepas de chócolo',
    descripcion:
      'Más de 20 años haciendo arepas de chócolo con quesito en el norte de Medellín. Maíz molido en casa, asadas al carbón, como las de la abuela.',
    telefono: '+57 300 123 4501',
    correoSecundario: 'pedidos.donagloria@gmail.com',
    redesSociales: {
      instagram: 'https://instagram.com/arepasdonagloria',
      facebook: 'https://facebook.com/arepasdonagloria',
    },
    servicios: [
      {
        nombre: 'Arepas de chócolo con quesito',
        descripcion:
          'Arepa de chócolo dulcecita, asada al momento, con quesito campesino derretido encima. Combo con aguapanela fría. ¡Pa que se antoje!',
        dias: 2,
        hora: 16,
        latitud: 6.2707,
        longitud: -75.5658,
        direccion: 'Parque de los Deseos, Cra. 52 #71-117, Medellín',
      },
      {
        nombre: 'Chócolo asado de noche en Carabobo',
        descripcion:
          'Mazorca asada con mantequilla y sal, y arepas de chócolo recién hechas para el plan de caminar Carabobo Norte de noche.',
        dias: 9,
        hora: 18,
        latitud: 6.2735,
        longitud: -75.5667,
        direccion: 'Paseo Carabobo Norte, frente al Parque Explora, Medellín',
      },
    ],
  },
  {
    email: 'alvaro.bunuelos@queparche.co',
    nombre: 'Álvaro Zapata',
    especialidad: 'Buñuelos',
    descripcion:
      'El buñuelo perfecto existe: dorado por fuera, esponjoso por dentro. Receta familiar del centro de Medellín desde 1998.',
    telefono: '+57 301 456 7802',
    redesSociales: {
      facebook: 'https://facebook.com/elbunuelodeoro',
    },
    servicios: [
      {
        nombre: 'El Buñuelo de Oro — mañanera en Botero',
        descripcion:
          'Buñuelos calientes recién salidos del caldero, con avena helada o café. El desayuno de los que madrugan por el centro.',
        dias: 1,
        hora: 8,
        latitud: 6.2526,
        longitud: -75.5686,
        direccion: 'Plaza Botero, Cra. 52 con Calle 52, Medellín',
      },
      {
        nombre: 'Buñuelos y natilla en Parque Berrío',
        descripcion:
          'Combo paisa clásico: buñuelo + natilla + tinto. Al pie del Metro, perfecto para la tarde.',
        dias: 5,
        hora: 15,
        latitud: 6.2504,
        longitud: -75.5685,
        direccion: 'Parque Berrío, Cra. 50 #50-30, Medellín',
      },
    ],
  },
  {
    email: 'nelson.chuzos@queparche.co',
    nombre: 'Nelson Cardona',
    especialidad: 'Chuzos y desgranados',
    descripcion:
      'Chuzos de pollo, res y mixtos en La 70. Salsas de la casa y el mejor ambiente de fútbol de la ciudad.',
    telefono: '+57 312 789 0103',
    redesSociales: {
      instagram: 'https://instagram.com/chuzosdondenelson',
      tiktok: 'https://tiktok.com/@chuzosdondenelson',
    },
    servicios: [
      {
        nombre: 'Chuzos Donde Nelson — noche de La 70',
        descripcion:
          'Chuzo mixto con arepa, papa salada y salsas de la casa. Ambiente de rumba y fútbol en plena 70.',
        dias: 3,
        hora: 19,
        latitud: 6.2569,
        longitud: -75.5895,
        direccion: 'Cra. 70 #44-30, Laureles, Medellín',
      },
      {
        nombre: 'Desgranado especial día de partido',
        descripcion:
          'Desgranado de la casa: maíz tierno, pollo, carne desmechada, quesito y salsas. Antes del partido en el Atanasio.',
        dias: 7,
        hora: 17,
        minutos: 30,
        latitud: 6.2566,
        longitud: -75.5906,
        direccion: 'Estadio Atanasio Girardot, Cra. 74 #48-10, Medellín',
      },
    ],
  },
  {
    email: 'yesenia.mango@queparche.co',
    nombre: 'Yesenia Álvarez',
    especialidad: 'Mango biche',
    descripcion:
      'Mango biche con sal, limón y un toque secreto, en el corazón de la Comuna 13. Nacida y criada en San Javier.',
    telefono: '+57 305 234 5604',
    redesSociales: {
      instagram: 'https://instagram.com/mangobichela13',
      youtube: 'https://youtube.com/@mangobichela13',
    },
    servicios: [
      {
        nombre: 'Mango biche en las escaleras eléctricas',
        descripcion:
          'El clásico de la 13: mango biche frío con sal, limón y pimienta, mientras recorres el graffitour. También maracuyá y piña.',
        dias: 2,
        hora: 11,
        latitud: 6.2498,
        longitud: -75.6199,
        direccion: 'Escaleras eléctricas, Las Independencias, Comuna 13, Medellín',
      },
      {
        nombre: 'Frutero fin de semana en San Javier',
        descripcion:
          'Vasos de fruta picada, mango biche y salpicón a la salida del Metro. Ideal pa empezar el recorrido por la 13.',
        dias: 6,
        hora: 10,
        latitud: 6.2566,
        longitud: -75.6134,
        direccion: 'Estación San Javier del Metro, Calle 44 #99-81, Medellín',
      },
    ],
  },
  {
    email: 'marta.empanadas@queparche.co',
    nombre: 'Marta Giraldo',
    especialidad: 'Empanadas',
    descripcion:
      'Empanadas de papa y carne fritas al momento, con ají casero que pica sabroso. Tradición envigadeña de tres generaciones.',
    telefono: '+57 314 567 8905',
    correoSecundario: 'empanadaslapaisa@hotmail.com',
    redesSociales: {
      facebook: 'https://facebook.com/empanadaslapaisaenvigado',
      instagram: 'https://instagram.com/empanadaslapaisa',
    },
    servicios: [
      {
        nombre: 'Empanadas La Paisa en el parque de Envigado',
        descripcion:
          'Empanadas crocantes de papa y carne con ají de la casa. De a tres con gaseosa. Frente a la iglesia Santa Gertrudis.',
        dias: 1,
        hora: 16,
        latitud: 6.1716,
        longitud: -75.5857,
        direccion: 'Parque principal de Envigado, Cra. 43 #38 Sur, Envigado',
      },
      {
        nombre: 'Tarde de empanadas en Sabaneta',
        descripcion:
          'La romería sabe mejor con empanada: puesto especial junto al parque de Sabaneta, con ají suave y picante.',
        dias: 8,
        hora: 15,
        latitud: 6.1516,
        longitud: -75.6167,
        direccion: 'Parque principal de Sabaneta, Cra. 45 #71 Sur, Sabaneta',
      },
    ],
  },
  {
    email: 'julian.cholados@queparche.co',
    nombre: 'Julián Ospina',
    especialidad: 'Cholados y raspao',
    descripcion:
      '"El Primo" de los cholados: hielo raspado, frutas frescas, lechera y galleta. El plan perfecto pa la calor de Medellín.',
    telefono: '+57 316 890 1206',
    redesSociales: {
      instagram: 'https://instagram.com/choladoselprimo',
    },
    servicios: [
      {
        nombre: 'Cholados El Primo en Lleras',
        descripcion:
          'Cholado full frutas: mango, piña, banano, fresa, lechera y coco rallado. La tarde en El Poblado no sabe igual sin uno.',
        dias: 4,
        hora: 15,
        latitud: 6.2103,
        longitud: -75.5666,
        direccion: 'Parque Lleras, Cra. 38 con Calle 9, El Poblado, Medellín',
      },
    ],
  },
  {
    email: 'andres.salchipapas@queparche.co',
    nombre: 'Andrés Múnera',
    especialidad: 'Salchipapas',
    descripcion:
      'Salchipapas de verdad: papa criolla, salchicha ranchera, quesito y salsas al gusto. El parcero de la comida nocturna en Laureles.',
    telefono: '+57 318 345 6707',
    redesSociales: {
      instagram: 'https://instagram.com/salchipapaselparcero',
      x: 'https://x.com/salchielparcero',
    },
    servicios: [
      {
        nombre: 'Salchipapa nocturna en el Primer Parque',
        descripcion:
          'Salchipapa especial con papa criolla, ranchera, maicitos, quesito y salsa de la casa. Pa cerrar la noche en Laureles.',
        dias: 2,
        hora: 20,
        latitud: 6.2442,
        longitud: -75.5924,
        direccion: 'Primer Parque de Laureles, Cra. 73 con Circular 1a, Medellín',
      },
      {
        nombre: 'Combo parcero en La 33',
        descripcion:
          'Salchipapa + chorizo santarrosano + gaseosa. Puesto frente a la zona de food trucks de La 33.',
        dias: 9,
        hora: 19,
        latitud: 6.239,
        longitud: -75.5766,
        direccion: 'Avenida 33 con Cra. 65, Medellín',
      },
    ],
  },
  {
    email: 'rosa.obleas@queparche.co',
    nombre: 'Rosa Bedoya',
    especialidad: 'Obleas y mazamorra',
    descripcion:
      'Obleas con arequipe artesanal y mazamorra con panela, como en el pueblo. Endulzando el Cerro Nutibara hace 15 años.',
    telefono: '+57 320 678 9008',
    redesSociales: {
      facebook: 'https://facebook.com/obleasdonarosa',
    },
    servicios: [
      {
        nombre: 'Obleas Doña Rosa en el Pueblito Paisa',
        descripcion:
          'Oblea sencilla o full: arequipe, queso rallado, crema de leche y mora. Con vista a toda Medellín desde el Nutibara.',
        dias: 6,
        hora: 14,
        latitud: 6.2359,
        longitud: -75.5806,
        direccion: 'Pueblito Paisa, Cerro Nutibara, Calle 30A #55-64, Medellín',
      },
      {
        nombre: 'Mazamorra y oblea en el Jardín Botánico',
        descripcion:
          'Vaso de mazamorra fría con bocadillo y panela raspada, o una oblea pa la caminada entre los guaduales.',
        dias: 12,
        hora: 11,
        latitud: 6.2705,
        longitud: -75.5636,
        direccion: 'Entrada del Jardín Botánico, Calle 73 #51D-14, Medellín',
      },
    ],
  },
];

/** Un par de clientes para que el modelo de roles quede representado en los datos. */
export const CLIENTES = [
  { email: 'camila.torres@example.com', nombre: 'Camila Torres' },
  { email: 'sebastian.mejia@example.com', nombre: 'Sebastián Mejía' },
];
