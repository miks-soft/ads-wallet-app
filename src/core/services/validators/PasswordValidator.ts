class PasswordValidator {
  static validateLength(password: string) {
    return password.length > 6;
  }

  static validateContainsUppercaseChar(password: string) {
    return /[A-Z]/.test(password);
  }

  static validateContainsLowercaseChar(password: string) {
    return /[a-z]/.test(password);
  }

  static validateContainsNumber(password: string) {
    return /\d/.test(password);
  }

  static validateAll(password: string) {
    return {
      length: this.validateLength(password),
      uppercaseChar: this.validateContainsUppercaseChar(password),
      lowercaseChar: this.validateContainsLowercaseChar(password),
      number: this.validateContainsNumber(password),
    };
  }
}

export type PasswordValidationSchema = ReturnType<
  typeof PasswordValidator.validateAll
>;

export default PasswordValidator;
