import express from 'express'
import { pgdb } from './config.js'
import morgan  from 'morgan'
import cors from 'cors'
import routerUsers from './routes/users.route.js'
import routerPatients from './routes/patients.route.js'
import routerLogin from './routes/login.route.js'
import routerHistory from './routes/history.route.js'



const app = express ();

app.use (morgan('dev'))
app.use(cors());
app.use (express.json())
app.use (express.urlencoded({extended: false}))



// handling errors
app.use((err, req, res, next) => {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  });

  app.use(routerUsers)
  app.use(routerPatients)
  app.use(routerLogin)
  app.use(routerHistory)
app.listen (pgdb.PORT)
console.log ('conectado en el puerto', pgdb.PORT)

