
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { ZodError } from 'zod';
import { routes } from '../presentation/routes';
import { AppError } from '../shared/errors/AppError';
import uploadConfig from './config/upload';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    if (err instanceof ZodError) {
        return response.status(400).json({
            status: 'validation_error',
            message: 'Validation error.',
            issues: err.issues,
        });
    }

    console.error(err);

    return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
        debug_name: err.name,
        debug_message: err.message
    });
});

export { app };
