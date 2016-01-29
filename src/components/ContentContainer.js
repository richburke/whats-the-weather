import React from 'react';
import Heading from './Heading/Heading';
import HeadingDescription from './Heading/HeadingDescription';
import UnitChooser from './UnitChooser';
import DataPair from './DataPair/DataPair';


class ContentContainer extends React.Component {

  componentDidMount() {
    const {store} = this.context;
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const {store} = this.context;
    const store_state = store.getState();
    const units = store_state.units;
    const formatted_data = store_state.display[units];
    const have_data = store_state.haveData;

    return (
      <div className={"location-details " + (have_data ? 'show' : '')}>
        <div className="location-details-content">

          <div className="row">
            <div className="col-sm-12">
              <Heading city={formatted_data.city} dt={formatted_data.dt} />
            </div>
          </div>

          <div className="row row-description">
            <div className="col-sm-6">
              <HeadingDescription description={formatted_data.description} />
            </div>

            <div className="col-sm-6">
              <UnitChooser />
           </div>
          </div>

          <div className="row details-temperature">
            <div className="col-sm-6">
              <DataPair
                label="Temp"
                value={formatted_data.temperature.value}
                valueSuffix={' ' + formatted_data.temperature.units}
              />
            </div>
            <div className="col-sm-6">
              <DataPair
                label="Hi/Lo"
                value={formatted_data.hiLo.value}
                valueSuffix={' ' + formatted_data.hiLo.units}
              />
            </div>
          </div>

          <div className="row details-atmosphere">
            <div className="col-sm-6">
              <DataPair
                label="Humidity"
                value={formatted_data.humidity.value}
                valueSuffix={formatted_data.humidity.units}
              />
            </div>
            <div className="col-sm-6">
              <DataPair
                label="Pressure"
                value={formatted_data.pressure.value}
                valueSuffix={' ' + formatted_data.pressure.units}
              />
            </div>
          </div>

          <div className="row details-sun">
            <div className="col-sm-6">
              <DataPair
                label="Sunrise"
                value={formatted_data.sunrise}
              />
            </div>
            <div className="col-sm-6">
              <DataPair
                label="Sunset"
                value={formatted_data.sunset}
              />
            </div>
          </div>

        </div>
      </div>
    );
  }
}

ContentContainer.contextTypes = {
  store: React.PropTypes.object
};

export default ContentContainer;
