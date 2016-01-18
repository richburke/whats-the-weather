let Redux = require('redux');
let axios = require('axios');
let moment = require('moment');

const { createStore, applyMiddleware } = Redux;


const UPDATE_INPUT_VALUE = 'UPDATE_INPUT_VALUE';
const CLEAR_SUGGESTIONS = 'CLEAR_SUGGESTIONS';
const MAYBE_UPDATE_SUGGESTIONS = 'MAYBE_UPDATE_SUGGESTIONS';
const LOAD_SUGGESTIONS_BEGIN = 'LOAD_SUGGESTIONS_BEGIN';
const UPDATE_WEATHER_DATA = 'UPDATE_WEATHER_DATA';
const UPDATE_UNITS = 'UPDATE_UNITS';

const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';
const API_KEY = 'f116aad972a652d9b306d7ba2c2e9345';

const initialState = {
  value: '',
  suggestions: getMatchingLocations(''),
  isLoading: false,
  location: '',
  units: 'metric',
  weatherData: {
    metric: {},
    imperial: {}
  }
};

let locations = [];

axios.get('locations.json')
  .then(function(data) {
    locations = data.data;
  });

function retrieveLocationData(loc) {
  axios.all([getMetric(loc), getImperial(loc)])
    .then(axios.spread(function(metric, imperial) {
      displayMetric(metric);
      displayImperial(imperial);

      store.dispatch({
        type: 'UPDATE_WEATHER_DATA',
        data: {
          metric,
          imperial
        }
      });
    }));
}

function getMetric(loc) {
  return axios.get(`${BASE_URL}?q=${loc}&units=metric&APPID=${API_KEY}`);
}

function getImperial(loc) {
  return axios.get(`${BASE_URL}?q=${loc}&units=imperial&APPID=${API_KEY}`);
}

function displayMetric(data) {
  console.log('METRIC', data);
  console.log('Current temperature: ' + data.data.main.temp + 'o^C');
  console.log('Today\s high: ' + data.data.main.temp_max + 'o^C');
  console.log('Today\s low: ' + data.data.main.temp_min + 'o^C');
  console.log('Humidity: ' + data.data.main.humidity + '%');
  console.log('Pressure: ' + data.data.main.pressure + ' (mb)');

  console.log(moment(data.dt).format('MMMM Do, YYYY h:mm a'));

  // console.log(data.data.sys.sunrise);
  // var dt = new Date(data.data.sys.sunrise);
  // console.log(dt.getHours());
  // console.log('Sunrise: ' + moment(Number(data.data.sys.sunrise)));
  // console.log('Sunrise: ' + moment(Number(data.data.sys.sunrise)).format('MMMM Do, YYYY h:mm a'));
  // console.log('Sunset: ' + moment(data.data.sys.sunset).format('MMMM Do, YYYY h:mm a'));
}

function displayImperial(data) {
  console.log('IMPERIAL');
  console.log('Current temperature: ' + data.data.main.temp + 'o^F');
  console.log('Today\s high: ' + data.data.main.temp_max + 'o^F');
  console.log('Today\s low: ' + data.data.main.temp_min + 'o^F');
  console.log('Humidity: ' + data.data.main.humidity + '%');
  console.log('Pressure: ' + data.data.main.pressure + ' (mb)');
}

function thunkMiddleware(_ref) {
  var dispatch = _ref.dispatch;
  var getState = _ref.getState;

  return function (next) {
    return function (action) {
      return typeof action === 'function' ? action(dispatch, getState) : next(action);
    };
  };
}

/**
 * @todo
 * DUPLICATED!!!
 */

 // https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
 function escapeRegexCharacters(str) {
   return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
 }

function getMatchingLocations(value) {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('^' + escapedValue, 'i');

  return locations.filter(loc => regex.test(loc.name));
}
/*****/

function hasLocationMatch(value) {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('^' + escapedValue, 'i');
  let matches = locations.filter(loc => regex.test(loc.name));

  return matches.length === 1 && escapeRegexCharacters(matches[0].name.trim().toLowerCase()) === escapedValue.toLowerCase();
}

function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_INPUT_VALUE:
      if (hasLocationMatch(action.value)) {
        retrieveLocationData(action.value);

        return {
          ...state,
          value: action.value,
          location: action.value
        };
      }

      return {
        ...state,
        value: action.value
      };

    case CLEAR_SUGGESTIONS:
      return {
        ...state,
        suggestions: []
      };

    case LOAD_SUGGESTIONS_BEGIN:
      return {
        ...state,
        isLoading: true
      };

    case MAYBE_UPDATE_SUGGESTIONS:
      // Ignore suggestions if input value changed
      if (action.value !== state.value) {
        return {
          ...state,
          isLoading: false
        };
      }

      return {
        ...state,
        suggestions: action.suggestions,
        isLoading: false
      };

    case UPDATE_WEATHER_DATA:
      return {
        ...state,
        weatherData: action.data
      };

    case UPDATE_UNITS:
      return {
        ...state,
        units: action.value
      };

    default:
      return state;
  }
}

const store = applyMiddleware(thunkMiddleware)(createStore)(reducer);
module.exports = store;
