'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createView = createView;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterOld = require('react-router-old');

var _reactRouterOld2 = _interopRequireDefault(_reactRouterOld);

function getRouter() {
  var Router = {};
  if (typeof _reactRouterOld2['default'] !== 'undefined') {
    var routerElements = ['Route', 'DefaultRoute', 'RouteHandler', 'ActiveHandler', 'NotFoundRoute', 'Link', 'Redirect'],
        routerMixins = ['Navigation', 'State'],
        routerFunctions = ['create', 'createDefaultRoute', 'createNotFoundRoute', 'createRedirect', 'createRoute', 'createRoutesFromReactChildren', 'run'],
        routerObjects = ['HashLocation', 'History', 'HistoryLocation', 'RefreshLocation', 'StaticLocation', 'TestLocation', 'ImitateBrowserBehavior', 'ScrollToTopBehavior'],
        copiedItems = routerMixins.concat(routerFunctions).concat(routerObjects);

    routerElements.forEach(function (name) {
      Router[name] = _react2['default'].createElement.bind(_react2['default'], _reactRouterOld2['default'][name]);
    });

    copiedItems.forEach(function (name) {
      Router[name] = _reactRouterOld2['default'][name];
    });
  }
  return Router;
}

function getDOM() {
  var DOMHelpers = {};

  if (typeof _react2['default'] !== 'undefined') {
    var tag = function tag(name) {
      var attributes = undefined;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var first = args[0] && args[0].constructor;
      if (first === Object) {
        attributes = args.shift();
      } else {
        attributes = {};
      }
      return _react2['default'].DOM[name].apply(_react2['default'].DOM, [attributes].concat(args));
    };

    for (var tagName in _react2['default'].DOM) {
      DOMHelpers[tagName] = tag.bind(this, tagName);
    }

    DOMHelpers.space = function () {
      return _react2['default'].DOM.span({
        dangerouslySetInnerHTML: {
          __html: '&nbsp;'
        }
      });
    };
  }
  return DOMHelpers;
}

var Router = getRouter();
exports.Router = Router;
var DOM = getDOM();

exports.DOM = DOM;

function createView(classArgs) {
  var ReactClass = _react2['default'].createClass(classArgs);
  var ReactElement = _react2['default'].createElement.bind(_react2['default'].createElement, ReactClass);
  return ReactElement;
}