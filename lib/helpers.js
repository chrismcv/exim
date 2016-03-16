'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  cx: function cx(classNames) {
    if (typeof classNames == 'object') {
      return _Object$keys(classNames).filter(function (className) {
        return classNames[className];
      }).join(' ');
    } else {
      return Array.prototype.join.call(arguments, ' ');
    }
  }
};
module.exports = exports['default'];