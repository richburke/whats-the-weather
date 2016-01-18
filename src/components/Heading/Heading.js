import React from 'react';
import HeadingCity from './HeadingCity';
import HeadingDate from './HeadingDate';

class Heading extends React.Component {
  render() {
    const city = this.props.city;
    const dt = this.props.dt;

    return (
      <div className="heading heading-city-details">
        <HeadingCity city={city}></HeadingCity>
        <HeadingDate dt={dt}></HeadingDate>
      </div>
    );
  }
}

export default Heading;
