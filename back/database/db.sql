-- consultas sql para crear la BD

-- CREATE DATABASE medical;

-- CREATE TABLE users (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR (40),
--     email TEXT NOT NULL UNIQUE,
--     password TEXT NOT NULL,
--     created TIMESTAMP NOT NULL DEFAULT NOW () 
-- );

-- CREATE TABLE patients (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR (40),
--     age INT,
    
-- )

<!-- -- Creación de la tabla Pacientes
CREATE TABLE Pacientes (
    id_paciente SERIAL PRIMARY KEY,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    genero VARCHAR(10),
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    ocupacion VARCHAR(100),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creación de la tabla Doctores (o Usuarios)
CREATE TABLE Doctores (
    id_doctor SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Almacenar hashes de contraseñas, no contraseñas en texto plano
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100),
    licencia_medica VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creación de la tabla Consultas (que representa cada visita o historia médica)
CREATE TABLE Consultas (
    id_consulta SERIAL PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_doctor INT NOT NULL,
    fecha_consulta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo_consulta TEXT,
    notas_generales TEXT,
    FOREIGN KEY (id_paciente) REFERENCES Pacientes(id_paciente),
    FOREIGN KEY (id_doctor) REFERENCES Doctores(id_doctor)
);

-- Creación de la tabla Antecedentes
CREATE TABLE Antecedentes (
    id_antecedente SERIAL PRIMARY KEY,
    id_consulta INT NOT NULL,
    tipo_antecedente VARCHAR(50), -- Ej: 'Personales', 'Familiares', 'Quirúrgicos', 'Alergias'
    descripcion TEXT NOT NULL,
    FOREIGN KEY (id_consulta) REFERENCES Consultas(id_consulta)
);

-- Creación de la tabla ExamenFisico
CREATE TABLE ExamenFisico (
    id_examen_fisico SERIAL PRIMARY KEY,
    id_consulta INT NOT NULL,
    temperatura DECIMAL(4,2), -- Ejemplo: 36.50
    presion_arterial VARCHAR(20), -- Ejemplo: '120/80 mmHg'
    frecuencia_cardiaca INT, -- Latidos por minuto
    frecuencia_respiratoria INT, -- Respiraciones por minuto
    peso DECIMAL(5,2), -- Ejemplo: 70.50 kg
    altura DECIMAL(4,2), -- Ejemplo: 1.75 m
    descripcion_general TEXT,
    cabeza_cuello TEXT,
    torax TEXT,
    abdomen TEXT,
    extremidades TEXT,
    neurologico TEXT,
    piel_faneras TEXT,
    FOREIGN KEY (id_consulta) REFERENCES Consultas(id_consulta)
);

-- Creación de la tabla Diagnosticos
CREATE TABLE Diagnosticos (
    id_diagnostico SERIAL PRIMARY KEY,
    id_consulta INT NOT NULL,
    codigo_cie VARCHAR(20), -- Código internacional de enfermedades (CIE-10, CIE-11, etc.)
    descripcion_diagnostico TEXT NOT NULL,
    es_principal BOOLEAN DEFAULT TRUE, -- Indica si es el diagnóstico principal de la consulta
    notas_diagnostico TEXT,
    FOREIGN KEY (id_consulta) REFERENCES Consultas(id_consulta)
); -->