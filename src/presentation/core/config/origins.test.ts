describe('origins config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return dev origins by default', async () => {
    delete process.env.ENV;
    const { default: origins } = await import('./origins');
    expect(origins).toContain('http://localhost:3000');
    expect(origins).toContain('http://localhost:5173');
  });

  it('should return dev origins for development', async () => {
    process.env.ENV = 'development';
    const { default: origins } = await import('./origins');
    expect(origins).toContain('http://localhost:3000');
  });

  it('should return prod origins for production', async () => {
    process.env.ENV = 'production';
    const { default: origins } = await import('./origins');
    expect(origins).toContain('https://connect.kambocolombia.com');
  });

  it('should return test origins for test env', async () => {
    process.env.ENV = 'test';
    const { default: origins } = await import('./origins');
    expect(origins).toContain('https://connect-beta.savaldev.com');
  });
});
