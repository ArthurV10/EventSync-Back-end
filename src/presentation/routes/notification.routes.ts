import { Router } from 'express';
import { NotificationController } from '../controllers/notifications/NotificationController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const notificationRoutes = Router();
const notificationController = new NotificationController();

notificationRoutes.get('/notifications', ensureAuthenticated, notificationController.list);
notificationRoutes.patch('/notifications/:id/read', ensureAuthenticated, notificationController.markAsRead);

export { notificationRoutes };
