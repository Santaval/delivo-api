import { Request, Response } from 'express';
import MyProfileController from '@/presentation/users/controllers/MyProfile.controller';
import { IUserService } from '@/application/users/services/interfaces/IUserService';
import { User } from '@/domain/users/entities/User';

describe('MyProfileController', () => {
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

  let userService: jest.Mocked<IUserService>;
  let controller: MyProfileController;

  beforeEach(() => {
    userService = { find: jest.fn(), update: jest.fn() } as any;
    controller = new MyProfileController(userService);
  });

  describe('update', () => {
    it('should update and return user', async () => {
      userService.find.mockResolvedValue(createUser());
      const req = { user: { id: 'user-1' }, body: { name: 'Updated', surnames: 'García' } } as unknown as Request;
      const res = mockRes();
      await controller.update(req, res);
      expect(userService.update).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'user-1' }));
    });

    it('should return 404 when user not found', async () => {
      userService.find.mockResolvedValue(null as any);
      const req = { user: { id: 'user-1' }, body: {} } as unknown as Request;
      const res = mockRes();
      await controller.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('me', () => {
    it('should return current user', async () => {
      userService.find.mockResolvedValue(createUser());
      const req = { user: { id: 'user-1' } } as unknown as Request;
      const res = mockRes();
      await controller.me(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'user-1' }));
    });

    it('should return 404 when user not found', async () => {
      userService.find.mockResolvedValue(null as any);
      const req = { user: { id: 'user-1' } } as unknown as Request;
      const res = mockRes();
      await controller.me(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('logout', () => {
    it('should return success message', () => {
      const req = { logout: jest.fn((cb) => cb(null)) } as unknown as Request;
      const res = mockRes();
      controller.logout(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('Logged out') }));
    });

    it('should return 500 on logout error', () => {
      const req = { logout: jest.fn((cb) => cb(new Error('fail'))) } as unknown as Request;
      const res = mockRes();
      controller.logout(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
