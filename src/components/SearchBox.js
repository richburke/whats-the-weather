import React from 'react';
import ReactRedux from 'react-redux';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';

const { connect } = ReactRedux;

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

/* --------------------------- */
/*    Redux action creators    */
/* --------------------------- */

let locations = [];

axios.get('locations.json')
  .then(function(data) {
    locations = data.data;
  });

const UPDATE_INPUT_VALUE = 'UPDATE_INPUT_VALUE';
const CLEAR_SUGGESTIONS = 'CLEAR_SUGGESTIONS';
const MAYBE_UPDATE_SUGGESTIONS = 'MAYBE_UPDATE_SUGGESTIONS';
const LOAD_SUGGESTIONS_BEGIN = 'LOAD_SUGGESTIONS_BEGIN';

function loadSuggestions(value) {
  return dispatch => {
    dispatch(loadSuggestionsBegin());
    dispatch(maybeUpdateSuggestions(getMatchingLocations(value), value));
  };
}

function updateInputValue(value) {
console.log('updating input value', value);

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



class SearchBoxUI extends React.Component {
  render() {
    const { value, suggestions, isLoading, onChange, onSuggestionsUpdateRequested } = this.props;
    const inputProps = {
      placeholder: "Enter your city",
      value,
      onChange
    };

    return (
        <div className="search input-group">
          <Autosuggest suggestions={suggestions}
                       onSuggestionsUpdateRequested={onSuggestionsUpdateRequested}
                       getSuggestionValue={getSuggestionValue}
                       renderSuggestion={renderSuggestion}
                       inputProps={inputProps} />

          <span className="fa fa-chevron-circle-right find"></span>
        </div>
    );
  }
}

const SearchBox = connect(mapStateToProps, mapDispatchToProps)(SearchBoxUI);
export default SearchBox;
