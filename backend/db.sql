CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(25) NOT NULL,
  `email` varchar(40) NOT NULL,
  `hash_contraseña` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `pacientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(40) NOT NULL,
  `apellido` varchar(40) NOT NULL,
  `dni` int NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `obra_social` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `medicos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(40) NOT NULL,
  `apellido` varchar(40) NOT NULL,
  `especialidad` varchar(40) NOT NULL,
  `matricula_profesional` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `turnos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int NOT NULL,
  `medico_id` int NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `estado` varchar(40) NOT NULL,
  `observaciones` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_turnos_paciente_id_idx` (`paciente_id`),
  KEY `fk_turnos_medico_id_idx` (`medico_id`),
  CONSTRAINT `fk_turnos_medico_id` FOREIGN KEY (`medico_id`) REFERENCES `medicos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_turnos_paciente_id` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;