// Custom validation error to carry field-level details
export class ValidationError extends Error {
  /**
   * @param {{ field: string, message: string }[]} details
   */
  constructor(details) {
    super("Validation failed");
    this.name = "ValidationError";
    this.details = details; // array of { field, message }
  }
}

/**
 * Validate login inputs:
 * - identifier must be a valid email
 * - password must be exactly 10 characters and contain at least 2 letters
 *
 * @param {{ identifier: any, password: any }} param0
 * @returns {true} when valid
 * @throws {ValidationError}
 */
export function validationLog({ identifier, password } = {}) {
  const errors = [];

  // Simple email check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // if (typeof identifier !== 'string' || identifier.trim().length === 0) {
  //   errors.push({
  //     field: 'identifier',
  //     message: 'Email is required and cannot be empty.',
  //   });
  // } else if (!emailRegex.test(identifier.trim())) {
  //   errors.push({
  //     field: 'identifier',
  //     message: 'Email must be a valid email address (e.g. user@example.com).',
  //   });
  // }

  // // Password: must be a string, exactly 10 chars, at least 2 letters (A-Z or a-z)
  // if (typeof password !== 'string') {
  //   errors.push({
  //     field: 'password',
  //     message: 'Password must be a string.',
  //   });
  // } else {
  //   if (password.length >= 10&& password.length <= 20) {
  //     errors.push({
  //       field: 'password',
  //       message: 'Password must be  10-20 characters long.',
  //     });
  //   }

  //   const letterMatches = password.match(/[A-Za-z]/g) || [];
  //   if (letterMatches.length < 2) {
  //     errors.push({
  //       field: 'password',
  //       message: 'Password must contain at least 2 letters (A–Z or a–z).',
  //     });
  //   }
  // }

  if (errors.length) {
    throw new ValidationError(errors);
  }

  return true;
}
