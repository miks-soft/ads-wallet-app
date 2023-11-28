class DenominationFormatter {
  static format(amount: number | string) {
    const length = `${amount}`.length;

    if (length > 9) {
      return `${`${amount}`.slice(0, -9)}М`;
    }

    if (length > 6) {
      return `${`${amount}`.slice(0, -6)}м`;
    }

    if (length > 3) {
      return `${`${amount}`.slice(0, -3)}т`;
    }

    return amount;
  }
}

export default DenominationFormatter;
