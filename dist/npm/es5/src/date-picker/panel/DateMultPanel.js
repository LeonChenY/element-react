'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _libs = require('../../../libs');

var _locale = require('../../locale');

var _locale2 = _interopRequireDefault(_locale);

var _input = require('../../input');

var _input2 = _interopRequireDefault(_input);

var _TimePanel = require('./TimePanel');

var _TimePanel2 = _interopRequireDefault(_TimePanel);

var _MountBody = require('../MountBody');

var _utils = require('../utils');

var _basic = require('../basic');

var _PopperBase2 = require('./PopperBase');

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
    enterModule && enterModule(module);
})();

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
    return a;
};

var PICKER_VIEWS = {
    YEAR: 'year',
    MONTH: 'month',
    DATE: 'date'
};

var DateMultPanel = function (_PopperBase) {
    (0, _inherits3.default)(DateMultPanel, _PopperBase);
    (0, _createClass3.default)(DateMultPanel, null, [{
        key: 'propTypes',
        get: function get() {

            return Object.assign({
                // user picked date value
                // value: Date | null
                value: _libs.PropTypes.any,
                valueList: _libs.PropTypes.any,
                // (Date)=>void
                onPick: _libs.PropTypes.func.isRequired,
                isShowTime: _libs.PropTypes.bool,
                showWeekNumber: _libs.PropTypes.bool,
                format: _libs.PropTypes.string,
                // Array[{text: String, onClick: (picker)=>()}]
                shortcuts: _libs.PropTypes.arrayOf(_libs.PropTypes.shape({
                    text: _libs.PropTypes.string.isRequired,
                    // ()=>()
                    onClick: _libs.PropTypes.func.isRequired
                })),
                selectionMode: _libs.PropTypes.oneOf(Object.keys(_utils.SELECTION_MODES).map(function (e) {
                    return _utils.SELECTION_MODES[e];
                })),
                // (Date)=>bool, if true, disabled
                disabledDate: _libs.PropTypes.func,
                firstDayOfWeek: _libs.PropTypes.range(0, 6),
                dir: _libs.PropTypes.string,
                isMultiple: _libs.PropTypes.bool

            }, _PopperBase2.PopperBase.propTypes);
        }
    }]);

    function DateMultPanel(props) {
        (0, _classCallCheck3.default)(this, DateMultPanel);

        var _this = (0, _possibleConstructorReturn3.default)(this, (DateMultPanel.__proto__ || Object.getPrototypeOf(DateMultPanel)).call(this, props));

        var currentView = PICKER_VIEWS.DATE;
        switch (props.selectionMode) {
            case _utils.SELECTION_MODES.MONTH:
                currentView = PICKER_VIEWS.MONTH;break;
            case _utils.SELECTION_MODES.YEAR:
                currentView = PICKER_VIEWS.YEAR;break;
        }

        _this.state = {
            currentView: currentView,
            timePickerVisible: false,
            pickerWidth: 0,
            dateList: [new Date()],
            date: new Date() // current view's date
        };

        if (props.valueList) {
            _this.state.dateList = props.valueList;
        } else {
            _this.state.dateList = [];
        }
        return _this;
    }

    (0, _createClass3.default)(DateMultPanel, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var dateList = [new Date()];
            if (nextProps.valueList) {
                dateList = nextProps.valueList;
            } else {
                dateList = [];
            }

            this.setState({ dateList: dateList });
        }
    }, {
        key: 'resetDate',
        value: function resetDate() {
            // this.date = [new Date()]
        }
    }, {
        key: 'showMonthPicker',
        value: function showMonthPicker() {
            this.setState({ currentView: PICKER_VIEWS.MONTH });
        }
    }, {
        key: 'showYearPicker',
        value: function showYearPicker() {
            this.setState({ currentView: PICKER_VIEWS.YEAR });
        }
    }, {
        key: 'prevMonth',
        value: function prevMonth() {
            var _this2 = this;

            this.updateState(function () {
                var date = _this2.state.date;

                var _deconstructDate = (0, _utils.deconstructDate)(date),
                    month = _deconstructDate.month,
                    year = _deconstructDate.year;

                date.setMonth(month, 1);

                if (month == 0) {
                    date.setFullYear(year - 1);
                    date.setMonth(11);
                } else {
                    date.setMonth(month - 1);
                }
            });
        }
    }, {
        key: 'nextMonth',
        value: function nextMonth() {
            var _this3 = this;

            this.updateState(function () {
                var date = _this3.state.date;

                var _deconstructDate2 = (0, _utils.deconstructDate)(date),
                    month = _deconstructDate2.month,
                    year = _deconstructDate2.year;

                date.setMonth(month, 1);

                if (month == 11) {
                    date.setFullYear(year + 1);
                    date.setMonth(0);
                } else {
                    date.setMonth(month + 1);
                }
            });
        }
    }, {
        key: 'nextYear',
        value: function nextYear() {
            var _this4 = this;

            this.updateState(function () {
                var _state = _this4.state,
                    date = _state.date,
                    currentView = _state.currentView;

                var _deconstructDate3 = (0, _utils.deconstructDate)(date),
                    year = _deconstructDate3.year;

                if (currentView === 'year') {
                    date.setFullYear(year + 10);
                } else {
                    date.setFullYear(year + 1);
                }
            });
        }
    }, {
        key: 'updateState',
        value: function updateState(cb) {
            cb(this.state);
            this.setState({});
        }
    }, {
        key: 'prevYear',
        value: function prevYear() {
            var _this5 = this;

            this.updateState(function () {
                var _state2 = _this5.state,
                    date = _state2.date,
                    currentView = _state2.currentView;

                var _deconstructDate4 = (0, _utils.deconstructDate)(date),
                    year = _deconstructDate4.year;

                if (currentView === 'year') {
                    date.setFullYear(year - 10);
                } else {
                    date.setFullYear(year - 1);
                }
            });
        }
    }, {
        key: 'handleShortcutClick',
        value: function handleShortcutClick(shortcut) {
            shortcut.onClick();
        }
    }, {
        key: 'handleTimePick',
        value: function handleTimePick(pickedDate, isKeepPanel) {
            this.updateState(function (state) {
                if (pickedDate) {
                    var oldDate = state.date;
                    oldDate.setHours(pickedDate.getHours());
                    oldDate.setMinutes(pickedDate.getMinutes());
                    oldDate.setSeconds(pickedDate.getSeconds());
                }
                state.timePickerVisible = isKeepPanel;
            });
        }
    }, {
        key: 'handleMonthPick',
        value: function handleMonthPick(month) {
            var _this6 = this;

            this.updateState(function (state) {
                var date = state.date;
                var selectionMode = _this6.props.selectionMode;

                var _deconstructDate5 = (0, _utils.deconstructDate)(date),
                    year = _deconstructDate5.year;

                if (selectionMode !== _utils.SELECTION_MODES.MONTH) {
                    date.setMonth(month);
                    state.currentView = PICKER_VIEWS.DATE;
                } else {
                    date.setMonth(month);
                    date.setFullYear(year);
                    _this6.props.onPick(new Date(year, month, 1));
                }
            });
        }
    }, {
        key: 'handleDatePick',
        value: function handleDatePick(value) {
            var _this7 = this;

            this.updateState(function (state) {
                var dateList = state.dateList;
                var _props = _this7.props,
                    selectionMode = _props.selectionMode,
                    isShowTime = _props.isShowTime,
                    onPick = _props.onPick;

                var pdate = value.date;
                if (selectionMode === _utils.SELECTION_MODES.DAY) {
                    // 做去重操作,无则加上,有则去除
                    var isExist = false;
                    var existIndex = -1;

                    dateList.map(function (dItem, dIndex) {
                        if (dItem.getFullYear() === pdate.getFullYear() && dItem.getMonth() === pdate.getMonth() && dItem.getDate() === pdate.getDate()) {
                            isExist = true;
                            existIndex = dIndex;
                        }
                    });

                    if (!isExist) {
                        dateList.push(new Date(pdate));
                    } else {
                        dateList.splice(existIndex, 1);
                    }

                    onPick(pdate, true, dateList);
                } else if (selectionMode === _utils.SELECTION_MODES.WEEK) {
                    onPick(pdate);
                }
            });
        }
    }, {
        key: 'handleYearPick',
        value: function handleYearPick(year) {
            var _this8 = this;

            this.updateState(function (state) {
                var _props2 = _this8.props,
                    onPick = _props2.onPick,
                    selectionMode = _props2.selectionMode;
                var date = state.date;

                date.setFullYear(year);
                if (selectionMode === _utils.SELECTION_MODES.YEAR) {
                    onPick(new Date(year, 0));
                } else {
                    state.currentView = PICKER_VIEWS.MONTH;
                }
            });
        }
    }, {
        key: 'changeToNow',
        value: function changeToNow() {
            var now = new Date();
            this.props.onPick(now);
            this.setState({ date: now });
        }
    }, {
        key: 'confirm',
        value: function confirm() {
            this.props.onPick(null, false, this.state.dateList);
        }
    }, {
        key: 'resetView',
        value: function resetView() {
            var selectionMode = this.props.selectionMode;


            this.updateState(function (state) {
                if (selectionMode === _utils.SELECTION_MODES.MONTH) {
                    state.currentView = PICKER_VIEWS.MONTH;
                } else if (selectionMode === _utils.SELECTION_MODES.YEAR) {
                    state.currentView = PICKER_VIEWS.YEAR;
                } else {
                    state.currentView = PICKER_VIEWS.DATE;
                }
            });
        }
    }, {
        key: 'yearLabel',
        value: function yearLabel() {
            var _state3 = this.state,
                currentView = _state3.currentView,
                date = _state3.date;

            var _deconstructDate6 = (0, _utils.deconstructDate)(date),
                year = _deconstructDate6.year;

            var yearTranslation = _locale2.default.t('el.datepicker.year');
            if (currentView === 'year') {
                var startYear = Math.floor(year / 10) * 10;
                if (yearTranslation) {
                    return startYear + ' ' + yearTranslation + '-' + (startYear + 9) + ' ' + yearTranslation;
                }
                return startYear + ' - ' + (startYear + 9);
            }
            return year + ' ' + yearTranslation;
        }
    }, {
        key: '_pickerContent',


        // end: ------ public methods
        value: function _pickerContent(d) {
            var _props3 = this.props,
                value = _props3.value,
                selectionMode = _props3.selectionMode,
                disabledDate = _props3.disabledDate,
                showWeekNumber = _props3.showWeekNumber,
                firstDayOfWeek = _props3.firstDayOfWeek,
                dir = _props3.dir,
                isMultiple = _props3.isMultiple;
            var _state4 = this.state,
                date = _state4.date,
                dateList = _state4.dateList;
            var currentView = this.state.currentView;

            var result = null;

            result = _react2.default.createElement(_basic.DateTable, {
                dir: dir,
                onPick: this.handleDatePick.bind(this),
                date: dateList,
                nowDate: d,
                value: value,
                selectionMode: selectionMode,
                disabledDate: disabledDate,
                showWeekNumber: showWeekNumber,
                firstDayOfWeek: firstDayOfWeek,
                isMultiple: true
            });

            return result;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this9 = this;

            var _props4 = this.props,
                isShowTime = _props4.isShowTime,
                shortcuts = _props4.shortcuts,
                dir = _props4.dir;
            var _state5 = this.state,
                currentView = _state5.currentView,
                date = _state5.date,
                pickerWidth = _state5.pickerWidth,
                timePickerVisible = _state5.timePickerVisible;

            var _deconstructDate7 = (0, _utils.deconstructDate)(date),
                month = _deconstructDate7.month;

            var t = _locale2.default.t;
            var rightDate = this.rightDate;

            var leftLabel = date.getFullYear() + ' ' + t('el.datepicker.year') + ' ' + t('el.datepicker.month' + (date.getMonth() + 1));
            var rightLabel = rightDate.getFullYear() + ' ' + t('el.datepicker.year') + ' ' + t('el.datepicker.month' + (rightDate.getMonth() + 1));

            return _react2.default.createElement(
                'div',
                {
                    ref: 'root',
                    dir: dir,
                    className: this.classNames('el-picker-panel el-date-range-picker', {
                        'has-sidebar': shortcuts,
                        'has-time': isShowTime
                    })
                },
                _react2.default.createElement(
                    'div',
                    { className: 'el-picker-panel__body-wrapper' },
                    Array.isArray(shortcuts) && _react2.default.createElement(
                        'div',
                        { className: 'el-picker-panel__sidebar' },
                        shortcuts.map(function (e, idx) {
                            return _react2.default.createElement(
                                'button',
                                {
                                    key: idx,
                                    type: 'button',
                                    className: 'el-picker-panel__shortcut',
                                    onClick: function onClick() {
                                        return _this9.handleShortcutClick(e);
                                    } },
                                e.text
                            );
                        })
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'el-picker-panel__body' },
                        _react2.default.createElement(
                            'div',
                            { className: 'el-picker-panel__content el-date-range-picker__content is-left' },
                            _react2.default.createElement(
                                'div',
                                { className: 'el-date-range-picker__header' },
                                _react2.default.createElement('button', {
                                    type: 'button',
                                    onClick: this.prevYear.bind(this),
                                    className: 'el-picker-panel__icon-btn el-icon-d-arrow-left' }),
                                _react2.default.createElement('button', {
                                    type: 'button',
                                    onClick: this.prevMonth.bind(this),
                                    className: 'el-picker-panel__icon-btn el-icon-arrow-left' }),
                                _react2.default.createElement(
                                    'div',
                                    null,
                                    leftLabel
                                )
                            ),
                            this._pickerContent(date)
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'el-picker-panel__content el-date-range-picker__content is-right' },
                            _react2.default.createElement(
                                'div',
                                { className: 'el-date-range-picker__header' },
                                _react2.default.createElement('button', {
                                    type: 'button',
                                    onClick: this.nextYear.bind(this),
                                    className: 'el-picker-panel__icon-btn el-icon-d-arrow-right' }),
                                _react2.default.createElement('button', {
                                    type: 'button',
                                    onClick: this.nextMonth.bind(this),
                                    className: 'el-picker-panel__icon-btn el-icon-arrow-right' }),
                                _react2.default.createElement(
                                    'div',
                                    null,
                                    rightLabel
                                )
                            ),
                            this._pickerContent(rightDate)
                        )
                    )
                )
            );
        }
    }, {
        key: '__reactstandin__regenerateByEval',
        // @ts-ignore
        value: function __reactstandin__regenerateByEval(key, code) {
            // @ts-ignore
            this[key] = eval(code);
        }
    }, {
        key: 'visibleTime',
        get: function get() {
            return (0, _utils.formatDate)(this.state.date, this.timeFormat);
        },
        set: function set(val) {
            if (val) {
                var ndate = (0, _utils.parseDate)(val, this.timeFormat);
                var date = this.state.date;

                if (ndate) {
                    ndate.setFullYear(date[0].getFullYear());
                    ndate.setMonth(date[0].getMonth());
                    ndate.setDate(date[0].getDate());
                    this.setState({ date: ndate, timePickerVisible: false });
                }
            }
        }
    }, {
        key: 'visibleDate',
        get: function get() {
            return (0, _utils.formatDate)(this.state.date, this.dateFormat);
        },
        set: function set(val) {
            var ndate = (0, _utils.parseDate)(val, this.dateFormat);
            if (!ndate) {
                return;
            }
            var disabledDate = this.props.disabledDate;
            var date = this.state.date;

            if (typeof disabledDate === 'function' && disabledDate(ndate)) {
                return;
            }
            ndate.setHours(date.getHours());
            ndate.setMinutes(date.getMinutes());
            ndate.setSeconds(date.getSeconds());
            this.setState({ date: ndate });
            this.resetView();
        }
    }, {
        key: 'timeFormat',
        get: function get() {
            var format = this.props.format;

            if (format && format.indexOf('ss') === -1) {
                return 'HH:mm';
            } else {
                return 'HH:mm:ss';
            }
        }
    }, {
        key: 'dateFormat',
        get: function get() {
            if (this.props.format) return this.props.format.replace('HH:mm', '').replace(':ss', '').trim();else return 'yyyy-MM-dd';
        }
    }, {
        key: 'rightDate',
        get: function get() {
            return (0, _utils.nextMonth)(this.state.date);
        }
    }]);
    return DateMultPanel;
}(_PopperBase2.PopperBase);

var _default = DateMultPanel;
exports.default = _default;


DateMultPanel.defaultProps = {
    isShowTime: false,
    selectionMode: _utils.SELECTION_MODES.DAY,
    dir: 'ltr',
    isMultiple: true
};
;

(function () {
    var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(PICKER_VIEWS, 'PICKER_VIEWS', 'src/date-picker/panel/DateMultPanel.jsx');
    reactHotLoader.register(DateMultPanel, 'DateMultPanel', 'src/date-picker/panel/DateMultPanel.jsx');
    reactHotLoader.register(_default, 'default', 'src/date-picker/panel/DateMultPanel.jsx');
})();

;

(function () {
    var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
    leaveModule && leaveModule(module);
})();