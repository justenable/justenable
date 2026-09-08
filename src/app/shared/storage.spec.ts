import { blockStorage } from 'src/testing/storage';
import { readStorage, writeStorage } from './storage';

describe('storage', () => {
  const KEY = 'storage-spec';

  afterEach(() => {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
  });

  it('round-trips through localStorage and sessionStorage', () => {
    expect(readStorage('local', KEY)).toBeNull();
    expect(writeStorage('local', KEY, 'a')).toBeTrue();
    expect(readStorage('local', KEY)).toBe('a');
    expect(localStorage.getItem(KEY)).toBe('a');

    expect(writeStorage('session', KEY, 'b')).toBeTrue();
    expect(readStorage('session', KEY)).toBe('b');
    expect(sessionStorage.getItem(KEY)).toBe('b');
  });

  it('reads null and reports a failed write when the storage accessor throws', () => {
    const unblock = blockStorage('localStorage', 'sessionStorage');

    expect(readStorage('local', KEY)).toBeNull();
    expect(writeStorage('local', KEY, 'a')).toBeFalse();
    expect(readStorage('session', KEY)).toBeNull();
    expect(writeStorage('session', KEY, 'b')).toBeFalse();
    unblock();
  });
});
