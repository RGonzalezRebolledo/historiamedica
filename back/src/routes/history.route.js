import { Router } from "express";
import { addHistory } from "../controllers/history.controller.js";


const routerHistory = Router();

//Guardo la historia del paciente
routerHistory.post('/history',addHistory)

export default routerHistory