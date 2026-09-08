export type StorageKind = 'local' | 'session';

// The property access itself is what throws when a browser blocks Web
// Storage (Safari "Block all cookies", storage-partitioned iframes), so it
// has to sit inside the try as well, not just getItem/setItem.
function storage(kind: StorageKind): Storage {
  return kind === 'local' ? window.localStorage : window.sessionStorage;
}

/** null when the browser blocks Web Storage or nothing is stored. */
export function readStorage(kind: StorageKind, key: string): string | null {
  try {
    return storage(kind).getItem(key);
  } catch {
    return null;
  }
}

/** false when the write is refused (blocked storage, quota), so callers can decide whether to rely on it. */
export function writeStorage(kind: StorageKind, key: string, value: string): boolean {
  try {
    storage(kind).setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
