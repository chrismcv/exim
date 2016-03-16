'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Actions = require('./Actions');

var _Store = require('./Store');

var _Store2 = _interopRequireDefault(_Store);

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _DOMHelpers = require('./DOMHelpers');

var Exim = { Action: _Actions.Action, Actions: _Actions.Actions, Store: _Store2['default'], Router: _DOMHelpers.Router, DOM: _DOMHelpers.DOM, helpers: _helpers2['default'], createView: _DOMHelpers.createView };

Exim.createAction = function (args) {
  return new _Actions.Action(args);
};

Exim.createActions = function (args) {
  return new _Actions.Actions(args);
};

Exim.createStore = function (args) {
  return new _Store2['default'](args);
};

exports['default'] = Exim;
module.exports = exports['default'];