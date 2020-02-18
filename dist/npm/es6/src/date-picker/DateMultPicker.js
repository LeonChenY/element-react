import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _createClass from 'babel-runtime/helpers/createClass';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';

import { pick } from '../../libs/utils';
import { SELECTION_MODES } from './utils';

import BasePicker from './BasePicker';
import DateMultPanel from './panel/DateMultPanel';

var DateMultPicker = function (_BasePicker) {
    _inherits(DateMultPicker, _BasePicker);

    _createClass(DateMultPicker, null, [{
        key: 'propTypes',
        get: function get() {
            return Object.assign({}, BasePicker.propTypes, pick(DateMultPanel.propTypes, ['value', 'shortcuts', 'selectionMode', 'disabledDate', 'showWeekNumber', 'firstDayOfWeek', 'isShowTime']));
        }
    }, {
        key: 'defaultProps',
        get: function get() {
            var result = Object.assign({}, BasePicker.defaultProps, { isMultiple: true });
            return result;
        }
    }]);

    function DateMultPicker(props) {
        _classCallCheck(this, DateMultPicker);

        var type = 'date';
        switch (props.selectionMode) {
            case SELECTION_MODES.YEAR:
                type = 'year';break;
            case SELECTION_MODES.MONTH:
                type = 'month';break;
            case SELECTION_MODES.WEEK:
                type = 'week';break;
        }
        return _possibleConstructorReturn(this, _BasePicker.call(this, props, type, {}));
    }

    DateMultPicker.prototype.pickerPanel = function pickerPanel(state, props) {
        return React.createElement(DateMultPanel, _extends({}, props, {
            value: state.value,
            valueList: state.valueList,
            onPick: this.onPicked.bind(this)
        }));
    };

    return DateMultPicker;
}(BasePicker);

export default DateMultPicker;