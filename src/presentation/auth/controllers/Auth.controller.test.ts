import { Request, Response } from 'express';
import AuthController from './Auth.controller';
import { IOAuthService } from '@/application/auth/services/interfaces/IOAuthService';
import IJwtService from '@/domain/auth/services/IJwtService';
import { IUserService } from '@/application/users/services/interfaces/IUserService';
import { User } from '@/domain/users/entities/User';

describe('AuthController', () => {
  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  const createUser = (): User =>
    new User({
      id: 'user-1',
      name: 'Juan',
      surnames: 'Pérez',
      email: 'juan@test.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      companies: [],
    });

  let oAuthService: jest.Mocked<IOAuthService>;
  let jwtService: jest.Mocked<IJwtService>;
  let userService: jest.Mocked<IUserService>;
  let controller: AuthController;

  beforeEach(() => {
    oAuthService = { google: jest.fn() } as any;
    jwtService = {
      generateToken: jest.fn().mockReturnValue('jwt-token'),
      verifyToken: jest.fn(),
    } as any;
    userService = { find: jest.fn(), update: jest.fn() } as any;
    controller = new AuthController(oAuthService, jwtService, userService);
  });

  describe('googleLogin', () => {
    it('should return auth response on success', async () => {
      oAuthService.google.mockResolvedValue(createUser());
      const req = { body: { token: 'google-token' } } as unknown as Request;
      const res = mockRes();
      await controller.googleLogin(req, res);
      expect(oAuthService.google).toHaveBeenCalledWith('google-token');
      expect(jwtService.generateToken).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'jwt-token' }));
    });

    it('should return 400 when token is missing', async () => {
      const req = { body: {} } as unknown as Request;
      const res = mockRes();
      await controller.googleLogin(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 401 on error', async () => {
      oAuthService.google.mockRejectedValue(new Error('fail'));
      const req = { body: { token: 'google-token' } } as unknown as Request;
      const res = mockRes();
      await controller.googleLogin(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('me', () => {
    it('should return user when token is valid', async () => {
      jwtService.verifyToken.mockReturnValue({ id: 'user-1', email: 'juan@test.com' });
      userService.find.mockResolvedValue(createUser());
      const req = { headers: { authorization: 'Bearer validtoken' } } as unknown as Request;
      const res = mockRes();
      await controller.me(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'user-1' }));
    });

    it('should return 401 when token is missing', async () => {
      const req = { headers: {} } as unknown as Request;
      const res = mockRes();
      await controller.me(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return 401 when token is invalid', async () => {
      jwtService.verifyToken.mockReturnValue(null);
      const req = { headers: { authorization: 'Bearer badtoken' } } as unknown as Request;
      const res = mockRes();
      await controller.me(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return 404 when user not found', async () => {
      jwtService.verifyToken.mockReturnValue({ id: 'user-1', email: 'juan@test.com' });
      userService.find.mockResolvedValue(null as any);
      const req = { headers: { authorization: 'Bearer token' } } as unknown as Request;
      const res = mockRes();
      await controller.me(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('refreshToken', () => {
    it('should return new token', async () => {
      jwtService.verifyToken.mockReturnValue({ id: 'user-1', email: 'juan@test.com' });
      const req = { headers: { authorization: 'Bearer oldtoken' } } as unknown as Request;
      const res = mockRes();
      await controller.refreshToken(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'jwt-token' }));
    });

    it('should return 401 when token is missing', async () => {
      const req = { headers: {} } as unknown as Request;
      const res = mockRes();
      await controller.refreshToken(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('logout', () => {
    it('should return success message', async () => {
      const req = {} as unknown as Request;
      const res = mockRes();
      await controller.logout(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('cerrada') }));
    });
  });
});
