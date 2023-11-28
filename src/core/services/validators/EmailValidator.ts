class EmailValidator {
  static validate(email: string) {
    return !/.*@.*/.test(email);
  }
}

export default EmailValidator;
