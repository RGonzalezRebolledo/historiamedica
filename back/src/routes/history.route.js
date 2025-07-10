import { Router } from "express";
import { addHistory, getAllConsultations, getConsultationsByPatientId } from "../controllers/history.controller.js";


const routerHistory = Router();

//Guardo la historia del paciente
routerHistory.post('/history',addHistory)

//obtener listado de todas las consultas
routerHistory.get('/history', getAllConsultations)

//obtener las consultas de un paciente en particular

routerHistory.get('/patients/:id_paciente/history',getConsultationsByPatientId)

export default routerHistory