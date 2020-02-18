'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../../libs/utils');

var _utils2 = require('./utils');

var _BasePicker2 = require('./BasePicker');

var _BasePicker3 = _interopRequireDefault(_BasePicker2);

var _DateMultPanel = require('./panel/DateMultPanel');

var _DateMultPanel2 = _interopRequireDefault(_DateMultPanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
    enterModule && enterModule(module);
})();

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
    return a;
};

var DateMultPicker = function (_BasePicker) {
    (0, _inherits3.default)(DateMultPicker, _BasePicker);
    (0, _createClass3.default)(DateMultPicker, null, [{
        key: 'propTypes',
        get: function get() {
            return Object.assign({}, _BasePicker3.default.propTypes, (0, _utils.pick)(_DateMultPanel2.default.propTypes, ['value', 'shortcuts', 'selectionMode', 'disabledDate', 'showWeekNumber', 'firstDayOfWeek', 'isShowTime']));
        }
    }, {
        key: 'defaultProps',
        get: function get() {
            var result = Object.assign({}, _BasePicker3.default.defaultProps, { isMultiple: true });
            return result;
        }
    }]);

    function DateMultPicker(props) {
        (0, _classCallCheck3.default)(this, DateMultPicker);

        var type = 'date';
        switch (props.selectionMode) {
            case _utils2.SELECTION_MODES.YEAR:
                type = 'year';break;
            case _utils2.SELECTION_MODES.MONTH:
                type = 'month';break;
            case _utils2.SELECTION_MODES.WEEK:
                type = 'week';break;
        }
        return (0, _possibleConstructorReturn3.default)(this, (DateMultPicker.__proto__ || Object.getPrototypeOf(DateMultPicker)).call(this, props, type, {}));
    }

    (0, _createClass3.default)(DateMultPicker, [{
        key: 'pickerPanel',
        value: function pickerPanel(state, props) {
            return _react2.default.createElement(_DateMultPanel2.default, (0, _extends3.default)({}, props, {
                value: state.value,
                valueList: state.valueList,
                onPick: this.onPicked.bind(this)
            }));
        }
    }, {
        key: '__reactstandin__regenerateByEval',
        // @ts-ignore
        value: function __reactstandin__regenerateByEval(key, code) {
            // @ts-ignore
            this[key] = eval(code);
        }
    }]);
    return DateMultPicker;
}(_BasePicker3.default);

var _default = DateMultPicker;
exports.default = _default;
;

(function () {
    var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(DateMultPicker, 'DateMultPicker', 'src/date-picker/DateMultPicker.jsx');
    reactHotLoader.register(_default, 'default', 'src/date-picker/DateMultPicker.jsx');
})();

;

(function () {
    var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
    leaveModule && leaveModule(module);
})();