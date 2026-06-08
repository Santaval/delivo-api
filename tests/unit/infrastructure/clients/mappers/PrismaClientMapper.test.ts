import { Client as PrismaClient, Prisma } from '@/infrastructure/prisma/generated/prisma/client';
import { ClientCreateArgs } from '@/infrastructure/prisma/generated/prisma/models';
import { PrismaClientMapper } from '@/infrastructure/clients/mappers/PrismaClientMapper';
import { Client } from '@/domain/clients/entities/Client';

describe('PrismaClientMapper', () => {
  const createDecimal = (value: string): Prisma.Decimal => new Prisma.Decimal(value);

  const mockPrismaRow: PrismaClient = {
    id: 'client-uuid-1',
    name: 'Test Client',
    phoneNumber: '1234567890',
    email: 'test@example.com',
    lat: createDecimal('41.387917'),
    lng: createDecimal('2.112892'),
    companyId: 'company-uuid-1',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
    deletedAt: null,
  };

  describe('toDomain', () => {
    it('maps all fields correctly from Prisma row to Client entity', () => {
      const client = PrismaClientMapper.toDomain(mockPrismaRow);

      expect(client).toBeInstanceOf(Client);
      expect(client.id.value).toBe(mockPrismaRow.id);
      expect(client.name).toBe(mockPrismaRow.name);
      expect(client.phoneNumber?.value).toBe(mockPrismaRow.phoneNumber);
      expect(client.email?.value).toBe(mockPrismaRow.email);
      expect(client.location.lat).toBeCloseTo(41.387917);
      expect(client.location.lng).toBeCloseTo(2.112892);
      expect(client.companyId.value).toBe(mockPrismaRow.companyId);
    });

    it('converts lat and lng via Number()', () => {
      const rowWithDecimals: PrismaClient = {
        ...mockPrismaRow,
        lat: createDecimal('41.387917'),
        lng: createDecimal('2.112892'),
      };

      const client = PrismaClientMapper.toDomain(rowWithDecimals);

      expect(typeof client.location.lat).toBe('number');
      expect(typeof client.location.lng).toBe('number');
      expect(client.location.lat).toBe(41.387917);
      expect(client.location.lng).toBe(2.112892);
    });

    it('handles null lat and lng', () => {
      const rowWithNullLocation: PrismaClient = {
        ...mockPrismaRow,
        lat: null,
        lng: null,
      };

      const client = PrismaClientMapper.toDomain(rowWithNullLocation);

      expect(client.location.lat).toBeNull();
      expect(client.location.lng).toBeNull();
    });

    it('treats empty email string as undefined', () => {
      const rowWithEmptyEmail: PrismaClient = {
        ...mockPrismaRow,
        email: '',
      };

      const client = PrismaClientMapper.toDomain(rowWithEmptyEmail);

      expect(client.email).toBeUndefined();
    });

    it('treats empty phoneNumber string as undefined', () => {
      const rowWithEmptyPhone: PrismaClient = {
        ...mockPrismaRow,
        phoneNumber: '',
      };

      const client = PrismaClientMapper.toDomain(rowWithEmptyPhone);

      expect(client.phoneNumber).toBeUndefined();
    });
  });

  describe('toPersistence', () => {
    it('extracts raw values from Client entity for persistence', () => {
      const domainClient = new Client({
        id: 'client-uuid-1',
        name: 'Test Client',
        phoneNumber: '1234567890',
        email: 'test@example.com',
        lat: 41.387917,
        lng: 2.112892,
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const result: ClientCreateArgs = PrismaClientMapper.toPersistence(domainClient);

      expect(result.data).toEqual({
        name: 'Test Client',
        phoneNumber: '1234567890',
        email: 'test@example.com',
        companyId: 'company-uuid-1',
        lat: 41.387917,
        lng: 2.112892,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('handles null lat and lng in location', () => {
      const domainClient = new Client({
        id: 'client-uuid-1',
        name: 'Test Client',
        lat: null,
        lng: null,
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const result: ClientCreateArgs = PrismaClientMapper.toPersistence(domainClient);

      expect(result.data.lat).toBeNull();
      expect(result.data.lng).toBeNull();
    });
  });
});
