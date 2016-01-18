import React from 'react';

class DataPairLabel extends React.Component {
  render() {
    let label = this.props.label;
    let prefix = this.props.prefix;
    let suffix = this.props.suffix;

    return (
      <div className="datapair-label col-md-5">
        <label>
          <span className="prefix">{prefix}</span>{label}<span className="suffix">{suffix}</span>
        </label>
      </div>
    );
  }
}

DataPairLabel.defaultProps = {
  label: '',
  prefix: '',
  suffix: ''
}
DataPairLabel.propTypes = {
  label: React.PropTypes.string,
  prefix: React.PropTypes.string,
  suffix: React.PropTypes.string
}

export default DataPairLabel;
