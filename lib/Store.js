'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _Object$create = require('babel-runtime/core-js/object/create')['default'];

var _Object$freeze = require('babel-runtime/core-js/object/freeze')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Actions = require('./Actions');

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _freezerJs = require('freezer-js');

var _freezerJs2 = _interopRequireDefault(_freezerJs);

var _mixinsConnect = require('./mixins/connect');

var _mixinsConnect2 = _interopRequireDefault(_mixinsConnect);

var Store = (function () {
  function Store() {
    var args = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Store);

    var actions = args.actions;
    var initial = args.initial;

    var init = typeof initial === 'function' ? initial() : initial;
    var store = new _freezerJs2['default'](init || {});

    this.connect = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (0, _mixinsConnect2['default'])(this, args.concat(args));
    };

    this.handlers = args.handlers || _utils2['default'].getWithoutFields(['actions'], args) || {};

    if (Array.isArray(actions)) {
      this.actions = actions = new _Actions.Actions(actions);
      this.actions.addStore(this);
    }

    var set = function set(item, value) {
      store.get().set(item, value);
    };

    var get = function get(item) {
      if (item) return store.get().toJS()[item];
      return store.get();
    };

    var reset = function reset() {
      this.set(init);
    };

    this.set = set;
    this.get = get;
    this.reset = reset;
    this.store = store;

    this.stateProto = { set: set, get: get, reset: reset, actions: actions };
    //this.getter = new Getter(this);
    return this;
  }

  _createClass(Store, [{
    key: 'addAction',
    value: function addAction(item) {
      if (Array.isArray(item)) {
        this.actions = this.actions.concat(this.actions);
      } else if (typeof item === 'object') {
        this.actions.push(item);
      }
    }
  }, {
    key: 'removeAction',
    value: function removeAction(item) {
      var action;
      if (typeof item === 'string') {
        action = this.findByName('actions', 'name', item);
        if (action) action.removeStore(this);
      } else if (typeof item === 'object') {
        action = item;
        var index = this.actions.indexOf(action);
        if (index !== -1) {
          action.removeStore(this);
          this.actions = this.actions.splice(index, 1);
        }
      }
    }
  }, {
    key: 'getActionCycle',
    value: function getActionCycle(actionName) {
      var prefix = arguments.length <= 1 || arguments[1] === undefined ? 'on' : arguments[1];

      var capitalized = _utils2['default'].capitalize(actionName);
      var fullActionName = '' + prefix + capitalized;
      var handler = this.handlers[fullActionName] || this.handlers[actionName];
      if (!handler) {
        throw new Error('No handlers for ' + actionName + ' action defined in current store');
      }

      var actions = undefined;
      if (typeof handler === 'object') {
        actions = handler;
      } else if (typeof handler === 'function') {
        actions = { on: handler };
      } else {
        throw new Error(handler + ' must be an object or function');
      }
      return actions;
    }

    // 1. will(initial) => willResult
    // 2. while(true)
    // 3. on(willResult || initial) => onResult
    // 4. while(false)
    // 5. did(onResult)
  }, {
    key: 'runCycle',
    value: function runCycle(actionName) {
      var _this = this;

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      // new Promise(resolve => resolve(true))
      var cycle = this.getActionCycle(actionName);
      var promise = _Promise.resolve();
      var will = cycle.will,
          while_ = cycle['while'],
          on_ = cycle.on;
      var did = cycle.did,
          didNot = cycle.didNot;

      // Local state for this cycle.
      var state = _Object$create(this.stateProto);

      // Pre-check & preparations.
      if (will) promise = promise.then(function () {
        return will.apply(state, args);
      });

      // Start while().
      if (while_) promise = promise.then(function (willResult) {
        while_.call(state, true);
        return willResult;
      });

      // Actual execution.
      promise = promise.then(function (willResult) {
        if (willResult == null) {
          return on_.apply(state, args);
        } else {
          return on_.call(state, willResult);
        }
      });

      // Stop while().
      if (while_) promise = promise.then(function (onResult) {
        while_.call(state, false);
        return onResult;
      });

      // For did and didNot state is freezed.
      promise = promise.then(function (onResult) {
        _Object$freeze(state);
        return onResult;
      });

      // Handle the result.
      if (did) promise = promise.then(function (onResult) {
        return did.call(state, onResult);
      });

      promise['catch'](function (error) {
        if (while_) while_.call(_this, state, false);
        if (didNot) {
          didNot.call(state, error);
        } else {
          throw error;
        }
      });

      return promise;
    }
  }]);

  return Store;
})();

exports['default'] = Store;
module.exports = exports['default'];