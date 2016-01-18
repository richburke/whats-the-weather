import React from 'react';
import moment from 'moment';

import Heading from './Heading/Heading';
import HeadingDescription from './Heading/HeadingDescription';
import UnitChooser from './UnitChooser';
import DataPair from './DataPair/DataPair';


class ContentContainer extends React.Component {

  componentDidMount() {
    const {store} = this.context;
    this.unsubscribe = store.subscribe(() => this.forceUpdate());

    console.log('STORE', 'ContentContainer', store);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  formatData(data) {
    return {
      city: this.formatCity(data),
      dt: this.formatCityDate(data),
      description: this.formatDescription(data),
      temperature: this.formatCurrentTemperature(data),
      hiLo: this.formatHiLoTemperature(data),
      humidity: this.formatHumidity(data),
      pressure: this.formatPressure(data),
      sunrise: this.formatSunrise(data),
      sunset: this.formatSunset(data)
    };

    return display;
  }

  formatCity(data) {
    const {store} = this.context;
    const store_state = store.getState();

    if (!data.name && !store_state.location) {
      return this.props.city;
    }

    let city = data.name || store_state.location;

    if (data.sys && data.sys.country) {
      city = city + ', ' + data.sys.country;
    }

    return city;
  }

  formatDescription(data) {
    if (!data.weather) {
      return this.props.description;
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

  formatCityDate(data) {
    if (!data.dt) {
      return this.props.dt;
    }
    return this.formatDate(data.dt);
  }

  formatCurrentTemperature(data) {
    if (!data.main || !data.main.temp) {
      return {
        value: this.props.temperature,
        units: ''
      }
    }
    return this.formatTemperature(data.main.temp);
  }

  formatHiLoTemperature(data) {
    if (!data.main || !data.main.temp_max || !data.main.temp_min) {
      return {
        value: this.props.hiLo,
        units: ''
      }
    }

    const hi = this.formatTemperature(data.main.temp_max);
    const lo = this.formatTemperature(data.main.temp_min);
    let temp = hi.value + '/' + lo.value;

    return {
      value: temp,
      units: hi.units
    }
  }

  formatTemperature(temp) {
    const {store} = this.context;
    const store_state = store.getState();

    let units = store_state.units === 'imperial' ? 'F' : 'C';
    units += '\u00b0';

    return {
      value: String(Math.round(temp)),
      units
    };
  }

  formatHumidity(data) {
    if (!data.main || !data.main.humidity) {
      return {
        value: this.props.humidity,
        units: ''
      }
    }

    return {
      value: String(data.main.humidity),
      units: '%'
    };
  }

  formatPressure(data) {
    if (!data.main || !data.main.pressure) {
      return {
        value: this.props.pressure,
        units: ''
      }
    }

    const {store} = this.context;
    const store_state = store.getState();

    let value, units;
    if (store_state.units === 'imperial') {
      value = (data.main.pressure * 0.0295301).toFixed(2);
      units = 'inHg';
    }
    else {
      value = data.main.pressure;
      units = 'mb';
    }

    return {
      value: String(value),
      units
    };
  }

  formatSunrise(data) {
    if (!data.sys || !data.sys.sunrise) {
      return this.props.sunrise;
    }
    return this.formatDate(data.sys.sunrise, 'h:mm a');
  }

  formatSunset(data) {
    if (!data.sys || !data.sys.sunset) {
      return this.props.sunset;
    }
    return this.formatDate(data.sys.sunset, 'h:mm a');
  }

  formatDate(dt, format='LLL') {
    return moment.unix(Number(dt)).format(format);
  }

  render() {
    const props = this.props;
    const {store} = this.context;
    const store_state = store.getState();
    const weather = store_state.weatherData;
    const units = store_state.units;
    const data = weather[units].data || {};
    const have_data = Object.keys(data).length > 0;

    let display_data = this.formatData(data);

    console.log('RENDERING', 'ContentContainer', data, have_data, store_state);
    console.log('RENDERING', 'ContentContainer', display_data);


    return (
      <div className="location-details">
        <div className="location-details-content">

          <div className="row">
            <div className="col-md-12">
              <Heading city={display_data.city} dt={display_data.dt}></Heading>
            </div>
          </div>

          <div className="row row-description">
            <div className="col-md-7">
              <HeadingDescription description={display_data.description}></HeadingDescription>
            </div>

            <div className="col-md-5">
              <UnitChooser></UnitChooser>
           </div>
          </div>

          <div className="row details-temperature">
            <div className="col-md-7">
              <DataPair
                label="Temp"
                value={display_data.temperature.value}
                valueSuffix={' ' + display_data.temperature.units}
              />
            </div>
            <div className="col-md-5">
              <DataPair
                label="Hi/Lo"
                value={display_data.hiLo.value}
                valueSuffix={' ' + display_data.hiLo.units}
              />
            </div>
          </div>

          <div className="row details-atmosphere">
            <div className="col-md-7">
              <DataPair
                label="Humidity"
                value={display_data.humidity.value}
                valueSuffix={display_data.humidity.units}
              />
            </div>
            <div className="col-md-5">
              <DataPair
                label="Pressure"
                value={display_data.pressure.value}
                valueSuffix={' ' + display_data.pressure.units}
              />
            </div>
          </div>

          <div className="row details-sun">
            <div className="col-md-7">
              <DataPair label="Sunrise" value={display_data.sunrise}></DataPair>
            </div>
            <div className="col-md-5">
              <DataPair label="Sunset" value={display_data.sunset}></DataPair>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

ContentContainer.defaultProps = {
  city: '',
  dt: '',
  description: '',
  temperature: '',
  hiLo: '',
  humidity: '',
  pressure: '',
  sunrise: '',
  sunset: ''
};
ContentContainer.contextTypes = {
  store: React.PropTypes.object
};

export default ContentContainer;
