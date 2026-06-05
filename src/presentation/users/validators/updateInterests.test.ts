import updateInterestsSchema from './updateInterests';

describe('updateInterestsSchema', () => {
  it('should pass with valid interests array', () => {
    const result = updateInterestsSchema.safeParse({ interestsIds: ['int-1', 'int-2'] });
    expect(result.success).toBe(true);
  });

  it('should pass with empty array', () => {
    const result = updateInterestsSchema.safeParse({ interestsIds: [] });
    expect(result.success).toBe(true);
  });

  it('should fail when interestsIds is not an array', () => {
    const result = updateInterestsSchema.safeParse({ interestsIds: 'not-array' });
    expect(result.success).toBe(false);
  });
});
