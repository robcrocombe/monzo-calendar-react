declare module '*.webp';
declare module '*.gif';

interface Dictionary<T> {
  [key: string]: T;
}

interface Storage {
  setObject(key: string, value: object): void;
  getObject<T extends object>(key: string): T;
}
