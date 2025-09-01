import { ApiResult } from "./ApiResult.js";

export class ApiSuccess extends ApiResult {
  constructor(data) {
    super(data);
  }

  success() {
    return true;
  }

  error() {
    return null;
  }
}
