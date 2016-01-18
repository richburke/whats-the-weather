import React from 'react';

class UnitChooser extends React.Component {
  constructor() {
    super();

    this.state = {
      options: [
        {
          value: 'metric',
          name: 'Metric',
          selected: false
        },
        {
          value: 'imperial',
          name: 'Imperial',
          selected: false
        }
      ]
    }
  }

  componentDidMount() {
    const {store} = this.context;
  }

  update(value) {
    let options = this.state.options.map(function(item) {
      return {
        value: item.value,
        name: item.name
      };
    });

    this.setState({
      options
    });

    const {store} = this.context;
    store.dispatch({
      type: 'UPDATE_UNITS',
      value
    })
  }

  render() {
    const props = this.props;
    const state = this.state;
    const {store} = this.context;
    const store_state = store.getState();

    let options = state.options.map((item, index) => {
      let value = item.value;
      let name = item.name;
      let selected = store_state.units === value;

      return (
        <label className={"btn btn-default " + (selected ? 'active' : '')}>
          <input type="radio" name="units" value="{value}" key={index} checked={selected} onChange={this.update.bind(this, value)} />{name}
        </label>
      );
    });

    return (
      <div className="btn-group units-group pull-right" data-toggle="buttons">
        {options}
     </div>
    );
  }
}

UnitChooser.contextTypes = {
  store: React.PropTypes.object
}

export default UnitChooser;
