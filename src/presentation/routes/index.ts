import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { eventRoutes } from './event.routes';
import { registrationRoutes } from './registration.routes';
import { checkinRoutes } from './checkin.routes';
import { socialRoutes } from './social.routes';
import { engagementRoutes } from './engagement.routes';
import { notificationRoutes } from './notification.routes';
import { userRoutes } from './user.routes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/users', userRoutes); // Prefix /users
routes.use('/events', eventRoutes);
routes.use('/', registrationRoutes);
routes.use('/', checkinRoutes);
routes.use('/', socialRoutes);
routes.use('/', engagementRoutes);
routes.use('/', notificationRoutes);


routes.get('/', (req, res) => {
    return res.json({ message: 'EventSync API is running' });
});

export { routes };
