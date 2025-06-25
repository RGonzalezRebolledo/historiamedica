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

export const updatePatient = async (req,res,next) => {
  const {id_paciente} = req.params;
  const {cedula,nombre,apellido,fecha_nacimiento,genero,telefono,email,ocupacion,direccion} = req.body;
  try {
    
  } catch (error) {
    
  }
}