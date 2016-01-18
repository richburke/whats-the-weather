import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/Main';

function App() {
  return (
    <Main />
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

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

    // function App() {
    //   return (
    //     <Main />
    //   );
    // }

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
