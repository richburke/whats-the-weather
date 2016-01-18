import moment from 'moment';

const _def = {
  city: '',
  dt: '',
  sunrise: '',
  sunset: '',
  description: '',
  temperature: {
    value: '',
    units: ''
  },
  hiLo: {
    value: '',
    units: ''
  },
  humidity: {
    value: '',
    units: ''
  },
  pressure: {
    value: '',
    units: ''
  }
};

class DataFormatter {

  static getDefault() {
    return _def;
  }

  static format(data, units, state) {
    return {
      city: DataFormatter.formatCity(data, state),
      dt: DataFormatter.formatCityDate(data),
      sunrise: DataFormatter.formatSunrise(data),
      sunset: DataFormatter.formatSunset(data),
      description: DataFormatter.formatDescription(data),
      temperature: DataFormatter.formatCurrentTemperature(data, units),
      hiLo: DataFormatter.formatHiLoTemperature(data, units),
      humidity: DataFormatter.formatHumidity(data),
      pressure: DataFormatter.formatPressure(data, units)
    };
  }

  static formatCity(data, state) {
    if (!data.name && !state.location) {
      return '';
    }

    let city = data.name || state.location;

    if (data.sys && data.sys.country) {
      city = city + ', ' + data.sys.country;
    }

    return city;
  }

  static formatDescription(data) {
    if (!data.weather) {
      return '';
    }

    return data.weather.reduce((prev, curr, index) => {
      let description = curr.description;

      if (index === 0) {
        return description.charAt(0).toUpperCase() + description.slice(1);
      }

      if (index === data.length - 1) {
        return prev + ' and ' + description;
      }

      return prev + ', ' + description;
    }, '');
  }

  static formatCityDate(data) {
    if (!data.dt) {
      return '';
    }
    return DataFormatter._formatDate(data.dt);
  }

  static formatCurrentTemperature(data, units) {
    if (!data.main || !data.main.temp) {
      return {
        value: '',
        units: ''
      }
    }
    return DataFormatter._formatTemperature(data.main.temp, units);
  }

  static formatHiLoTemperature(data, units) {
    if (!data.main || !data.main.temp_max || !data.main.temp_min) {
      return {
        value: '',
        units: ''
      }
    }

    const hi = DataFormatter._formatTemperature(data.main.temp_max, units);
    const lo = DataFormatter._formatTemperature(data.main.temp_min, units);
    let temp = hi.value + '/' + lo.value;

    return {
      value: temp,
      units: hi.units
    }
  }

  static _formatTemperature(temp, units) {
    let type = units === 'imperial' ? 'F' : 'C';
    type += '\u00b0';

    return {
      value: String(Math.round(temp)),
      units: type
    };
  }

  static formatHumidity(data) {
    if (!data.main || !data.main.humidity) {
      return {
        value: '',
        units: ''
      }
    }

    return {
      value: String(data.main.humidity),
      units: '%'
    };
  }

  static formatPressure(data, units) {
    if (!data.main || !data.main.pressure) {
      return {
        value: '',
        units: ''
      }
    }

    let value, type;
    if (units === 'imperial') {
      value = (data.main.pressure * 0.0295301).toFixed(2);
      type = 'inHg';
    }
    else {
      value = data.main.pressure;
      type = 'mb';
    }

    return {
      value: String(value),
      units: type
    };
  }

  static formatSunrise(data) {
    if (!data.sys || !data.sys.sunrise) {
      return '';
    }
    return DataFormatter._formatDate(data.sys.sunrise, 'h:mm a');
  }

  static formatSunset(data) {
    if (!data.sys || !data.sys.sunset) {
      return '';
    }
    return DataFormatter._formatDate(data.sys.sunset, 'h:mm a');
  }

  static _formatDate(dt, format='LLL') {
    return moment.unix(Number(dt)).format(format);
  }
}

export default DataFormatter;
