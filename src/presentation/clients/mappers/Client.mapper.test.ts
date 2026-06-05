import { Client } from '@/domain/clients/entities/Client';
import ClientDtoMapper from './Client.mapper';
import { CreateClientRequest } from '../requests/CreateClientRequest';
import { UpdateClientRequest } from '../requests/UpdateClientRequest';

describe('ClientDtoMapper', () => {
  const baseClientProps = {
    id: 'client-1',
    name: 'Juan Pérez',
    phoneNumber: '12345678',
    email: 'juan@test.com',
    companyId: 'comp-1',
    lat: 10.5,
    lng: -66.8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  };

  describe('fromCreateRequest', () => {
    it('should map CreateClientRequest to Client', () => {
      const request: CreateClientRequest = {
        name: 'New Client',
        phoneNumber: '87654321',
        email: 'new@test.com',
        lat: 5,
        lng: -70,
      };
      const client = ClientDtoMapper.fromCreateRequest(request, 'comp-1');
      expect(client).toBeInstanceOf(Client);
      expect(client.name).toBe('New Client');
      expect(client.companyId.value).toBe('comp-1');
    });
  });

  describe('fromUpdateRequest', () => {
    it('should merge request with existing client', () => {
      const existing = new Client(baseClientProps);
      const request: UpdateClientRequest = { id: 'client-1', name: 'Updated' };
      const updated = ClientDtoMapper.fromUpdateRequest(request, existing);
      expect(updated.name).toBe('Updated');
      expect(updated.phoneNumber?.value).toBe('12345678');
    });
  });

  describe('toResponse', () => {
    it('should map Client to ClientResponse', () => {
      const client = new Client(baseClientProps);
      const response = ClientDtoMapper.toResponse(client);
      expect(response.id).toBe('client-1');
      expect(response.name).toBe('Juan Pérez');
      expect(response.phoneNumber).toBe('12345678');
      expect(response.email).toBe('juan@test.com');
      expect(response.location.lat).toBe(10.5);
      expect(response.location.lng).toBe(-66.8);
    });
  });

  describe('toResponseArray', () => {
    it('should map array of Clients', () => {
      const clients = [new Client(baseClientProps)];
      const responses = ClientDtoMapper.toResponseArray(clients);
      expect(responses).toHaveLength(1);
      expect(responses[0].id).toBe('client-1');
    });
  });
});
