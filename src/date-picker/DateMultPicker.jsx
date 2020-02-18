//@flow
import React from 'react';

import { pick } from '../../libs/utils'
import { SELECTION_MODES } from './utils'

import BasePicker from './BasePicker'
import DateMultPanel from './panel/DateMultPanel'
import type { DatePickerProps } from './Types';


export default class DateMultPicker extends BasePicker {
    static get propTypes() {
        return Object.assign(
            {},
            BasePicker.propTypes,
            pick(DateMultPanel.propTypes,
                ['value', 'shortcuts', 'selectionMode', 'disabledDate', 'showWeekNumber', 'firstDayOfWeek', 'isShowTime']))
    }

    static get defaultProps() {
        let result: any = Object.assign({}, BasePicker.defaultProps, { isMultiple: true })
        return result;
    }

    constructor(props: DatePickerProps) {
        let type = 'date'
        switch (props.selectionMode) {
            case SELECTION_MODES.YEAR:
                type = 'year'; break;
            case SELECTION_MODES.MONTH:
                type = 'month'; break;
            case SELECTION_MODES.WEEK:
                type = 'week'; break;
        }
        super(props, type, {})
    }

    pickerPanel(state: any, props: DatePickerProps) {
        return (
            <DateMultPanel
                {...props}
                value={state.value}
                valueList={state.valueList}
                onPick={this.onPicked.bind(this)}
            />
        )
    }
}
