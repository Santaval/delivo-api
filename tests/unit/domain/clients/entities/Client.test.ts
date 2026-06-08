import { createClient } from '@/tests/mocks/domain';

describe('Client', () => {
  it('should create a client with valid properties', () => {
    const client = createClient();

    expect(client.id.value).toBe('client-1');
    expect(client.name).toBe('Test Client');
    expect(client.companyId.value).toBe('company-1');
    expect(client.createdAt).toBeInstanceOf(Date);
    expect(client.updatedAt).toBeInstanceOf(Date);
    expect(client.location.lat).toBe(40.7128);
    expect(client.location.lng).toBe(-74.006);
  });

  it('should create a client with phone number', () => {
    const client = createClient({ phoneNumber: '+1234567890' });

    expect(client.phoneNumber).toBeDefined();
    expect(client.phoneNumber?.value).toBe('+1234567890');
  });

  it('should create a client without phone number', () => {
    const client = createClient({ phoneNumber: undefined });

    expect(client.phoneNumber).toBeUndefined();
  });

  it('should create a client with email', () => {
    const client = createClient({ email: 'client@example.com' });

    expect(client.email).toBeDefined();
    expect(client.email?.value).toBe('client@example.com');
  });

  it('should create a client without email', () => {
    const client = createClient({ email: undefined });

    expect(client.email).toBeUndefined();
  });

  it('should create a client with custom location', () => {
    const client = createClient({ lat: 51.5074, lng: -0.1278 });

    expect(client.location.lat).toBe(51.5074);
    expect(client.location.lng).toBe(-0.1278);
  });

  it('should create a client with null location', () => {
    const client = createClient({ lat: null, lng: null });

    expect(client.location.lat).toBeNull();
    expect(client.location.lng).toBeNull();
  });

  it('should parse ISO date strings correctly', () => {
    const client = createClient({
      createdAt: '2023-06-15T10:30:00.000Z',
      updatedAt: '2023-06-15T10:30:00.000Z',
    });

    expect(client.createdAt).toEqual(new Date('2023-06-15T10:30:00.000Z'));
    expect(client.updatedAt).toEqual(new Date('2023-06-15T10:30:00.000Z'));
  });

  it('should throw when created with empty id', () => {
    expect(() => createClient({ id: '' })).toThrow();
  });

  it('should throw when created with empty companyId', () => {
    expect(() => createClient({ companyId: '' })).toThrow();
  });

  it('should throw when created with invalid email', () => {
    expect(() => createClient({ email: 'not-an-email' })).toThrow();
  });
});