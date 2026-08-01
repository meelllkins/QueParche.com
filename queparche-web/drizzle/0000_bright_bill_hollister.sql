CREATE TABLE `servicios` (
	`id` text PRIMARY KEY NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text NOT NULL,
	`fecha_hora` text NOT NULL,
	`latitud` real NOT NULL,
	`longitud` real NOT NULL,
	`direccion` text NOT NULL,
	`emprendedor_id` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`emprendedor_id`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_servicios_emprendedor` ON `servicios` (`emprendedor_id`);--> statement-breakpoint
CREATE INDEX `idx_servicios_fecha` ON `servicios` (`fecha_hora`);--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`nombre` text NOT NULL,
	`rol` text NOT NULL,
	`telefono` text,
	`correo_secundario` text,
	`redes_sociales` text NOT NULL,
	`especialidad` text,
	`descripcion` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_email_unique` ON `usuarios` (`email`);