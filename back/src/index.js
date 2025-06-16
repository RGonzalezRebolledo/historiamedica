import express from 'express'
import { pgdb } from './config.js'
import morgan  from 'morgan'
import cors from 'cors'


const app = express ();

app.use (morgan('dev'))
app.use(cors());
app.use (express.json())
app.use (express.urlencoded({extended: false}))


app.listen (pgdb.PORT)
console.log ('conectado en el puerto', pgdb.PORT)

