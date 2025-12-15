import { Router } from 'express';
import { RegisterUserController } from '../controllers/auth/RegisterUserController';
import { LoginUserController } from '../controllers/auth/LoginUserController';

const authRoutes = Router();
const registerUserController = new RegisterUserController();
const loginUserController = new LoginUserController();

authRoutes.post('/register', registerUserController.handle);
authRoutes.post('/login', loginUserController.handle);

export { authRoutes };
