import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";
import ForbiddenError from "../models/errors/forbidden.error.model";
import userRepository from "../repositories/user.repository";

async function jwtAuthenticationMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            throw new ForbiddenError('Credenciais not found');
        }

        const [authorizationType, jwtToken] = authorizationHeader.split(' ');

        if (authorizationType !== 'Bearer') {
            throw new ForbiddenError('Invalid authorization type');
        }

        if (!jwtToken) {
            throw new ForbiddenError('Invalid token');
        }

        try {
            const tokenPayload = JWT.verify(jwtToken, 'teste');
            if (typeof tokenPayload !== 'object' || !tokenPayload.sub) {
                throw new ForbiddenError('Invalid token');
            }

            const user = await userRepository.findByUuid(tokenPayload.sub);
            req.user = user;
            return next();
        } catch (error) {
            throw new ForbiddenError('Invalid token');
        }
    } catch (error) {
        next(error);
    }
}

export default jwtAuthenticationMiddleware;