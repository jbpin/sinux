module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Store = exports.Signal = exports.Command = undefined;

	var _command = __webpack_require__(1);

	var _command2 = _interopRequireDefault(_command);

	var _signal = __webpack_require__(3);

	var _signal2 = _interopRequireDefault(_signal);

	var _store = __webpack_require__(4);

	var _store2 = _interopRequireDefault(_store);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.Command = _command2.default;
	exports.Signal = _signal2.default;
	exports.Store = _store2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _co = __webpack_require__(2);

	var _co2 = _interopRequireDefault(_co);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Command = (function () {
	  function Command(signal, fx) {
	    _classCallCheck(this, Command);

	    this.fx = fx;
	    signal.add(this);
	  }

	  _createClass(Command, [{
	    key: 'execute',
	    value: function execute() {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      return _co2.default.apply(undefined, [this.fx].concat(args));
	    }
	  }]);

	  return Command;
	})();

	exports.default = Command;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("co");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _co = __webpack_require__(2);

	var _co2 = _interopRequireDefault(_co);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Signal = (function () {
	  function Signal(name) {
	    _classCallCheck(this, Signal);

	    if (!name) {
	      throw new Error('Signal name is mandatory');
	    }
	    this.name = name;
	    this.commands = new Set();
	  }

	  _createClass(Signal, [{
	    key: 'add',
	    value: function add(command) {
	      if (!this.commands.has(command)) {
	        this.commands.add(command);
	      }
	    }
	  }, {
	    key: 'dispatch',
	    value: function dispatch() {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      // compute listener promise
	      var commands = this.commands;
	      return (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
	        var result, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, c, r;

	        return regeneratorRuntime.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                result = {};
	                _iteratorNormalCompletion = true;
	                _didIteratorError = false;
	                _iteratorError = undefined;
	                _context.prev = 4;
	                _iterator = commands[Symbol.iterator]();

	              case 6:
	                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
	                  _context.next = 20;
	                  break;
	                }

	                c = _step.value;
	                r = null;

	                if (!c.execute) {
	                  _context.next = 15;
	                  break;
	                }

	                _context.next = 12;
	                return c.execute.apply(c, args);

	              case 12:
	                r = _context.sent;
	                _context.next = 16;
	                break;

	              case 15:
	                r = c.apply(undefined, args);

	              case 16:
	                result = _extends({}, result, r);

	              case 17:
	                _iteratorNormalCompletion = true;
	                _context.next = 6;
	                break;

	              case 20:
	                _context.next = 26;
	                break;

	              case 22:
	                _context.prev = 22;
	                _context.t0 = _context['catch'](4);
	                _didIteratorError = true;
	                _iteratorError = _context.t0;

	              case 26:
	                _context.prev = 26;
	                _context.prev = 27;

	                if (!_iteratorNormalCompletion && _iterator.return) {
	                  _iterator.return();
	                }

	              case 29:
	                _context.prev = 29;

	                if (!_didIteratorError) {
	                  _context.next = 32;
	                  break;
	                }

	                throw _iteratorError;

	              case 32:
	                return _context.finish(29);

	              case 33:
	                return _context.finish(26);

	              case 34:
	                return _context.abrupt('return', result);

	              case 35:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, this, [[4, 22, 26, 34], [27,, 29, 33]]);
	      })).catch(function (e) {
	        return console.log('Signal error', e);
	      });
	    }
	  }, {
	    key: 'remove',
	    value: function remove(command) {
	      this.commands.delete(command);
	    }
	  }]);

	  return Signal;
	})();

	exports.default = Signal;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _signal = __webpack_require__(3);

	var _signal2 = _interopRequireDefault(_signal);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Store = (function () {
	  function Store(initialState) {
	    _classCallCheck(this, Store);

	    this.state = initialState;
	    // signal for the store
	    this.changed = new _signal2.default('storeUpdated');

	    for (var _len = arguments.length, signals = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      signals[_key - 1] = arguments[_key];
	    }

	    this.addSignals.apply(this, signals);
	  }

	  _createClass(Store, [{
	    key: 'addSignals',
	    value: function addSignals() {
	      var _this = this;

	      for (var _len2 = arguments.length, signals = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        signals[_key2] = arguments[_key2];
	      }

	      signals.forEach(function (signal) {
	        var s = signal;
	        var name = signal;
	        if ('string' === typeof s) {
	          s = new _signal2.default(name);
	        } else {
	          name = s.name || s.__proto__.name;
	        }
	        if (_this[name]) {
	          return;
	        }
	        _this[name] = function () {
	          var _Signal$prototype$dis;

	          for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	            args[_key3] = arguments[_key3];
	          }

	          return (_Signal$prototype$dis = _signal2.default.prototype.dispatch).call.apply(_Signal$prototype$dis, [s, _this.getState()].concat(args)).then(function (payload) {
	            _this.updateState(payload);
	          });
	        };
	        _this[name].__proto__ = s;
	      });
	    }
	  }, {
	    key: 'getState',
	    value: function getState() {
	      return _extends({}, this.state);
	    }
	  }, {
	    key: 'updateState',
	    value: function updateState(payload) {
	      this.state = _extends({}, this.state, payload);
	      this.changed.dispatch(this.getState());
	    }
	  }]);

	  return Store;
	})();

	exports.default = Store;

/***/ }
/******/ ]);