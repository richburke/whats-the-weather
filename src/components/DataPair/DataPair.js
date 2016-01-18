import React from 'react';
import DataPairLabel from './DataPairLabel';
import DataPairValue from './DataPairValue';

class DataPair extends React.Component {
  render() {
    const label = this.props.label;
    const labelPrefix = this.props.labelPrefix;
    const labelSuffix = this.props.labelSuffix;
    const value = this.props.value;
    const valuePrefix = this.props.valuePrefix;
    const valueSuffix = this.props.valueSuffix;

    return (
      <div className="datapair col-md-12">
        <DataPairLabel label={label} prefix={labelPrefix} suffix={labelSuffix} />
        <DataPairValue value={value} prefix={valuePrefix} suffix={valueSuffix} />
      </div>
    );
  }
}

DataPair.defaultProps = {
  label: '',
  labelPrefix: '',
  labelSuffix: '',
  value: '',
  valuePrefix: '',
  valueSuffix: ''
}

export default DataPair;
