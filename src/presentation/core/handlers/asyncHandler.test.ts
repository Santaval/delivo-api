import { Request, Response, NextFunction } from 'express';
import asyncHandler from './asyncHandler';

describe('asyncHandler', () => {
  it('should call the async function and pass errors to next()', async () => {
    const err = new Error('async error');
    const fn = jest.fn().mockRejectedValue(err);
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    const wrapped = asyncHandler(fn);
    wrapped(req, res, next);

    await new Promise(process.nextTick);
    expect(fn).toHaveBeenCalledWith(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  it('should resolve without calling next on success', async () => {
    const fn = jest.fn().mockResolvedValue('ok');
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    const wrapped = asyncHandler(fn);
    wrapped(req, res, next);

    await new Promise(process.nextTick);
    expect(fn).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });
});
