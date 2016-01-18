
import axios from 'axios';
const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';
const API_KEY = 'f116aad972a652d9b306d7ba2c2e9345';
const LOCATIONS = 'locations.json';

let _locations = [];
axios.get(LOCATIONS)
  .then((data) => {
    _locations = data.data;
  });

class Retriever {

  static getLocations() {
    return _locations;
  }

  static retrieveLocationData(loc, fnc) {
    axios.all([Retriever._getMetric(loc), Retriever._getImperial(loc)])
      .then(axios.spread((metric, imperial) => {
        fnc(metric, imperial);
      }));
  }

  static _getMetric(loc) {
    return axios.get(`${BASE_URL}?q=${loc}&units=metric&APPID=${API_KEY}`);
  }

  static _getImperial(loc) {
    return axios.get(`${BASE_URL}?q=${loc}&units=imperial&APPID=${API_KEY}`);
  }
}

export default Retriever;
