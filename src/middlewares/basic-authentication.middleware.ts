import { NextFunction, Request, Response} from 'express';
import ForbiddenError from '../models/errors/forbidden.error.model';
import userRepository from '../repositories/user.repository';

export default async function basicAuthenticationMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const authorizationHeader = req.headers.authorization;
    
        if (!authorizationHeader) {
            throw new ForbiddenError('Credenciais not found');
        }
    
        const [authorizationType, token] = authorizationHeader.split(' ');

        if (authorizationType !== 'Basic' || !token) {
            throw new ForbiddenError('Tipo de autenticação inválido');
        }

        const tokenContent = Buffer.from(token, 'base64').toString('utf-8');

        const [username, password] = tokenContent.split(':');

        if (!username || !password) {
            throw new ForbiddenError('Credenciais não preenchidas');
        }

        const user = await userRepository.findByUsernameAndPassword(username, password)
        console.log(user);

        if (!user) {
            throw new ForbiddenError('Usuário ou senha inválidos!');
        }

        req.user = user;
        next();

    } catch (error) {
        next(error);
    }
}