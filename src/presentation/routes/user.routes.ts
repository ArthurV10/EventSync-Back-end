import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../../main/config/upload';
import { UserController } from '../controllers/users/UserController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const userRoutes = Router();
const upload = multer(uploadConfig);
const userController = new UserController();

userRoutes.patch('/avatar', ensureAuthenticated, upload.single('avatar'), userController.updateAvatar);

export { userRoutes };
