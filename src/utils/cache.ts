type CacheItem<T> = {
  data: T;
  expiry: number;
};

export class Cache {
  private static instance: Cache;
  private store: Map<string, CacheItem<any>>;
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.store = new Map();
  }

  static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.store.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.store.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }

    return item.data as T;
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  invalidatePattern(pattern: RegExp): void {
    for (const key of this.store.keys()) {
      if (pattern.test(key)) {
        this.store.delete(key);
      }
    }
  }
} 