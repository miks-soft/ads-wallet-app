import { CurrencyMap } from '#config/enums';

class NumberFormatter {
  static format(amount: string | number) {
    return Math.trunc(+amount)
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  static formatFloat(amount: string | number) {
    return `${+(+amount).toFixed(2)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  static formatByCurrency(amount: string | number, currency: CurrencyMap) {
    if (currency === CurrencyMap.RUB || currency === CurrencyMap['₽']) {
      return this.format(amount || '0');
    }

    return this.formatFloat(amount || '0');
  }
}

export default NumberFormatter;
