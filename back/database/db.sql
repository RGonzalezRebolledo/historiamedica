-- consultas sql para crear la BD

 CREATE DATABASE medical;

--  CREATE TABLE users (
--      id SERIAL PRIMARY KEY,
--      name VARCHAR (40),
--      email TEXT NOT NULL UNIQUE,
--      password TEXT NOT NULL,
--      created TIMESTAMP NOT NULL DEFAULT NOW () 
--  );

-- CREATE TABLE patients (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR (40),
--     age INT,
    
-- )

-- Creación de la tabla Doctores (o Usuarios)
CREATE TABLE Usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Almacenar hashes de contraseñas, no contraseñas en texto plano
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100),
    licencia_medica VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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


-- Creación de la tabla Consultas (que representa cada visita o historia médica)
CREATE TABLE Consultas (
    id_consulta SERIAL PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_consulta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo_consulta TEXT,
    notas_generales TEXT,
    FOREIGN KEY (id_paciente) REFERENCES Pacientes(id_paciente), -- campo relacionado
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) -- campo relacionado
);

-- Creación de la tabla Antecedentes
CREATE TABLE Antecedentes (
    id_antecedente SERIAL PRIMARY KEY,
    id_consulta INT NOT NULL,
   -- tipo_antecedente VARCHAR(50), -- Ej: 'Personales', 'Familiares', 'Quirúrgicos', 'Alergias'
    quirurgicos TEXT,
    alergias TEXT,
    hta BOOLEAN DEFAULT FALSE,
    dm BOOLEAN DEFAULT FALSE,
    asma BOOLEAN DEFAULT FALSE,
    tabaquicos BOOLEAN DEFAULT FALSE,
    cancer TEXT,
    psiquiatricos TEXT,
    medicamentos TEXT,
    otros_ant TEXT,
    FOREIGN KEY (id_consulta) REFERENCES Consultas(id_consulta)
);

-- Creacion de tabla cuestionario del dolor

CREATE TABLE Cuestionario (
  id_cuestionario SERIAL PRIMARY KEY,
  id_consulta INT NOT NULL,
  donde_dol TEXT,
  cuando_dol TEXT,
  intenso_dol TEXT,
  dimension_dol VARCHAR(12),
  tipo_dol VARCHAR (20), -- como es el dolor
  otrotipo_dol TEXT, 
  irradia_dol TEXT,
  frecuencia_dol TEXT,
  patron_dol TEXT,
  intensidad_dol INT,
  acentua_dol TEXT,
  atenua_dol TEXT,
  caminar_dol BOOLEAN DEFAULT FALSE,
  ansiedad_dol TEXT,
  capacidad_dol TEXT, --disminuye capacidad para realizar actividades
  sueno_dol BOOLEAN DEFAULT FALSE, -- tiene un seuno reparador
  medicamentos_dol TEXT -- medicamentos tomados para aliviar el dolor
);

-- Creación de la tabla ExamenFisico
CREATE TABLE ExamenFisico (
    id_examen_fisico SERIAL PRIMARY KEY,
    id_consulta INT NOT NULL,
    condicion TEXT,
    simetria_miembros TEXT,
    fuerza_muscular VARCHAR(20),
    fuerza_muscular_des TEXT,
    sensibilidad_des TEXT,
    sensiblidad VARCHAR(20),
    hipoestesia_tacto BOOLEAN DEFAULT FALSE,
    hipoestesia_pinchazo BOOLEAN DEFAULT FALSE,
    provocado_roce BOOLEAN DEFAULT FALSE,
    descripcion_diagnostico TEXT,
    plan_trabajo TEXT ,
    FOREIGN KEY (id_consulta) REFERENCES Consultas(id_consulta)
);

-- Creación de la tabla Diagnosticos
-- CREATE TABLE Diagnosticos (
--     id_diagnostico SERIAL PRIMARY KEY,
--     id_consulta INT NOT NULL,
--     codigo_cie VARCHAR(20), -- Código internacional de enfermedades (CIE-10, CIE-11, etc.)
--     descripcion_diagnostico TEXT NOT NULL,
--     es_principal BOOLEAN DEFAULT TRUE, -- Indica si es el diagnóstico principal de la consulta
--     notas_diagnostico TEXT,
--     FOREIGN KEY (id_consulta) REFERENCES Consultas(id_consulta)
-- ); -->