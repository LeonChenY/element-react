import React from 'react'
import ReactDOM from 'react-dom'

import { PropTypes, Component } from '../../../libs'
import Locale from '../../locale'
import Input from '../../input'
import TimePanel from './TimePanel'
import { MountBody } from '../MountBody'

import { SELECTION_MODES, deconstructDate, formatDate, parseDate, toDate, nextMonth } from '../utils'
import { DateTable, MonthTable, YearTable } from '../basic'
import { PopperBase } from './PopperBase'
import { PLACEMENT_MAP } from '../constants'


const PICKER_VIEWS = {
    YEAR: 'year',
    MONTH: 'month',
    DATE: 'date',
}

export default class DateMultPanelBox extends Component {

    static get propTypes() {

        return Object.assign({
            // user picked date value
            // value: Date | null
            value: PropTypes.any,
            valueList: PropTypes.any,
            // (Date)=>void
            onPick: PropTypes.func,
            isShowTime: PropTypes.bool,
            showWeekNumber: PropTypes.bool,
            format: PropTypes.string,
            // Array[{text: String, onClick: (picker)=>()}]
            shortcuts: PropTypes.arrayOf(
                PropTypes.shape({
                    text: PropTypes.string.isRequired,
                    // ()=>()
                    onClick: PropTypes.func.isRequired
                })
            ),
            selectionMode: PropTypes.oneOf(Object.keys(SELECTION_MODES).map(e => SELECTION_MODES[e])),
            // (Date)=>bool, if true, disabled
            disabledDate: PropTypes.func,
            firstDayOfWeek: PropTypes.range(0, 6),
            dir: PropTypes.string,
            isMultiple: PropTypes.bool,
            onChange: PropTypes.func

        })
    }

    constructor(props) {
        super(props)

        let currentView = PICKER_VIEWS.DATE
        switch (props.selectionMode) {
            case SELECTION_MODES.MONTH:
                currentView = PICKER_VIEWS.MONTH; break;
            case SELECTION_MODES.YEAR:
                currentView = PICKER_VIEWS.YEAR; break;
        }

        this.state = {
            currentView,
            timePickerVisible: false,
            pickerWidth: 0,
            dateList: [new Date()],
            date: new Date() // current view's date
        }

        if (props.valueList) {
            this.state.dateList = props.valueList
        } else {
            this.state.dateList = [];
        }
    }

    componentWillReceiveProps(nextProps) {
        let dateList = [new Date()]
        if (nextProps.valueList) {
            dateList = nextProps.valueList
        } else {
            dateList = [];
        }

        this.setState({ dateList })
    }

    resetDate() {
        // this.date = [new Date()]
    }

    showMonthPicker() {
        this.setState({ currentView: PICKER_VIEWS.MONTH })
    }

    showYearPicker() {
        this.setState({ currentView: PICKER_VIEWS.YEAR })
    }

    prevMonth() {
        this.updateState(() => {
            const { date } = this.state
            const { month, year } = deconstructDate(date)
            date.setMonth(month, 1)

            if (month == 0) {
                date.setFullYear(year - 1)
                date.setMonth(11)
            } else {
                date.setMonth(month - 1)
            }
        })
    }

    nextMonth() {
        this.updateState(() => {
            const { date } = this.state
            const { month, year } = deconstructDate(date)
            date.setMonth(month, 1)

            if (month == 11) {
                date.setFullYear(year + 1)
                date.setMonth(0)
            } else {
                date.setMonth(month + 1)
            }
        })
    }

    nextYear() {
        this.updateState(() => {
            const { date, currentView } = this.state
            const { year } = deconstructDate(date)

            if (currentView === 'year') {
                date.setFullYear(year + 10)
            } else {
                date.setFullYear(year + 1)
            }
        })
    }

    updateState(cb) {
        cb(this.state)
        this.setState({})
    }

    prevYear() {
        this.updateState(() => {
            const { date, currentView } = this.state
            const { year } = deconstructDate(date)

            if (currentView === 'year') {
                date.setFullYear(year - 10)
            } else {
                date.setFullYear(year - 1)
            }
        })
    }

    handleShortcutClick(shortcut) {
        shortcut.onClick()
    }


    handleDatePick(value) {
        this.updateState(state => {
            const { dateList } = state
            const { selectionMode, onChange } = this.props
            const pdate = value.date
            if (selectionMode === SELECTION_MODES.DAY) {
                // 做去重操作,无则加上,有则去除
                let isExist = false;
                let existIndex = -1;

                dateList.map((dItem, dIndex) => {
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

                // onPick(pdate, true, dateList);
                onChange(pdate, dateList);

            }
        })
    }

    resetView() {
        let { selectionMode } = this.props

        this.updateState(state => {
            if (selectionMode === SELECTION_MODES.MONTH) {
                state.currentView = PICKER_VIEWS.MONTH
            } else if (selectionMode === SELECTION_MODES.YEAR) {
                state.currentView = PICKER_VIEWS.YEAR
            } else {
                state.currentView = PICKER_VIEWS.DATE
            }
        })
    }

    yearLabel() {
        const { currentView, date } = this.state
        const { year } = deconstructDate(date)
        const yearTranslation = Locale.t('el.datepicker.year')
        if (currentView === 'year') {
            const startYear = Math.floor(year / 10) * 10
            if (yearTranslation) {
                return startYear + ' ' + yearTranslation + '-' + (startYear + 9) + ' ' + yearTranslation
            }
            return startYear + ' - ' + (startYear + 9)
        }
        return year + ' ' + yearTranslation
    }

    get visibleTime() {
        return formatDate(this.state.date, this.timeFormat)
    }

    set visibleTime(val) {
        if (val) {
            const ndate = parseDate(val, this.timeFormat)
            let { date } = this.state
            if (ndate) {
                ndate.setFullYear(date[0].getFullYear())
                ndate.setMonth(date[0].getMonth())
                ndate.setDate(date[0].getDate())
                this.setState({ date: ndate, timePickerVisible: false })
            }
        }
    }


    get visibleDate() {
        return formatDate(this.state.date, this.dateFormat)
    }

    set visibleDate(val) {
        const ndate = parseDate(val, this.dateFormat)
        if (!ndate) {
            return
        }
        let { disabledDate } = this.props
        let { date } = this.state
        if (typeof disabledDate === 'function' && disabledDate(ndate)) {
            return
        }
        ndate.setHours(date.getHours())
        ndate.setMinutes(date.getMinutes())
        ndate.setSeconds(date.getSeconds())
        this.setState({ date: ndate })
        this.resetView()
    }

    get timeFormat() {
        let { format } = this.props
        if (format && format.indexOf('ss') === -1) {
            return 'HH:mm'
        } else {
            return 'HH:mm:ss'
        }
    }

    get dateFormat() {
        if (this.props.format) return this.props.format.replace('HH:mm', '').replace(':ss', '').trim()
        else return 'yyyy-MM-dd'
    }

    get rightDate() {
        return nextMonth(this.state.date)
    }


    // end: ------ public methods
    _pickerContent(d: any) {
        const { value, selectionMode, disabledDate, showWeekNumber, firstDayOfWeek, dir, isMultiple } = this.props
        const { dateList } = this.state
        let result = null

        result = (<DateTable
            dir={dir}
            onPick={this.handleDatePick.bind(this)}
            date={dateList}
            nowDate={d}
            value={value}
            selectionMode={selectionMode}
            disabledDate={disabledDate}
            showWeekNumber={showWeekNumber}
            firstDayOfWeek={firstDayOfWeek}
            isMultiple={true}
        />)

        return result
    }

    render() {
        const { isShowTime, shortcuts, dir } = this.props
        const { currentView, date, pickerWidth, timePickerVisible } = this.state
        const { month } = deconstructDate(date)
        const t = Locale.t
        const rightDate = this.rightDate

        const leftLabel = `${date.getFullYear()} ${t('el.datepicker.year')} ` + t(`el.datepicker.month${date.getMonth() + 1}`)
        const rightLabel = `${rightDate.getFullYear()} ${t('el.datepicker.year')} ` + t(`el.datepicker.month${rightDate.getMonth() + 1}`)

        return (
            <div
                ref="root"
                dir={dir}
                className={this.classNames('el-picker-panel el-date-range-picker el-date-only-panel', {
                    'has-sidebar': shortcuts,
                    'has-time': isShowTime
                })}
            >
                <div className="el-picker-panel__body-wrapper">
                    {
                        Array.isArray(shortcuts) && (
                            <div className="el-picker-panel__sidebar">
                                {
                                    shortcuts.map((e, idx) => {
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                className="el-picker-panel__shortcut"
                                                onClick={() => this.handleShortcutClick(e)}>{e.text}</button>
                                        )
                                    })
                                }
                            </div>
                        )
                    }
                    <div className="el-picker-panel__body">
                        <div className="el-picker-panel__content el-date-range-picker__content is-left">
                            <div className="el-date-range-picker__header">
                                <button
                                    type="button"
                                    onClick={this.prevYear.bind(this)}
                                    className="el-picker-panel__icon-btn el-icon-d-arrow-left"></button>
                                <button
                                    type="button"
                                    onClick={this.prevMonth.bind(this)}
                                    className="el-picker-panel__icon-btn el-icon-arrow-left"></button>
                                <div>{leftLabel}</div>
                            </div>
                            {this._pickerContent(date)}
                        </div>
                        <div className="el-picker-panel__content el-date-range-picker__content is-right">
                            <div className="el-date-range-picker__header">
                                <button
                                    type="button"
                                    onClick={this.nextYear.bind(this)}
                                    className="el-picker-panel__icon-btn el-icon-d-arrow-right"></button>
                                <button
                                    type="button"
                                    onClick={this.nextMonth.bind(this)}
                                    className="el-picker-panel__icon-btn el-icon-arrow-right"></button>
                                <div>{rightLabel}</div>
                            </div>
                            {this._pickerContent(rightDate)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

DateMultPanelBox.defaultProps = {
    isShowTime: false,
    selectionMode: SELECTION_MODES.DAY,
    dir: 'ltr',
    isMultiple: true
}
