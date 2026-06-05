describe('env config', () => {
  it('should be importable', async () => {
    const { default: ENV } = await import('./env');
    expect(ENV).toHaveProperty('NODE_ENV');
    expect(ENV).toHaveProperty('PORT');
    expect(ENV).toHaveProperty('DATABASE_URL');
    expect(ENV).toHaveProperty('JWT_SECRET');
  });
});
