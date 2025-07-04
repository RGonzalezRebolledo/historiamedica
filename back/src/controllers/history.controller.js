// Importa tu pool de conexiones a la base de datos
// Asegúrate de que la ruta sea correcta según la ubicación de tu archivo db.js
import { pool } from '../db.js';

/**
 * @desc Crea una nueva consulta y sus datos relacionados (Antecedentes, Cuestionario, ExamenFisico)
 * @route POST /api/consultas
 * @access Private (ej. requiere autenticación de usuario/doctor)
 */
export const addHistory = async (req, res, next) => {
    // Desestructurar los datos de la solicitud.
    // Se espera que el cuerpo de la solicitud (req.body) contenga objetos anidados
    // para cada tabla, por ejemplo:
    /*
    {
      "consulta": {
        "id_paciente": 1,
        "id_usuario": 1,
        "motivo_consulta": "Dolor de cabeza recurrente",
        "notas_generales": "Paciente refiere estrés laboral."
      },
      "antecedentes": {
        "quirurgicos": "Apéndice extirpado en 2005",
        "alergias": "Ninguna conocida",
        "hta": false,
        "dm": false,
        "asma": false,
        "tabaquicos": true,
        "cancer": "Ninguno",
        "psiquiatricos": "Ansiedad diagnosticada hace 2 años",
        "medicamentos": "Paracetamol ocasionalmente",
        "otros_ant": "Fractura de tibia en 2010"
      },
      "cuestionario": {
        "donde_dol": "Cabeza (frontal)",
        "cuando_dol": "Por las tardes, después del trabajo",
        "intenso_dol": "Moderado a severo",
        "dimension_dol": "Pulsátil",
        "tipo_dol": "Presión",
        "otrotipo_dol": null,
        "irradia_dol": "No",
        "frecuencia_dol": "Casi todos los días laborables",
        "patron_dol": "Empeora con el estrés",
        "intensidad_dol": 7,
        "acentua_dol": "Luces brillantes, ruido, estrés",
        "atenua_dol": "Reposo, oscuridad, paracetamol",
        "caminar_dol": false,
        "ansiedad_dol": "Sí, durante los episodios de dolor",
        "capacidad_dol": "Dificultad para concentrarse en el trabajo",
        "sueno_dol": false,
        "medicamentos_dol": "Ibuprofeno 400mg"
      },
      "examenFisico": {
        "condicion": "Consciente, orientado, buen estado general.",
        "simetria_miembros": "Simétricos",
        "fuerza_muscular": "5/5",
        "fuerza_muscular_des": null,
        "sensibilidad_des": null,
        "sensiblidad": "Normal",
        "hipoestesia_tacto": false,
        "hipoestesia_pinchazo": false,
        "provocado_roce": false,
        "descripcion_diagnostico": "Cefalea tensional.",
        "plan_trabajo": "Manejo del estrés, AINEs, seguimiento."
      }
    }
    */
    const {
        consulta,
        antecedentes,
        cuestionario,
        examenFisico
    } = req.body;

    // Validación básica de los datos principales de la consulta
    // Estos campos son obligatorios para crear una entrada en la tabla 'Consultas'
    if (!consulta || !consulta.id_paciente || !consulta.id_usuario || !consulta.motivo_consulta) {
        return res.status(400).json({ message: 'Datos principales de la consulta (id_paciente, id_usuario, motivo_consulta) son requeridos.' });
    }

    // Obtener un cliente del pool de conexiones para iniciar una transacción
    const client = await pool.connect();
    try {
        // Iniciar la transacción SQL
        await client.query('BEGIN');

        // 1. Insertar en la tabla 'Consultas'
        // 'RETURNING id_consulta' nos devuelve el ID generado automáticamente para la nueva consulta,
        // que es necesario para las tablas relacionadas.
        const consultaResult = await client.query(
            `INSERT INTO Consultas (id_paciente, id_usuario, motivo_consulta, notas_generales)
             VALUES ($1, $2, $3, $4)
             RETURNING id_consulta`,
            [
                consulta.id_paciente,
                consulta.id_usuario,
                consulta.motivo_consulta,
                consulta.notas_generales || null // Si notas_generales no se envía, se inserta como NULL
            ]
        );
        const id_consulta = consultaResult.rows[0].id_consulta; // Capturar el ID de la consulta recién creada

        // 2. Insertar en la tabla 'Antecedentes'
        // Solo insertamos si se proporcionan datos para antecedentes en el body
        if (antecedentes) {
            await client.query(
                `INSERT INTO Antecedentes (
                    id_consulta, quirurgicos, alergias, hta, dm, asma, tabaquicos,
                    cancer, psiquiatricos, medicamentos, otros_ant
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [
                    id_consulta, // Usamos el ID de la consulta principal
                    antecedentes.quirurgicos || null,
                    antecedentes.alergias || null,
                    antecedentes.hta || false, // Los BOOLEAN se pueden enviar como true/false
                    antecedentes.dm || false,
                    antecedentes.asma || false,
                    antecedentes.tabaquicos || false,
                    antecedentes.cancer || null,
                    antecedentes.psiquiatricos || null,
                    antecedentes.medicamentos || null,
                    antecedentes.otros_ant || null
                ]
            );
        }

        // 3. Insertar en la tabla 'Cuestionario'
        // Solo insertamos si se proporcionan datos para el cuestionario en el body
        if (cuestionario) {
            await client.query(
                `INSERT INTO Cuestionario (
                    id_consulta, donde_dol, cuando_dol, intenso_dol, dimension_dol,
                    tipo_dol, otrotipo_dol, irradia_dol, frecuencia_dol, patron_dol,
                    intensidad_dol, acentua_dol, atenua_dol, caminar_dol, ansiedad_dol,
                    capacidad_dol, sueno_dol, medicamentos_dol
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
                [
                    id_consulta, // Usamos el ID de la consulta principal
                    cuestionario.donde_dol || null,
                    cuestionario.cuando_dol || null,
                    cuestionario.intenso_dol || null,
                    cuestionario.dimension_dol || null,
                    cuestionario.tipo_dol || null,
                    cuestionario.otrotipo_dol || null,
                    cuestionario.irradia_dol || null,
                    cuestionario.frecuencia_dol || null,
                    cuestionario.patron_dol || null,
                    cuestionario.intensidad_dol || null,
                    cuestionario.acentua_dol || null,
                    cuestionario.atenua_dol || null,
                    cuestionario.caminar_dol || false,
                    cuestionario.ansiedad_dol || null,
                    cuestionario.capacidad_dol || null,
                    cuestionario.sueno_dol || false,
                    cuestionario.medicamentos_dol || null
                ]
            );
        }

        // 4. Insertar en la tabla 'ExamenFisico'
        // Solo insertamos si se proporcionan datos para el examen físico en el body
        if (examenFisico) {
            await client.query(
                `INSERT INTO ExamenFisico (
                    id_consulta, condicion, simetria_miembros, fuerza_muscular,
                    fuerza_muscular_des, sensibilidad_des, sensiblidad, hipoestesia_tacto,
                    hipoestesia_pinchazo, provocado_roce, descripcion_diagnostico, plan_trabajo
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                [
                    id_consulta, // Usamos el ID de la consulta principal
                    examenFisico.condicion || null,
                    examenFisico.simetria_miembros || null,
                    examenFisico.fuerza_muscular || null,
                    examenFisico.fuerza_muscular_des || null,
                    examenFisico.sensibilidad_des || null,
                    examenFisico.sensiblidad || null,
                    examenFisico.hipoestesia_tacto || false,
                    examenFisico.hipoestesia_pinchazo || false,
                    examenFisico.provocado_roce || false,
                    examenFisico.descripcion_diagnostico || null,
                    examenFisico.plan_trabajo || null
                ]
            );
        }

        // Si todas las inserciones fueron exitosas, confirmar la transacción
        await client.query('COMMIT');

        // Enviar respuesta de éxito
        return res.status(201).json({
            message: 'Consulta y datos relacionados registrados exitosamente.',
            id_consulta: id_consulta // Puedes devolver el ID de la consulta principal creada
        });

    } catch (error) {
        // Si ocurre algún error, revertir la transacción para deshacer todas las inserciones
        await client.query('ROLLBACK');
        console.error('Error al registrar la consulta y sus datos relacionados:', error);

        // Envía una respuesta de error al cliente
        return res.status(500).json({
            message: 'Error interno del servidor al registrar la consulta y sus datos.',
            error: error.message // Puedes incluir el mensaje de error para depuración (en desarrollo)
        });
    } finally {
        // Asegúrate siempre de liberar el cliente de vuelta al pool, incluso si hay errores
        client.release();
    }
};

export const getAllConsultations = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                c.id_consulta,
                c.id_paciente,
                c.id_usuario,
                c.motivo_consulta,
                c.notas_generales,
                c.fecha_creacion,
                json_build_object(
                    'id_antecedentes', a.id_antecedentes,
                    'quirurgicos', a.quirurgicos,
                    'alergias', a.alergias,
                    'hta', a.hta,
                    'dm', a.dm,
                    'asma', a.asma,
                    'tabaquicos', a.tabaquicos,
                    'cancer', a.cancer,
                    'psiquiatricos', a.psiquiatricos,
                    'medicamentos', a.medicamentos,
                    'otros_ant', a.otros_ant
                ) AS antecedentes,
                json_build_object(
                    'id_cuestionario', cu.id_cuestionario,
                    'donde_dol', cu.donde_dol,
                    'cuando_dol', cu.cuando_dol,
                    'intenso_dol', cu.intenso_dol,
                    'dimension_dol', cu.dimension_dol,
                    'tipo_dol', cu.tipo_dol,
                    'otrotipo_dol', cu.otrotipo_dol,
                    'irradia_dol', cu.irradia_dol,
                    'frecuencia_dol', cu.frecuencia_dol,
                    'patron_dol', cu.patron_dol,
                    'intensidad_dol', cu.intensidad_dol,
                    'acentua_dol', cu.acentua_dol,
                    'atenua_dol', cu.atenua_dol,
                    'caminar_dol', cu.caminar_dol,
                    'ansiedad_dol', cu.ansiedad_dol,
                    'capacidad_dol', cu.capacidad_dol,
                    'sueno_dol', cu.sueno_dol,
                    'medicamentos_dol', cu.medicamentos_dol
                ) AS cuestionario,
                json_build_object(
                    'id_examen_fisico', ef.id_examen_fisico,
                    'condicion', ef.condicion,
                    'simetria_miembros', ef.simetria_miembros,
                    'fuerza_muscular', ef.fuerza_muscular,
                    'fuerza_muscular_des', ef.fuerza_muscular_des,
                    'sensibilidad_des', ef.sensibilidad_des,
                    'sensiblidad', ef.sensiblidad,
                    'hipoestesia_tacto', ef.hipoestesia_tacto,
                    'hipoestesia_pinchazo', ef.hipoestesia_pinchazo,
                    'provocado_roce', ef.provocado_roce,
                    'descripcion_diagnostico', ef.descripcion_diagnostico,
                    'plan_trabajo', ef.plan_trabajo
                ) AS examenFisico
            FROM
                Consultas c
            LEFT JOIN
                Antecedentes a ON c.id_consulta = a.id_consulta
            LEFT JOIN
                Cuestionario cu ON c.id_consulta = cu.id_consulta
            LEFT JOIN
                ExamenFisico ef ON c.id_consulta = ef.id_consulta
            ORDER BY
                c.fecha_creacion DESC;
        `);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron consultas.' });
        }

        return res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error al obtener todas las consultas:', error);
        return res.status(500).json({
            message: 'Error interno del servidor al obtener las consultas.',
            error: error.message
        });
    }
};