import React from 'react';
import HeadingCity from './HeadingCity';
import HeadingDate from './HeadingDate';

class Heading extends React.Component {
  render() {
    const city = this.props.city;
    const dt = this.props.dt;

    return (
      <div className="heading heading-city-details">
        <HeadingCity city={city} />
        <HeadingDate dt={dt} />
      </div>
    );
  }
}

export default Heading;
