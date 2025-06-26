import {pool} from '../db.js';


async function validateRegisterPatient (pool,email,cedula) {
  // VALIDO SI EL PACIENTE YA TIENE LA CEDULA REGISTRADA

const validatePatient = await pool.query ('SELECT cedula, email FROM Pacientes WHERE cedula = $1 OR email = $2', [cedula, email] )

if (validatePatient.rows.length > 0) {
    const validateExtisting = validatePatient.rows[0];

    // FUNCION PARA VALIDAR LA CEDULA Y EL EMAIL DEL PACIENTE
    if (validateExtisting.cedula === cedula && validateExtisting.email === email) {
      return { status: 409, message: 'el usuario con la cedula y el email ya existen' };
    } else if (validateExtisting.email === email) {
      return { status: 409, message: 'el email ya existe' };
    } else if (validateExtisting.cedula === cedula) { // Este era el bloque mal ubicado
      return { status: 409, message: 'la cedula ya existe' };
    }
  }
  return null;
}



export const createPatient = async (req,res) => {
    
    const {cedula,nombre,apellido,fecha_nacimiento,genero,telefono,email,ocupacion,direccion} = req.body;



    // VALIDO QUE NO FALTEN DATOS EN EL FRONT
    if (!cedula || !nombre || !apellido || !fecha_nacimiento || !genero || !telefono || !email || !ocupacion || !direccion) {
        res.status(409).json ({message: 'todos los datos son requeridos, verifique'})
    }

    try {

       // VALIDO QUE LA CEDULA Y EL EMAIL DEL PACIENTE NO ESTEN REPETIDOS
       const existenceCheckResult = await validateRegisterPatient(pool, email, cedula);

       if (existenceCheckResult) {
         // Si existenceCheck no es null, significa que hay un conflicto
         return res.status(existenceCheckResult.status).json({
           message: existenceCheckResult.message
         });
       }

        const patientResult = await pool.query ('INSERT INTO Pacientes (cedula,nombre,apellido,fecha_nacimiento,genero,telefono,email,ocupacion, direccion) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)', [cedula,nombre,apellido,fecha_nacimiento,genero,telefono,email,ocupacion,direccion])

        res.status(200).json('Paciente registrado con exito')
    
    } catch (error) {
        res.status(500).json ({message: 'error en el servidor'})
        console.log (error)
    }
    
};

export const getPatiens = async (req,res,next) => {
    try {
        
        const getResult = await pool.query('SELECT * FROM Pacientes') 
        res.status(200).json(getResult.rows)

    } catch (error) {
        res.status(409).json({message:'Error en el servidor'})
    }
}

export const updatePatient = async (req, res, next) => {
    const { id_paciente } = req.params; // ID del paciente que se está actualizando
    const { cedula, nombre, apellido, fecha_nacimiento, genero, telefono, email, ocupacion, direccion } = req.body;

    try {
        // 1. Validación de datos requeridos (opcional, pero buena práctica)
        if (!cedula || !nombre || !apellido || !fecha_nacimiento || !genero || !telefono || !email || !ocupacion || !direccion) {
            return res.status(400).json({ message: 'Todos los datos del paciente son requeridos para la actualización.' });
        }

        // 2. Validar que la nueva cédula no exista en OTRO paciente
        const checkCedulaQuery = await pool.query(
            'SELECT id_paciente FROM Pacientes WHERE cedula = $1 AND id_paciente <> $2',
            [cedula, id_paciente]
        );

        if (checkCedulaQuery.rows.length > 0) {
            // Si la consulta devuelve filas, significa que esa cédula ya está en uso por otro paciente
            return res.status(409).json({ message: 'La cédula proporcionada ya está registrada por otro paciente. Verifique.' });
        }

        // 3. Validar que el nuevo email no exista en OTRO paciente (si el email es también único)
        const checkEmailQuery = await pool.query(
            'SELECT id_paciente FROM Pacientes WHERE email = $1 AND id_paciente <> $2',
            [email, id_paciente]
        );

        if (checkEmailQuery.rows.length > 0) {
            return res.status(409).json({ message: 'El email proporcionado ya está registrado por otro paciente. Verifique.' });
        }

        // 4. Si las validaciones pasan, procede con la actualización del paciente
        const updateResult = await pool.query(
            `UPDATE Pacientes
             SET cedula = $1, nombre = $2, apellido = $3, fecha_nacimiento = $4,
                 genero = $5, telefono = $6, email = $7, ocupacion = $8, direccion = $9
             WHERE id_paciente = $10 RETURNING *`, // RETURNING * para obtener el paciente actualizado
            [cedula, nombre, apellido, fecha_nacimiento, genero, telefono, email, ocupacion, direccion, id_paciente]
        );

        if (updateResult.rows.length === 0) {
            // Si no se encontró ningún paciente con ese id_paciente
            return res.status(404).json({ message: 'Paciente no encontrado o ID inválido para actualizar.' });
        }

        // 5. Envía una respuesta de éxito con los datos actualizados
        return res.status(200).json({
            message: 'Paciente actualizado satisfactoriamente',
            patient: updateResult.rows[0] // Retorna los datos del paciente actualizado
        });

    } catch (error) {
        console.error('Error al actualizar paciente:', error); // Log para depuración

        // Si tienes UNIQUE constraints en la DB para cedula o email, podrías capturar el error 23505
        if (error.code === '23505') {
            if (error.detail.includes('cedula')) {
                return res.status(409).json({ message: 'La cédula proporcionada ya está en uso por otro paciente.' });
            }
            if (error.detail.includes('email')) {
                return res.status(409).json({ message: 'El email proporcionado ya está en uso por otro paciente.' });
            }
        }
        return res.status(500).json({ message: 'Ocurrió un error en el servidor al intentar actualizar el paciente.' });
    }
};