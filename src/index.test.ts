import { describe, it, expect } from 'vitest';
import { ok, err, type Result } from './index';

describe('ok', () => {
  it('should create a success result with value and null', () => {
    const result = ok(42);
    expect(result).toEqual([42, null]);
  });

  it('should preserve the value type', () => {
    const result = ok('hello');
    expect(result).toEqual(['hello', null]);
  });

  it('should work with objects', () => {
    const obj = { name: 'test', count: 5 };
    const result = ok(obj);
    expect(result).toEqual([obj, null]);
  });

  it('should work with null/undefined values', () => {
    const result1 = ok(null);
    const result2 = ok(undefined);
    expect(result1).toEqual([null, null]);
    expect(result2).toEqual([undefined, null]);
  });
});

describe('err', () => {
  it('should create an error result with null and error', () => {
    const result = err('something went wrong');
    expect(result).toEqual([null, 'something went wrong']);
  });

  it('should work with Error objects', () => {
    const error = new Error('test error');
    const result = err(error);
    expect(result).toEqual([null, error]);
  });

  it('should work with custom error types', () => {
    const customError = { code: 404, message: 'Not found' };
    const result = err(customError);
    expect(result).toEqual([null, customError]);
  });
});

describe('Result type usage', () => {
  function divide(a: number, b: number): Result<number, string> {
    if (b === 0) {
      return err('division by zero');
    }
    return ok(a / b);
  }

  it('should handle successful division', () => {
    const [value, error] = divide(10, 2);
    expect(error).toBeNull();
    expect(value).toBe(5);
  });

  it('should handle division by zero error', () => {
    const [value, error] = divide(10, 0);
    expect(value).toBeNull();
    expect(error).toBe('division by zero');
  });

  it('should work with type guards', () => {
    const result = divide(10, 2);
    const [value, error] = result;

    if (error) {
      // Type should be narrowed to string here
      expect(typeof error).toBe('string');
    } else {
      // Type should be narrowed to number here
      expect(typeof value).toBe('number');
    }
  });
});

describe('TypeScript type inference', () => {
  it('should infer readonly tuple types', () => {
    const result = ok(42);
    // This should pass TypeScript compilation
    const _typeCheck: readonly [number, null] = result;
    expect(result).toEqual([42, null]);
  });

  it('should infer readonly tuple types for errors', () => {
    const result = err('error');
    // This should pass TypeScript compilation
    const _typeCheck: readonly [null, string] = result;
    expect(result).toEqual([null, 'error']);
  });

  it('should work with destructuring', () => {
    const [value, error] = ok(100);
    expect(value).toBe(100);
    expect(error).toBeNull();

    const [value2, error2] = err('failed');
    expect(value2).toBeNull();
    expect(error2).toBe('failed');
  });
});

describe('Real-world usage patterns', () => {
  interface User {
    id: number;
    name: string;
  }

  type UserError = 'not_found' | 'invalid_id';

  function getUser(id: number): Result<User, UserError> {
    if (id <= 0) {
      return err('invalid_id');
    }
    if (id === 999) {
      return err('not_found');
    }
    return ok({ id, name: `User ${id}` });
  }

  it('should handle successful user retrieval', () => {
    const [user, error] = getUser(1);
    expect(error).toBeNull();
    expect(user).toEqual({ id: 1, name: 'User 1' });
  });

  it('should handle invalid id error', () => {
    const [user, error] = getUser(-1);
    expect(user).toBeNull();
    expect(error).toBe('invalid_id');
  });

  it('should handle not found error', () => {
    const [user, error] = getUser(999);
    expect(user).toBeNull();
    expect(error).toBe('not_found');
  });

  it('should support early returns on error', () => {
    function processUser(id: number): string {
      const [user, error] = getUser(id);
      if (error) {
        return `Error: ${error}`;
      }
      return `Processing ${user.name}`;
    }

    expect(processUser(1)).toBe('Processing User 1');
    expect(processUser(-1)).toBe('Error: invalid_id');
    expect(processUser(999)).toBe('Error: not_found');
  });
});
