import { createUser } from '@/tests/mocks/domain';
import { createCompany } from '@/tests/mocks/domain';

describe('User', () => {
  it('should create a user with valid properties', () => {
    const user = createUser();

    expect(user.id).toBe('user-1');
    expect(user.name).toBe('Test');
    expect(user.surnames).toBe('User');
    expect(user.email.value).toBe('test@example.com');
    expect(user.companies).toHaveLength(1);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('should create a user with custom properties', () => {
    const user = createUser({
      name: 'Jane',
      surnames: 'Doe',
      email: 'jane@example.com',
    });

    expect(user.name).toBe('Jane');
    expect(user.surnames).toBe('Doe');
    expect(user.email.value).toBe('jane@example.com');
  });

  it('should update id via setter', () => {
    const user = createUser();
    user.id = 'user-99';

    expect(user.id).toBe('user-99');
  });

  it('should create user with multiple companies', () => {
    const company1 = createCompany({ id: 'company-1', name: 'Company 1' });
    const company2 = createCompany({ id: 'company-2', name: 'Company 2' });

    const user = createUser({ companies: [company1, company2] });

    expect(user.companies).toHaveLength(2);
    expect(user.companies[0].name).toBe('Company 1');
    expect(user.companies[1].name).toBe('Company 2');
  });

  it('should throw when created with empty id', () => {
    expect(() => createUser({ id: '' })).toThrow();
  });

  it('should throw when created with invalid email', () => {
    expect(() => createUser({ email: 'not-an-email' })).toThrow();
  });

  it('should parse ISO date strings correctly', () => {
    const user = createUser({
      createdAt: '2023-06-15T10:30:00.000Z',
      updatedAt: '2023-06-15T10:30:00.000Z',
    });

    expect(user.createdAt).toEqual(new Date('2023-06-15T10:30:00.000Z'));
    expect(user.updatedAt).toEqual(new Date('2023-06-15T10:30:00.000Z'));
  });
});