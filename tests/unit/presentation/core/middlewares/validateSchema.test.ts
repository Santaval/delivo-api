import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import validateSchema from '@/presentation/core/middlewares/validateSchema';

describe('validateSchema', () => {
  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call next when body is valid', () => {
    const schema = z.object({ name: z.string() });
    const req = { body: { name: 'Test' } } as Request;
    const res = mockRes();
    validateSchema(schema)(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 400 with first issue message when body is invalid', () => {
    const schema = z.object({ name: z.string().min(1) });
    const req = { body: { name: '' } } as Request;
    const res = mockRes();
    validateSchema(schema)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
    expect(next).not.toHaveBeenCalled();
  });
});
