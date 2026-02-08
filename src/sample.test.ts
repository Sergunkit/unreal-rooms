import { describe, it, expect } from 'vitest';

describe('Sample Test', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true);
  });

  it('should perform addition', () => {
    const result = 1 + 1;
    expect(result).toBe(2);
  });

  it('should check string equality', () => {
    const text = 'Hello World';
    expect(text).toContain('World');
  });
});
