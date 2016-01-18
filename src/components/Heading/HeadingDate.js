import React from 'react';

class HeadingDate extends React.Component {

  render() {
    const dt = this.props.dt;

    return (
      <div className="heading-date">{dt}</div>
    );
  }
}

HeadingDate.defaultProps = {
  dt: ''
}

export default HeadingDate;
