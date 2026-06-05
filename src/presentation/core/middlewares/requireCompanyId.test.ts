import { Request, Response, NextFunction } from 'express';
import requireCompanyId from './requireCompanyId';

describe('requireCompanyId', () => {
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

  it('should return 400 when x-company-id header is missing', () => {
    const req = { headers: {} } as unknown as Request;
    const res = mockRes();
    requireCompanyId(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Company ID is required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next when x-company-id header is present', () => {
    const req = { headers: { 'x-company-id': 'comp-123' } } as unknown as Request;
    const res = mockRes();
    requireCompanyId(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
