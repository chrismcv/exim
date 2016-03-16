'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var Action = (function () {
  function Action(args) {
    _classCallCheck(this, Action);

    var store = args.store;
    var stores = args.stores;
    var allStores = [];

    this.name = args.name;

    if (store) allStores.push(store);
    if (stores) allStores.push.apply(allStores, stores);

    this.stores = allStores;
  }

  _createClass(Action, [{
    key: 'run',
    value: function run() {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var storesCycles = this.stores.map(function (store) {
        return store.runCycle.apply(store, [_this.name].concat(args));
      });
      return _Promise.all(storesCycles);
    }
  }, {
    key: 'addStore',
    value: function addStore(store) {
      this.stores.push(store);
    }
  }]);

  return Action;
})();

exports.Action = Action;

var Actions = (function () {
  function Actions(actions) {
    var _this2 = this;

    _classCallCheck(this, Actions);

    this.all = [];
    if (Array.isArray(actions)) {
      actions.forEach(function (action) {
        return _this2.addAction(action);
      }, this);
    }
  }

  _createClass(Actions, [{
    key: 'addAction',
    value: function addAction(item, noOverride) {
      var action = noOverride ? false : this.detectAction(item);
      if (!noOverride) {
        var old = this[action.name];
        if (old) this.removeAction(old);
        this.all.push(action);
        this[action.name] = action.run.bind(action);
      }

      return action;
    }
  }, {
    key: 'removeAction',
    value: function removeAction(item) {
      var action = this.detectAction(item, true);
      var index = this.all.indexOf(action);
      if (index !== -1) this.all.splice(index, 1);
      delete this[action.name];
    }
  }, {
    key: 'addStore',
    value: function addStore(store) {
      this.all.forEach(function (action) {
        return action.addStore(store);
      });
    }
  }, {
    key: 'detectAction',
    value: function detectAction(action, isOld) {
      if (action.constructor === Action) {
        return action;
      } else if (typeof action === 'string') {
        return isOld ? this[action] : new Action({ name: action });
      }
    }
  }]);

  return Actions;
})();

exports.Actions = Actions;