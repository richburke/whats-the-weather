import {createStore, applyMiddleware}  from 'redux';
import axios from 'axios';
import DataFormatter from './DataFormatter';


// const = Redux;

const UPDATE_INPUT_VALUE = 'UPDATE_INPUT_VALUE';
const CLEAR_SUGGESTIONS = 'CLEAR_SUGGESTIONS';
const MAYBE_UPDATE_SUGGESTIONS = 'MAYBE_UPDATE_SUGGESTIONS';
const LOAD_SUGGESTIONS_BEGIN = 'LOAD_SUGGESTIONS_BEGIN';
const UPDATE_WEATHER_DATA = 'UPDATE_WEATHER_DATA';
const UPDATE_UNITS = 'UPDATE_UNITS';
const CLEAR_LOCATION = 'CLEAR_LOCATION';

const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';
const API_KEY = 'f116aad972a652d9b306d7ba2c2e9345';

const initialState = {
  value: '',
  suggestions: getMatchingLocations(''),
  isLoading: false,
  location: '',
  haveData: false,
  units: 'metric',
  raw: {
    metric: {},
    imperial: {}
  },
  display: {
    metric: DataFormatter.getDefault(),
    imperial: DataFormatter.getDefault()
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
      const state = store.getState();

      store.dispatch({
        type: 'UPDATE_WEATHER_DATA',
        raw: {
          metric,
          imperial
        },
        display: {
          metric: DataFormatter.format(metric.data, 'metric', state),
          imperial: DataFormatter.format(imperial.data, 'imperial', state)
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
        raw: action.raw,
        display: action.display,
        haveData: true
      };

    case UPDATE_UNITS:
      return {
        ...state,
        units: action.value
      };

    case CLEAR_LOCATION:
      return {
        ...state,
        value: '',
        location: '',
        haveData: false,
        raw: {
          metric: {},
          imperial: {}
        },
        display: {
          metric: DataFormatter.getDefault(),
          imperial: DataFormatter.getDefault()
        }
      };

    default:
      return state;
  }
}

// const weather = store_state.weatherData;
// const units = store_state.units;
// const data = weather[units].data || {};
// const have_data = Object.keys(data).length > 0;
//
// let display_data = this.formatData(data);

const store = applyMiddleware(thunkMiddleware)(createStore)(reducer);
module.exports = store;
