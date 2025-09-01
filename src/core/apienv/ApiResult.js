export class ApiResult {
  constructor(data) {
    if (new.target === ApiResult) {
      throw new Error("Cannot instantiate abstract class ApiResult directly");
    }
    this.data = data;
  }
  success() {
    throw new Error("Method 'success()' must be implemented");
  }

  error() {
    throw new Error("Method 'error()' must be implemented");
  }
}