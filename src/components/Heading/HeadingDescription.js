import React from 'react';

class HeadingDescription extends React.Component {
  render() {
    let description = this.props.description;

    return (
      <div className="heading-description">
        {description}
      </div>
    );
  }
}

HeadingDescription.defaultProps = {
  description: ''
}

export default HeadingDescription;
