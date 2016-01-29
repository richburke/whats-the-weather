import React from 'react';

class DataPairValue extends React.Component {
  render() {
    let value = this.props.value;
    let prefix = this.props.prefix;
    let suffix = this.props.suffix;

    return (
      <div className="datapair-value col-sm-6">
        <span className="prefix">{prefix}</span>{value}<span className="suffix">{suffix}</span>
      </div>
    );
  }
}

DataPairValue.defaultProps = {
  value: '',
  prefix: '',
  suffix: ''
}
DataPairValue.propTypes = {
  value: React.PropTypes.string,
  prefix: React.PropTypes.string,
  suffix: React.PropTypes.string
}

export default DataPairValue;
