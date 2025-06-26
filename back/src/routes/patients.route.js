import {Router} from 'express'    
import { createPatient, getPatiens, updatePatient } from '../controllers/patients.controller.js'

const routerPatients = Router();

// agregar pacientes
routerPatients.post('/patients', createPatient);
// obtener todos los pacientes
routerPatients.get ('/patients', getPatiens)

// actualizar paciente
routerPatients.put('/patients/:id_paciente', updatePatient);

export default routerPatients