import {Router} from 'express';
import { createUser } from '../controllers/users.controller.js';

const routerUsers = Router();

routerUsers.post('/users', createUser);


export default routerUsers