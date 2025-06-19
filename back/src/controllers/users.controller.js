import { pool } from "../db.js";

export const createUser = async (req, res, next) => {
  const { password_hash, nombre, especialidad,licencia_medica,email} = req.body;

  //VALIDO QUE NO FALTE ALGUN DATO RECIBIDO
  if (!password_hash || !nombre || !especialidad || !licencia_medica || !email) {
    return res
      .status(409)
      .json({ error: "todos los datos son requeridos, verifique" });
  }

  try {
    //VERIFICO SI EL USUARIO YA EXISTE EN LA DB
    const user = await pool.query("SELECT * FROM Usuarios WHERE email = $1", [
      email,
    ]);

    if (user.rows.length != 0) {
      return res
        .status(409)
        .json({ error: "el usuario ya existe, verifique el" });
    } else {
      const newUser = await pool.query(
        "INSERT INTO Usuarios (password_hash, nombre, especialidad,licencia_medica,email) VALUES ($1,$2,$3,$4,$5)",
        [password_hash, nombre, especialidad,licencia_medica,email]
      );
      res.status(500).json({ mensaje: "usuario registrado con exito" });
    }
  } catch (error) {
    console.log (error)
    return res.status(500).json({ message: "ocurrio un error en el servidor" });
  }
};
