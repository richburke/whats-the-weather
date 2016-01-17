'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var routes = require('./config/routes');
let Redux = require('redux');
let ReactRedux = require('react-redux');

var axios = require('axios');
var moment = require('moment');

let Autosuggest = require('react-autosuggest');

// ReactDOM.render(
//   <Router>{routes}</Router>,
//   document.getElementById('root')
// );

const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';
const API_KEY = 'f116aad972a652d9b306d7ba2c2e9345';
let city = 'New York'


function getMetric() {
  return axios.get(`${BASE_URL}?q=${city}&units=metric&APPID=${API_KEY}`);
}

function getImperial() {
  return axios.get(`${BASE_URL}?q=${city}&units=imperial&APPID=${API_KEY}`);
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

// axios.all([getMetric(), getImperial()])
//   .then(axios.spread(function(metric, imperial) {
//     displayMetric(metric);
//     displayImperial(imperial);
//   }));

/*
Show units in metric/imperial

*
obj.data.main.
humidity
pressure
temp
temp_max
temp_min

iterate through weather
and combine descriptions
 */
  /*
Humidity: x%
Barometric Pressure: x
  */

  let locations = [];

  axios.get('locations.json')
    .then(function(data) {
      locations = data.data;
    });

    function thunkMiddleware(_ref) {
      var dispatch = _ref.dispatch;
      var getState = _ref.getState;

      return function (next) {
        return function (action) {
          return typeof action === 'function' ? action(dispatch, getState) : next(action);
        };
      };
    }

    const { createStore, applyMiddleware } = Redux;
    const { Provider, connect } = ReactRedux;


    function getMatchingLocations(value) {
      const escapedValue = escapeRegexCharacters(value.trim());

      if (escapedValue === '') {
        return [];
      }

      const regex = new RegExp('^' + escapedValue, 'i');

      return locations.filter(loc => regex.test(loc.name));
    }

    /* ----------- */
    /*    Utils    */
    /* ----------- */

    // https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
    function escapeRegexCharacters(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function randomDelay() {
      return 300 + Math.random() * 1000;
    }

    /* --------------------------- */
    /*    Redux action creators    */
    /* --------------------------- */

    const UPDATE_INPUT_VALUE = 'UPDATE_INPUT_VALUE';
    const CLEAR_SUGGESTIONS = 'CLEAR_SUGGESTIONS';
    const MAYBE_UPDATE_SUGGESTIONS = 'MAYBE_UPDATE_SUGGESTIONS';
    const LOAD_SUGGESTIONS_BEGIN = 'LOAD_SUGGESTIONS_BEGIN';

    function loadSuggestions(value) {
      return dispatch => {
        dispatch(loadSuggestionsBegin());

        // Fake an AJAX call
        setTimeout(() => {
          dispatch(maybeUpdateSuggestions(getMatchingLocations(value), value));
        }, randomDelay());
      };
    }

    function updateInputValue(value) {
      return {
        type: UPDATE_INPUT_VALUE,
        value
      };
    }

    function clearSuggestions() {
      return {
        type: CLEAR_SUGGESTIONS
      };
    }

    function loadSuggestionsBegin() {
      return {
        type: LOAD_SUGGESTIONS_BEGIN
      };
    }

    function maybeUpdateSuggestions(suggestions, value) {
      return {
        type: MAYBE_UPDATE_SUGGESTIONS,
        suggestions,
        value
      };
    }

    /* ------------------- */
    /*    Redux reducer    */
    /* ------------------- */

    const initialState = {
      value: '',
      suggestions: getMatchingLocations(''),
      isLoading: false
    };

    function reducer(state = initialState, action = {}) {
      switch (action.type) {
        case UPDATE_INPUT_VALUE:
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

        default:
          return state;
      }
    }

    /* ----------------- */
    /*    MyComponent    */
    /* ----------------- */

    function getSuggestionValue(suggestion) {
      return suggestion.name;
    }

    function renderSuggestion(suggestion) {
      return (
        <span>{suggestion.name}</span>
      );
    }

    function mapStateToProps(state) {
      const { value, suggestions, isLoading } = state;

      return {
        value,
        suggestions,
        isLoading
      };
    }

    function mapDispatchToProps(dispatch) {
      return {
        onChange(event, { newValue }) {
          dispatch(updateInputValue(newValue));

          const value = newValue.trim();

          if (value === '') {
            dispatch(clearSuggestions());
          }
        },
        onSuggestionsUpdateRequested({ value }) {
          dispatch(loadSuggestions(value));
        }
      };
    }

    class MyComponent extends React.Component {
      render() {
        const { value, suggestions, isLoading, onChange, onSuggestionsUpdateRequested } = this.props;
        const inputProps = {
          placeholder: "Enter your city",
          value,
          onChange
        };
        const status = (isLoading ? 'Loading...' : 'Type to load suggestions');

        return (
          <div className="app-container">
            <Autosuggest suggestions={suggestions}
                         onSuggestionsUpdateRequested={onSuggestionsUpdateRequested}
                         getSuggestionValue={getSuggestionValue}
                         renderSuggestion={renderSuggestion}
                         inputProps={inputProps} />
            <div className="status">
              <strong>Status:</strong> {status}
            </div>
          </div>
        );
      }
    }

    const store = applyMiddleware(thunkMiddleware)(createStore)(reducer);

    const MyConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(MyComponent);

    function App() {
      return (
        <Provider store={store}>
          <MyConnectedComponent />
        </Provider>
      );
    }

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
// function escapeRegexCharacters(str) {
//   return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// }
//
// function getSuggestions(value) {
//   const escapedValue = escapeRegexCharacters(value.trim());
//
//   if (escapedValue === '') {
//     return [];
//   }
//
//   const regex = new RegExp('^' + escapedValue, 'i');
//
//   return locations.filter(loc => regex.test(loc.name));
// }
//
// function getSuggestionValue(suggestion) {
//   return suggestion.name;
// }
//
// function renderSuggestion(suggestion) {
//   return (
//     <span>{suggestion.name}</span>
//   );
// }
//
// class App extends React.Component {
//   constructor() {
//     super();
//
//     this.state = {
//       value: '',
//       suggestions: getSuggestions('')
//     };
//
//     this.onChange = this.onChange.bind(this);
//     this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
//   }
//
//   onChange(event, { newValue, method }) {
//     this.setState({
//       value: newValue
//     });
//   }
//
//   onSuggestionsUpdateRequested({ value }) {
//     this.setState({
//       suggestions: getSuggestions(value)
//     });
//   }
//
//   render() {
//     const { value, suggestions } = this.state;
//     const inputProps = {
//       placeholder: "Enter a city",
//       value,
//       onChange: this.onChange
//     };
//
//     return (
//       <Autosuggest suggestions={suggestions}
//                    onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
//                    getSuggestionValue={getSuggestionValue}
//                    renderSuggestion={renderSuggestion}
//                    inputProps={inputProps} />
//     );
//   }
// }

// ReactDOM.render(<App />, document.getElementById('root'));
