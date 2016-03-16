'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = getConnectMixin;

function getConnectMixin(store) {
  var changeCallback = function changeCallback(state) {
    this.setState(state.toJS());
  };

  var listener = undefined;

  return {
    getInitialState: function getInitialState() {
      var frozen = store.store.get(arguments);
      var state = frozen.toJS();

      if (!this.boundEximChangeCallbacks) this.boundEximChangeCallbacks = {};

      this.boundEximChangeCallbacks[store] = changeCallback.bind(this);

      listener = frozen.getListener();
      return state;
    },

    componentDidMount: function componentDidMount() {
      listener.on('update', this.boundEximChangeCallbacks[store]);
    },

    componentWillUnmount: function componentWillUnmount() {
      if (listener) listener.off('update', this.boundEximChangeCallbacks[store]);
    }
  };
}

module.exports = exports['default'];