import { pool } from "../db.js";

// FUNCION PARA VALIDAR EL MAIL Y LA LICENCIA

// async function checkUserExistence(pool, email, licencia_medica) {
  
// // Consulta para verificar si ya existe un usuario con el mismo email O la misma licencia_medica
// const userExists = await pool.query(
//   "SELECT email, licencia_medica FROM Usuarios WHERE email = $1 OR licencia_medica = $2",
//   [email, licencia_medica]
// );

// if (userExists.rows.length > 0) {
//   // Si encontramos alguna fila, significa que al menos uno de los campos ya existe
//   const existingUser = userExists.rows[0]; // Tomamos la primera coincidencia

//   if (
//     existingUser.email === email &&
//     existingUser.licencia_medica === licencia_medica
//   ) {
//     // Ambos campos ya existen en el mismo usuario, lo cual es redundante pero indica conflicto.
//     return res
//       .status(409)
//       .json({
//         message: "El usuario con este email y licencia médica ya existe.",
//       });
//   } else if (existingUser.email === email) {
//     // Solo el email ya existe
//     return res
//       .status(409)
//       .json({
//         message: "El email ya está registrado. Por favor, verifique.",
//       });
//   } else if (existingUser.licencia_medica === licencia_medica) {
//     // Solo la licencia médica ya existe
//     return res
//       .status(409)
//       .json({
//         message:
//           "La licencia médica ya está registrada. Por favor, verifique.",
//       });
//   }
// }
// }

// FUNCION CALLBACK PARA VALIDAR

async function checkUserExistence(pool, email, licencia_medica) {
  // Consulta para verificar si ya existe un usuario con el mismo email O la misma licencia_medica
  const userExists = await pool.query(
    "SELECT email, licencia_medica FROM Usuarios WHERE email = $1 OR licencia_medica = $2",
    [email, licencia_medica]
  );

  if (userExists.rows.length > 0) {
    const existingUser = userExists.rows[0];

    if (
      existingUser.email === email &&
      existingUser.licencia_medica === licencia_medica
    ) {
      return {
        status: 409,
        message: "El usuario con este email y licencia médica ya existe.",
      };
    } else if (existingUser.email === email) {
      return {
        status: 409,
        message: "El email ya está registrado. Por favor, verifique.",
      };
    } else if (existingUser.licencia_medica === licencia_medica) {
      return {
        status: 409,
        message: "La licencia médica ya está registrada. Por favor, verifique.",
      };
    }
  }
  // Si no se encuentra ningún usuario, retornamos null o undefined,
  // lo que indica que no hay conflicto y se puede proceder con la creación.
  return null;
}





//REGISTRAR USUARIO

export const createUser = async (req, res, next) => {
  const { password_hash, nombre, especialidad, licencia_medica, email } =
    req.body;

  //VALIDO QUE NO FALTE ALGUN DATO RECIBIDO
  if (
    !password_hash ||
    !nombre ||
    !especialidad ||
    !licencia_medica ||
    !email
  ) {
    return res
      .status(409)
      .json({ error: "todos los datos son requeridos, verifique" });
  }

  try {
    
        // 1. Verificar la existencia del usuario antes de proceder
        const existenceCheckResult = await checkUserExistence(pool, email, licencia_medica);

        if (existenceCheckResult) {
          // Si existenceCheck no es null, significa que hay un conflicto
          return res.status(existenceCheckResult.status).json({
            message: existenceCheckResult.message
          });
        }

    const newUser = await pool.query(
      "INSERT INTO Usuarios (password_hash, nombre, especialidad,licencia_medica,email) VALUES ($1,$2,$3,$4,$5)",
      [password_hash, nombre, especialidad, licencia_medica, email]
    );
    res.status(201).json({ mensaje: "usuario registrado con exito" });
  
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ocurrio un error en el servidor" });
  }
};




//OBTENER USUARIOS

export const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await pool.query("SELECT * FROM Usuarios");
    res.status(200).json(allUsers.rows);
  } catch (error) {
    res.status(500).json({ message: "error del servidor" });
  }
};

// ACTUALIZAR USUARIO

export const updateUser = async (req, res, next) => {
  const {id_usuario} = req.params;
  const { password_hash, nombre, especialidad} = req.body;

  // VERIFICO SI TENGO TODOS LOS DATOS 
  if ( !password_hash || !nombre || !especialidad ) {
    return res.status(409).json({message: 'no deben existir casillas con datos faltantes'})
  }

  try {
    
    const updateResult = await pool.query(
      "UPDATE Usuarios SET password_hash = $1, nombre = $2, especialidad = $3 WHERE id_usuario = $4 RETURNING *", [password_hash, nombre, especialidad, id_usuario]
    );
    

    if (updateResult.rows.length === 0)
    return res.status(404).json({ message: "usuario no existe" });

    res.status(200).json(updateResult.rows[0]);
  
} catch (error) {
  console.log (error)
res.status (409).json({message: 'error en la respuesta del servidor'})  
}
};


