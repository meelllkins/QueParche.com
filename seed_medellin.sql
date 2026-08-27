-- ============================================================
--  QueParche — Semilla de datos de Medellín
-- ------------------------------------------------------------
--  2 emprendedores + 3 servicios en ubicaciones reales.
--
--  EJECUCIÓN MANUAL (la app NO lo corre sola):
--      mysql -u root -p queparche < seed_medellin.sql
--
--  REQUISITO: arranca la aplicación al menos una vez antes.
--  Con `ddl-auto: update`, Hibernate crea las tablas `usuarios` y
--  `servicios`; este script solo inserta filas, no las crea.
--
--  Nombres tomados de las entidades JPA:
--      UsuarioJpaEntity  -> @Table(name = "usuarios")
--      ServicioJpaEntity -> @Table(name = "servicios")
--
--  Es re-ejecutable: primero borra sus propias filas por UUID.
-- ============================================================

START TRANSACTION;

-- ── Limpieza idempotente ────────────────────────────────────
-- Solo afecta a los UUID de esta semilla; el resto de datos queda intacto.
-- Los servicios van primero por la clave foránea hacia usuarios.
DELETE FROM servicios
 WHERE uuid IN (
   'ab1e9b84-9f53-46bc-998f-3c2d49491bd3',
   '8d3be433-b8d6-4258-be4a-1530451153bd',
   '8369d1da-ed9d-4290-87d3-b403540fb7c0'
 );

DELETE FROM usuarios
 WHERE uuid IN (
   '7bb77945-6d28-4e4c-bd1d-19d4418122eb',
   '2f46b4cd-3dd4-41e2-a39a-2fa0c4ebf289'
 );

-- ── Emprendedores ───────────────────────────────────────────
-- `password_hash` es SHA-256 en hexadecimal, igual que PasswordHasher.java.
-- El valor de abajo corresponde a la contraseña 'QueParche2026!'.
-- (El proyecto todavía no tiene login; la columna es NOT NULL y se llena
--  con un hash real por coherencia, no porque se use para autenticar.)
INSERT INTO usuarios
  (uuid, nombre, email, password_hash, rol, telefono, correo_secundario, created_at)
VALUES
  ('7bb77945-6d28-4e4c-bd1d-19d4418122eb',
   'Gloria Restrepo',
   'gloria.arepas@queparche.co',
   '4983607eee51c0fdea5fba3e8b8d5252bea2b8f19819acf44b8bb05695d69ff6',
   'EMPRENDEDOR',
   '+57 300 123 4501',
   'pedidos.donagloria@gmail.com',
   NOW()),

  ('2f46b4cd-3dd4-41e2-a39a-2fa0c4ebf289',
   'Nelson Cardona',
   'nelson.chuzos@queparche.co',
   '4983607eee51c0fdea5fba3e8b8d5252bea2b8f19819acf44b8bb05695d69ff6',
   'EMPRENDEDOR',
   '+57 312 789 0103',
   NULL,
   NOW());

-- ── Resolución de claves foráneas ───────────────────────────
-- `servicios.emprendedor_id` apunta a `usuarios.id` (BIGINT AUTO_INCREMENT),
-- NO al uuid. Se resuelve por consulta en vez de asumir 1 y 2, para que el
-- script funcione aunque la tabla ya tenga otros registros.
SET @id_gloria := (SELECT id FROM usuarios WHERE uuid = '7bb77945-6d28-4e4c-bd1d-19d4418122eb');
SET @id_nelson := (SELECT id FROM usuarios WHERE uuid = '2f46b4cd-3dd4-41e2-a39a-2fa0c4ebf289');

-- ── Servicios ───────────────────────────────────────────────
-- Las fechas se calculan a partir de la fecha actual para que la semilla
-- nunca "envejezca": siempre quedan en el futuro y la app se ve viva.
INSERT INTO servicios
  (uuid, emprendedor_id, nombre, descripcion, fecha_hora, latitud, longitud, direccion, created_at)
VALUES
  -- Gloria — Parque de los Deseos (norte de Medellín)
  ('ab1e9b84-9f53-46bc-998f-3c2d49491bd3',
   @id_gloria,
   'Arepas de chócolo con quesito',
   'Arepa de chócolo dulcecita, asada al momento, con quesito campesino derretido encima. Combo con aguapanela fría. ¡Pa que se antoje!',
   DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 16 HOUR,
   6.2707, -75.5658,
   'Parque de los Deseos, Cra. 52 #71-117, Medellín',
   NOW()),

  -- Gloria — Carabobo Norte (segundo parche del mismo emprendedor)
  ('8d3be433-b8d6-4258-be4a-1530451153bd',
   @id_gloria,
   'Chócolo asado de noche en Carabobo',
   'Mazorca asada con mantequilla y sal, y arepas de chócolo recién hechas para el plan de caminar Carabobo Norte de noche.',
   DATE_ADD(CURDATE(), INTERVAL 5 DAY) + INTERVAL 18 HOUR,
   6.2735, -75.5667,
   'Paseo Carabobo Norte, frente al Parque Explora, Medellín',
   NOW()),

  -- Nelson — La 70 (Laureles)
  ('8369d1da-ed9d-4290-87d3-b403540fb7c0',
   @id_nelson,
   'Chuzos Donde Nelson — noche de La 70',
   'Chuzo mixto con arepa, papa salada y salsas de la casa. Ambiente de rumba y fútbol en plena 70.',
   DATE_ADD(CURDATE(), INTERVAL 3 DAY) + INTERVAL 19 HOUR,
   6.2569, -75.5895,
   'Cra. 70 #44-30, Laureles, Medellín',
   NOW());

COMMIT;

-- ── Verificación ────────────────────────────────────────────
SELECT u.nombre AS emprendedor, COUNT(s.id) AS parches
  FROM usuarios u
  LEFT JOIN servicios s ON s.emprendedor_id = u.id
 WHERE u.rol = 'EMPRENDEDOR'
 GROUP BY u.id, u.nombre;
