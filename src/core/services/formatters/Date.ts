import moment from 'moment';

import { store } from '#store';

class DateFormatter {
  static humanize(date?: Date | string) {
    return moment(date).format(
      store.getState().app.region === 'RU' ? 'D MMM HH:mm' : 'D MMM hh:mm A',
    );
  }

  static humanizeDate(date?: Date | string) {
    return moment(date).format(
      store.getState().app.region === 'RU' ? 'DD MMM YY' : 'MMM DD YY',
    );
  }

  static formatDateWithDots(date?: Date | string) {
    return moment(date).format(
      store.getState().app.region === 'RU' ? 'DD.MM.YY' : 'MM.DD.YY',
    );
  }

  static trimDate(date: Date) {
    return moment(date).format('YYYY-MM-DD');
  }

  static trimDateWithoutTimezoneISO(date: Date) {
    return moment(date).utcOffset(0, true).format();
  }
}

export default DateFormatter;
