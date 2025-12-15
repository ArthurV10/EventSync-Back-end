import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { eventRoutes } from './event.routes';
import { registrationRoutes } from './registration.routes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/events', eventRoutes); // Nota: alguns endpoints de registro usam prefixo /events, poderíamos ter aninhado, mas vamos usar rota separada no topo ou mesclar.
// A rota definida no registration.routes.ts já inclui o prefixo /events/... ou /registrations/... então basta dar use na raiz '/', ou organizar melhor.
// Para simplificar e evitar conflito de prefixo '/events' duplicado no use, vou mudar a estratégia:
// registrationRoutes vai ser usada na raiz '/', pois ela define os caminhos completos.
routes.use('/', registrationRoutes);


routes.get('/', (req, res) => {
    return res.json({ message: 'EventSync API is running' });
});

export { routes };
