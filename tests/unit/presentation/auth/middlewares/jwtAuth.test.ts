import { Request, Response, NextFunction } from 'express';
import jwtAuth from '@/presentation/auth/middlewares/jwtAuth';
import * as container from '@/dependencyInjection/container';

jest.mock('@/dependencyInjection/container', () => ({
  jwtService: {
    verifyToken: jest.fn(),
  },
}));

describe('jwtAuth', () => {
  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  const mockReq = (headers: any = {}) => ({ headers } as Request);
  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 when no Authorization header', () => {
    const res = mockRes();
    jwtAuth(mockReq(), res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token no proporcionado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when header does not start with Bearer ', () => {
    const res = mockRes();
    jwtAuth(mockReq({ authorization: 'Basic abc' }), res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token no proporcionado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when token is invalid', () => {
    (container.jwtService.verifyToken as jest.Mock).mockReturnValue(null);
    const res = mockRes();
    jwtAuth(mockReq({ authorization: 'Bearer badtoken' }), res, next);
    expect(container.jwtService.verifyToken).toHaveBeenCalledWith('badtoken');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido o expirado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should set req.user and call next when token is valid', () => {
    (container.jwtService.verifyToken as jest.Mock).mockReturnValue({ id: 'u1', email: 'a@b.com' });
    const req = mockReq({ authorization: 'Bearer validtoken' });
    const res = mockRes();
    jwtAuth(req, res, next);
    expect(container.jwtService.verifyToken).toHaveBeenCalledWith('validtoken');
    expect((req as any).user).toEqual({ id: 'u1', email: 'a@b.com' });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
