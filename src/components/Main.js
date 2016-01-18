import React from 'react';
import ReactRedux from 'react-redux';
import SearchBox from './SearchBox';
import ContentContainer from './ContentContainer';

const { Provider } = ReactRedux;
let store = require('../model/model');

class Main extends React.Component {
  render() {
    return (
      <section>
        <div className="banner">
          <h1>
            <span className="title-leadin">What&#39;s the</span><br />
            <span className="title-weather">Weather?</span>
          </h1>
        </div>

        <Provider store={store}>
          <SearchBox />
        </Provider>

        <Provider store={store}>
          <ContentContainer />
        </Provider>

      </section>
    );
  }
}

export default Main;
