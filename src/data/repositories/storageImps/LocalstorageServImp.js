import { CacheService } from "@domain/interfaces/storageAccess/CacheService";

export default class LocalStorageServImp extends CacheService {
  setItem(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
    return;
  }
  getItem(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
  removeItem(key) {
    localStorage.removeItem(key);
    return;
  }
}
