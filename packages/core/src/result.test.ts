import { describe, it, expect } from 'vitest';
import { ok, err, isOk, isErr } from '@atlas-delta/core/result';

describe('Result Type', () => {
  it('should return ok with value', () => {
    const result = ok(42);
    expect(isOk(result)).toBe(true);
    expect(isErr(result)).toBe(false);
    expect(result.value).toBe(42);
  });

  it('should return err with error', () => {
    const result = err(new Error('test error'));
    expect(isErr(result)).toBe(true);
    expect(isOk(result)).toBe(false);
    expect(result.error.message).toBe('test error');
  });

  it('should handle tryCatch async', async () => {
    const success = await Promise.resolve(42);
    const result = await import('@atlas-delta/core').then((m) => m.tryCatch(Promise.resolve(success)));
    expect(isOk(result)).toBe(true);
  });
});