CREATE DATABASE GestorMedico;

USE GestorMedico;

CREATE TABLE Paciente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    DNI VARCHAR(15) UNIQUE NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    obra_social VARCHAR(100)
);

CREATE TABLE Medico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    matricula_profesional VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE Turno (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    medico_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado ENUM('pendiente', 'atendido', 'cancelado') DEFAULT 'pendiente',
    observaciones TEXT,
    FOREIGN KEY (paciente_id) REFERENCES Paciente(id) ON DELETE CASCADE,
    FOREIGN KEY (medico_id) REFERENCES Medico(id) ON DELETE CASCADE
);