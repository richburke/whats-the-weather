var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var IndexRoute = Router.IndexRoute;

var Main = require('../components/Main');
var Home = require('../components/Home');

module.exports = (
  <Route path="/" component={Home}>
    <IndexRoute component={Main} />
  </Route>
);
