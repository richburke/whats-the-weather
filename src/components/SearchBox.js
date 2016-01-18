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

  componentDidMount() {
    const {store} = this.context;
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  clear() {
    const {store} = this.context;
    store.dispatch({
      type: 'CLEAR_LOCATION'
    });
  }

  render() {
    const props = this.props;
    const { value, suggestions, isLoading, onChange, onSuggestionsUpdateRequested } = props;
    const inputProps = {
      placeholder: "Enter your city",
      value,
      onChange
    };

    const {store} = this.context;
    const store_state = store.getState();
    const have_data = store_state.haveData;

    return (
        <div className="search input-group">
          <Autosuggest suggestions={suggestions}
                       onSuggestionsUpdateRequested={onSuggestionsUpdateRequested}
                       getSuggestionValue={getSuggestionValue}
                       renderSuggestion={renderSuggestion}
                       inputProps={inputProps} />

          <span
            className={"fa fa-times-circle clear " + (have_data ? 'show' : '')}
            onClick={this.clear.bind(this)}></span>
        </div>
    );
  }
}

SearchBoxUI.contextTypes = {
  store: React.PropTypes.object
};

const SearchBox = connect(mapStateToProps, mapDispatchToProps)(SearchBoxUI);
export default SearchBox;
