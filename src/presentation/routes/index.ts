import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { eventRoutes } from './event.routes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/events', eventRoutes);

routes.get('/', (req, res) => {
    return res.json({ message: 'EventSync API is running' });
});

export { routes };
