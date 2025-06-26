import {pool} from '../db.js'

export const validateUser = async (req,res,next) => {

    const {email,password_hash} = req.body
    
    try {
        const resultUser = await pool.query ('SELECT email,password_hash FROM usuarios WHERE email = $1 OR password_hash = $2', [email,password_hash])

        if (resultUser.rows.length > 0) {

            if (resultUser.rows[0].email != email) {
                console.log (resultUser.rows.email)
                return res.status(409).json('mail incorrecto')
            }

            if (resultUser.rows[0].password_hash != password_hash) {
                return res.status(409).json('clave incorrecta')
            }
        }

        if (resultUser.rows.length === 0) {
            return res.status(404).json('usuario no encontrado')
        } 

        return res.status(200).json ('acceso concedido')
        
    } catch (error) {
        console.error(error)
        return res.status.json ('error en el servidor')
    }
}