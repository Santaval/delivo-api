import ApplicationError from '@/application/core/errors/ApplicationError';
import DomainError from '@/domain/core/errors/DomainError';
import InfrastructureError from '@/infrastructure/core/errors/InfrastructureError';
import { InsufficientCreditsError } from '@/application/credits/errors/InsufficientCreditsError';
import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    // log error type and stack trace
    console.log(typeof err);
    console.error("Error:", err.stack);

    // Must come before the generic ApplicationError branch, which would drop the payload.
    if (err instanceof InsufficientCreditsError) {
        res.status(402).json(err.toPayload());
        return;
    }

    if (err instanceof DomainError || err instanceof InfrastructureError || err instanceof ApplicationError) {
        res.status(err.statusCode).json({ message: err.message });
        return;
    }

    res.status(500).json({ message: 'Internal Server Error' });
    return
};

export default errorHandler;