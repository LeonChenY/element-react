import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _createClass from 'babel-runtime/helpers/createClass';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import ReactDOM from 'react-dom';

import { PropTypes } from '../../../libs';
import Locale from '../../locale';
import Input from '../../input';
import TimePanel from './TimePanel';
import { MountBody } from '../MountBody';

import { SELECTION_MODES, deconstructDate, formatDate, parseDate, toDate, nextMonth } from '../utils';
import { DateTable, MonthTable, YearTable } from '../basic';
import { PopperBase } from './PopperBase';
import { PLACEMENT_MAP } from '../constants';

var PICKER_VIEWS = {
    YEAR: 'year',
    MONTH: 'month',
    DATE: 'date'
};

var DateMultPanel = function (_PopperBase) {
    _inherits(DateMultPanel, _PopperBase);

    _createClass(DateMultPanel, null, [{
        key: 'propTypes',
        get: function get() {

            return Object.assign({
                // user picked date value
                // value: Date | null
                value: PropTypes.any,
                valueList: PropTypes.any,
                // (Date)=>void
                onPick: PropTypes.func.isRequired,
                isShowTime: PropTypes.bool,
                showWeekNumber: PropTypes.bool,
                format: PropTypes.string,
                // Array[{text: String, onClick: (picker)=>()}]
                shortcuts: PropTypes.arrayOf(PropTypes.shape({
                    text: PropTypes.string.isRequired,
                    // ()=>()
                    onClick: PropTypes.func.isRequired
                })),
                selectionMode: PropTypes.oneOf(Object.keys(SELECTION_MODES).map(function (e) {
                    return SELECTION_MODES[e];
                })),
                // (Date)=>bool, if true, disabled
                disabledDate: PropTypes.func,
                firstDayOfWeek: PropTypes.range(0, 6),
                dir: PropTypes.string,
                isMultiple: PropTypes.bool

            }, PopperBase.propTypes);
        }
    }]);

    function DateMultPanel(props) {
        _classCallCheck(this, DateMultPanel);

        var _this = _possibleConstructorReturn(this, _PopperBase.call(this, props));

        var currentView = PICKER_VIEWS.DATE;
        switch (props.selectionMode) {
            case SELECTION_MODES.MONTH:
                currentView = PICKER_VIEWS.MONTH;break;
            case SELECTION_MODES.YEAR:
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

    DateMultPanel.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        var dateList = [new Date()];
        if (nextProps.valueList) {
            dateList = nextProps.valueList;
        } else {
            dateList = [];
        }

        this.setState({ dateList: dateList });
    };

    DateMultPanel.prototype.resetDate = function resetDate() {
        // this.date = [new Date()]
    };

    DateMultPanel.prototype.showMonthPicker = function showMonthPicker() {
        this.setState({ currentView: PICKER_VIEWS.MONTH });
    };

    DateMultPanel.prototype.showYearPicker = function showYearPicker() {
        this.setState({ currentView: PICKER_VIEWS.YEAR });
    };

    DateMultPanel.prototype.prevMonth = function prevMonth() {
        var _this2 = this;

        this.updateState(function () {
            var date = _this2.state.date;

            var _deconstructDate = deconstructDate(date),
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
    };

    DateMultPanel.prototype.nextMonth = function nextMonth() {
        var _this3 = this;

        this.updateState(function () {
            var date = _this3.state.date;

            var _deconstructDate2 = deconstructDate(date),
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
    };

    DateMultPanel.prototype.nextYear = function nextYear() {
        var _this4 = this;

        this.updateState(function () {
            var _state = _this4.state,
                date = _state.date,
                currentView = _state.currentView;

            var _deconstructDate3 = deconstructDate(date),
                year = _deconstructDate3.year;

            if (currentView === 'year') {
                date.setFullYear(year + 10);
            } else {
                date.setFullYear(year + 1);
            }
        });
    };

    DateMultPanel.prototype.updateState = function updateState(cb) {
        cb(this.state);
        this.setState({});
    };

    DateMultPanel.prototype.prevYear = function prevYear() {
        var _this5 = this;

        this.updateState(function () {
            var _state2 = _this5.state,
                date = _state2.date,
                currentView = _state2.currentView;

            var _deconstructDate4 = deconstructDate(date),
                year = _deconstructDate4.year;

            if (currentView === 'year') {
                date.setFullYear(year - 10);
            } else {
                date.setFullYear(year - 1);
            }
        });
    };

    DateMultPanel.prototype.handleShortcutClick = function handleShortcutClick(shortcut) {
        shortcut.onClick();
    };

    DateMultPanel.prototype.handleTimePick = function handleTimePick(pickedDate, isKeepPanel) {
        this.updateState(function (state) {
            if (pickedDate) {
                var oldDate = state.date;
                oldDate.setHours(pickedDate.getHours());
                oldDate.setMinutes(pickedDate.getMinutes());
                oldDate.setSeconds(pickedDate.getSeconds());
            }
            state.timePickerVisible = isKeepPanel;
        });
    };

    DateMultPanel.prototype.handleMonthPick = function handleMonthPick(month) {
        var _this6 = this;

        this.updateState(function (state) {
            var date = state.date;
            var selectionMode = _this6.props.selectionMode;

            var _deconstructDate5 = deconstructDate(date),
                year = _deconstructDate5.year;

            if (selectionMode !== SELECTION_MODES.MONTH) {
                date.setMonth(month);
                state.currentView = PICKER_VIEWS.DATE;
            } else {
                date.setMonth(month);
                date.setFullYear(year);
                _this6.props.onPick(new Date(year, month, 1));
            }
        });
    };

    DateMultPanel.prototype.handleDatePick = function handleDatePick(value) {
        var _this7 = this;

        this.updateState(function (state) {
            var dateList = state.dateList;
            var _props = _this7.props,
                selectionMode = _props.selectionMode,
                isShowTime = _props.isShowTime,
                onPick = _props.onPick;

            var pdate = value.date;
            if (selectionMode === SELECTION_MODES.DAY) {
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
            } else if (selectionMode === SELECTION_MODES.WEEK) {
                onPick(pdate);
            }
        });
    };

    DateMultPanel.prototype.handleYearPick = function handleYearPick(year) {
        var _this8 = this;

        this.updateState(function (state) {
            var _props2 = _this8.props,
                onPick = _props2.onPick,
                selectionMode = _props2.selectionMode;
            var date = state.date;

            date.setFullYear(year);
            if (selectionMode === SELECTION_MODES.YEAR) {
                onPick(new Date(year, 0));
            } else {
                state.currentView = PICKER_VIEWS.MONTH;
            }
        });
    };

    DateMultPanel.prototype.changeToNow = function changeToNow() {
        var now = new Date();
        this.props.onPick(now);
        this.setState({ date: now });
    };

    DateMultPanel.prototype.confirm = function confirm() {
        this.props.onPick(null, false, this.state.dateList);
    };

    DateMultPanel.prototype.resetView = function resetView() {
        var selectionMode = this.props.selectionMode;


        this.updateState(function (state) {
            if (selectionMode === SELECTION_MODES.MONTH) {
                state.currentView = PICKER_VIEWS.MONTH;
            } else if (selectionMode === SELECTION_MODES.YEAR) {
                state.currentView = PICKER_VIEWS.YEAR;
            } else {
                state.currentView = PICKER_VIEWS.DATE;
            }
        });
    };

    DateMultPanel.prototype.yearLabel = function yearLabel() {
        var _state3 = this.state,
            currentView = _state3.currentView,
            date = _state3.date;

        var _deconstructDate6 = deconstructDate(date),
            year = _deconstructDate6.year;

        var yearTranslation = Locale.t('el.datepicker.year');
        if (currentView === 'year') {
            var startYear = Math.floor(year / 10) * 10;
            if (yearTranslation) {
                return startYear + ' ' + yearTranslation + '-' + (startYear + 9) + ' ' + yearTranslation;
            }
            return startYear + ' - ' + (startYear + 9);
        }
        return year + ' ' + yearTranslation;
    };

    // end: ------ public methods
    DateMultPanel.prototype._pickerContent = function _pickerContent(d) {
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

        result = React.createElement(DateTable, {
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
    };

    DateMultPanel.prototype.render = function render() {
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

        var _deconstructDate7 = deconstructDate(date),
            month = _deconstructDate7.month;

        var t = Locale.t;
        var rightDate = this.rightDate;

        var leftLabel = date.getFullYear() + ' ' + t('el.datepicker.year') + ' ' + t('el.datepicker.month' + (date.getMonth() + 1));
        var rightLabel = rightDate.getFullYear() + ' ' + t('el.datepicker.year') + ' ' + t('el.datepicker.month' + (rightDate.getMonth() + 1));

        return React.createElement(
            'div',
            {
                ref: 'root',
                dir: dir,
                className: this.classNames('el-picker-panel el-date-range-picker', {
                    'has-sidebar': shortcuts,
                    'has-time': isShowTime
                })
            },
            React.createElement(
                'div',
                { className: 'el-picker-panel__body-wrapper' },
                Array.isArray(shortcuts) && React.createElement(
                    'div',
                    { className: 'el-picker-panel__sidebar' },
                    shortcuts.map(function (e, idx) {
                        return React.createElement(
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
                React.createElement(
                    'div',
                    { className: 'el-picker-panel__body' },
                    React.createElement(
                        'div',
                        { className: 'el-picker-panel__content el-date-range-picker__content is-left' },
                        React.createElement(
                            'div',
                            { className: 'el-date-range-picker__header' },
                            React.createElement('button', {
                                type: 'button',
                                onClick: this.prevYear.bind(this),
                                className: 'el-picker-panel__icon-btn el-icon-d-arrow-left' }),
                            React.createElement('button', {
                                type: 'button',
                                onClick: this.prevMonth.bind(this),
                                className: 'el-picker-panel__icon-btn el-icon-arrow-left' }),
                            React.createElement(
                                'div',
                                null,
                                leftLabel
                            )
                        ),
                        this._pickerContent(date)
                    ),
                    React.createElement(
                        'div',
                        { className: 'el-picker-panel__content el-date-range-picker__content is-right' },
                        React.createElement(
                            'div',
                            { className: 'el-date-range-picker__header' },
                            React.createElement('button', {
                                type: 'button',
                                onClick: this.nextYear.bind(this),
                                className: 'el-picker-panel__icon-btn el-icon-d-arrow-right' }),
                            React.createElement('button', {
                                type: 'button',
                                onClick: this.nextMonth.bind(this),
                                className: 'el-picker-panel__icon-btn el-icon-arrow-right' }),
                            React.createElement(
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
    };

    _createClass(DateMultPanel, [{
        key: 'visibleTime',
        get: function get() {
            return formatDate(this.state.date, this.timeFormat);
        },
        set: function set(val) {
            if (val) {
                var ndate = parseDate(val, this.timeFormat);
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
            return formatDate(this.state.date, this.dateFormat);
        },
        set: function set(val) {
            var ndate = parseDate(val, this.dateFormat);
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
            return nextMonth(this.state.date);
        }
    }]);

    return DateMultPanel;
}(PopperBase);

export default DateMultPanel;


DateMultPanel.defaultProps = {
    isShowTime: false,
    selectionMode: SELECTION_MODES.DAY,
    dir: 'ltr',
    isMultiple: true
};