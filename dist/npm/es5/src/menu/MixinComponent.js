'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _libs = require('../../libs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};

var MixinComponent = function (_Component) {
  (0, _inherits3.default)(MixinComponent, _Component);

  function MixinComponent() {
    (0, _classCallCheck3.default)(this, MixinComponent);
    return (0, _possibleConstructorReturn3.default)(this, (MixinComponent.__proto__ || Object.getPrototypeOf(MixinComponent)).apply(this, arguments));
  }

  (0, _createClass3.default)(MixinComponent, [{
    key: 'parent',
    value: function parent() {
      return this.context.component;
    }
  }, {
    key: 'indexPath',
    value: function indexPath() {
      var path = [this.props.index];
      var parent = this.parent();

      while (parent.instanceType !== 'Menu') {
        if (parent.props.index) {
          path.unshift(parent.props.index);
        }

        parent = parent.parent();
      }

      return path;
    }
  }, {
    key: 'rootMenu',
    value: function rootMenu() {
      var parent = this.parent();

      while (parent.instanceType !== 'Menu') {
        parent = parent.parent();
      }

      return parent;
    }
  }, {
    key: '__reactstandin__regenerateByEval',
    // @ts-ignore
    value: function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);
  return MixinComponent;
}(_libs.Component);

var _default = MixinComponent;
exports.default = _default;


MixinComponent.contextTypes = {
  component: _libs.PropTypes.any
};
;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(MixinComponent, 'MixinComponent', 'src/menu/MixinComponent.jsx');
  reactHotLoader.register(_default, 'default', 'src/menu/MixinComponent.jsx');
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();