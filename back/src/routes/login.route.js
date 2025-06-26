import {Router} from 'express'
import { validateUser } from '../controllers/login.controller';

const routerLogin = Router ();

// verifico si el usuario esta registrado correctamente
routerLogin('/login', validateUser)
