import { Router } from 'express';
import { SocialController } from '../controllers/social/SocialController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const socialRoutes = Router();
const socialController = new SocialController();

// Solicitar amizade (contexto do evento)
socialRoutes.post('/events/:eventId/friend-request', ensureAuthenticated, socialController.requestFriendship);

// Responder amizade
socialRoutes.patch('/friends/:requestId/respond', ensureAuthenticated, socialController.respondFriendship);

// Enviar mensagem
socialRoutes.post('/messages', ensureAuthenticated, socialController.sendMessage);

// Listar mensagens com um amigo
socialRoutes.get('/messages/:friendId', ensureAuthenticated, socialController.listMessages);

export { socialRoutes };
