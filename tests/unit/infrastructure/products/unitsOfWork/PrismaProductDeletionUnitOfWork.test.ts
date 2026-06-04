import { PrismaProductDeletionUnitOfWork } from '@/infrastructure/products/unitsOfWork/PrismaProductDeletionUnitOfWork';

jest.mock('@/infrastructure/prisma/client', () => ({
  prisma: {
    $transaction: jest.fn(),
  },
}));

describe('PrismaProductDeletionUnitOfWork', () => {
  let unitOfWork: PrismaProductDeletionUnitOfWork;

  beforeEach(() => {
    jest.clearAllMocks();
    unitOfWork = new PrismaProductDeletionUnitOfWork();
  });

  describe('runInTransaction', () => {
    it('executes work inside a transaction', async () => {
      const { prisma } = jest.requireMock('@/infrastructure/prisma/client');
      const mockTx = jest.fn();
      prisma.$transaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
        return callback(mockTx);
      });

      const mockResult = { id: 'result-1' };
      const work = jest.fn().mockResolvedValue(mockResult);

      const result = await unitOfWork.runInTransaction(work);

      expect(result).toBe(mockResult);
      expect(work).toHaveBeenCalled();
    });

    it('propagates errors from the work function', async () => {
      const { prisma } = jest.requireMock('@/infrastructure/prisma/client');
      const mockTx = jest.fn();
      prisma.$transaction.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
        return callback(mockTx);
      });

      const error = new Error('Work failed');
      const work = jest.fn().mockRejectedValue(error);

      await expect(unitOfWork.runInTransaction(work)).rejects.toThrow('Work failed');
    });
  });
});
