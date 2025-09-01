import { ApiResult } from "./ApiResult";

export class ApiFailure extends ApiResult {
  constructor(error) {
    super(null);
    this._error = error;
  }

  success() {
    return false;
  }

  error() {
    return this._error;
  }
}
