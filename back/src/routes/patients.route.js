import {Router} from 'express'    
import { createPatient, getPatiens } from '../controllers/patients.controller.js'

const routerPatients = Router();

// agregar pacientes
routerPatients.post('/patients', createPatient);
// obtener todos los pacientes
routerPatients.get ('/patients', getPatiens)

export default routerPatients