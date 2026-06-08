import { Response, NextFunction } from 'express';
import requireAuth from '@/presentation/auth/middlewares/requireAuth';

describe('requireAuth', () => {
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

  it('should return 401 when req.user is missing', () => {
    const req = {} as any;
    const res = mockRes();
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token de autenticación requerido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next when req.user exists', () => {
    const req = { user: { id: 'u1', email: 'a@b.com' } } as any;
    const res = mockRes();
    requireAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
