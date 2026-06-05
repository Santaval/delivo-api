import { Request, Response, NextFunction } from 'express';
import errorHandler from './errorHandler';
import DataError from '@/domain/core/errors/DataError';
import InfrastructureError from '@/infrastructure/core/errors/InfrastructureError';
import ApplicationError from '@/application/core/errors/ApplicationError';

describe('errorHandler', () => {
  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  const mockReq = () => ({}) as Request;
  const mockNext = () => jest.fn() as NextFunction;

  it('should return DataError status and message', () => {
    const err = new DataError('Invalid data');
    const res = mockRes();
    errorHandler(err, mockReq(), res, mockNext());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid data' });
  });

  it('should return InfrastructureError status and message', () => {
    const err = new InfrastructureError('DB failure');
    (err as any).statusCode = 503;
    const res = mockRes();
    errorHandler(err, mockReq(), res, mockNext());
    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({ message: 'DB failure' });
  });

  it('should return 500 for generic Error', () => {
    const err = new Error('Something broke');
    const res = mockRes();
    errorHandler(err, mockReq(), res, mockNext());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });

  it('should return 500 for ApplicationError not caught by other branches', () => {
    const err = new ApplicationError('App failure', 422);
    const res = mockRes();
    errorHandler(err, mockReq(), res, mockNext());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});
