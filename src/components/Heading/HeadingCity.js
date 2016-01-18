import React from 'react';

class HeadingCity extends React.Component {
  render() {
    const city = this.props.city;

    return (
      <div className="heading-city">{city}</div>
    );
  }
}

HeadingCity.defaultProps = {
  city: ''
}

export default HeadingCity;
