import { Client } from '@/domain/clients/entities/Client';
import { ClientConstructorProps } from '@/domain/clients/entities/Client';

export const createClient = (overrides: Partial<ClientConstructorProps> = {}): Client => {
  const props: ClientConstructorProps = {
    id: 'client-1',
    name: 'Test Client',
    companyId: 'company-1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    lat: 40.7128,
    lng: -74.006,
    ...overrides,
  };
  return new Client(props);
};