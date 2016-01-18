import {createStore, applyMiddleware}  from 'redux';
import DataFormatter from './DataFormatter';
import SearchUtils from './SearchUtils';
import Retriever from './Retriever';

const UPDATE_INPUT_VALUE = 'UPDATE_INPUT_VALUE';
const CLEAR_SUGGESTIONS = 'CLEAR_SUGGESTIONS';
const MAYBE_UPDATE_SUGGESTIONS = 'MAYBE_UPDATE_SUGGESTIONS';
const LOAD_SUGGESTIONS_BEGIN = 'LOAD_SUGGESTIONS_BEGIN';
const UPDATE_WEATHER_DATA = 'UPDATE_WEATHER_DATA';
const UPDATE_UNITS = 'UPDATE_UNITS';
const CLEAR_LOCATION = 'CLEAR_LOCATION';

const initialState = {
  value: '',
  suggestions: SearchUtils.getMatches(Retriever.getLocations(), ''),
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

function dispatchUpdateWeatherDataAction(metric, imperial) {
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
}

function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_INPUT_VALUE:
      if (SearchUtils.hasMatch(Retriever.getLocations(), action.value)) {
        Retriever.retrieveLocationData(action.value, dispatchUpdateWeatherDataAction);

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

function thunkMiddleware(_ref) {
  var dispatch = _ref.dispatch;
  var getState = _ref.getState;

  return function (next) {
    return function (action) {
      return typeof action === 'function' ? action(dispatch, getState) : next(action);
    };
  };
}

const store = applyMiddleware(thunkMiddleware)(createStore)(reducer);
module.exports = store;
