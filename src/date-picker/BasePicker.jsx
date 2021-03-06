//@flow

import React from 'react';
import ReactDOM from 'react-dom';

import { PropTypes, Component } from '../../libs';
import { EventRegister } from '../../libs/internal'

import Input from '../input'
import { PLACEMENT_MAP, HAVE_TRIGGER_TYPES, TYPE_VALUE_RESOLVER_MAP, DEFAULT_FORMATS } from './constants'
import { Errors, require_condition, IDGenerator } from '../../libs/utils';
import { MountBody } from './MountBody'
import type { BasePickerProps, ValidDateType } from './Types';

type NullableDate = Date | null

const idGen = new IDGenerator()
const haveTriggerType = (type) => {
  return HAVE_TRIGGER_TYPES.indexOf(type) !== -1
}

const isValidValue = (value) => {
  if (value instanceof Date) return true
  if (Array.isArray(value) && value.length !== 0 && value[0] instanceof Date) return true
  return false
}

// only considers date-picker's value: Date or [Date, Date]
const valueEquals = function (a: any, b: any) {
  const aIsArray = Array.isArray(a)
  const bIsArray = Array.isArray(b)

  let isEqual = (a, b) => { // equal if a, b date is equal or both is null or undefined
    let equal = false
    if (a && b) equal = a.getTime() === b.getTime()
    else equal = a === b && a == null
    return equal
  }

  if (aIsArray && bIsArray) {
    return isEqual(a[0], b[0]) && isEqual(a[1], b[1])
  }
  if (!aIsArray && !bIsArray) {
    return isEqual(a, b)
  }
  return false;
};


export default class BasePicker extends Component {
  state: any;

  static get propTypes() {
    return {
      align: PropTypes.oneOf(['left', 'center', 'right']),
      className: PropTypes.string,
      format: PropTypes.string,
      isShowTrigger: PropTypes.bool,
      isReadOnly: PropTypes.bool,
      isDisabled: PropTypes.bool,
      placeholder: PropTypes.string,
      onFocus: PropTypes.func,
      onBlur: PropTypes.func,
      // (Date|Date[]|null)=>(), null when click on clear icon
      onClearClick: PropTypes.func,
      onChange: PropTypes.func,
      // time select pannel:
      value: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.arrayOf(PropTypes.instanceOf(Date))
      ]),
      valueList: PropTypes.array,// 多选
      isMultiple: PropTypes.bool, // 是否开启多选
      dir: PropTypes.string,
      error: PropTypes.bool,
      isAlwaysShowCloseIcon: PropTypes.bool,// 控制是否一直显示关闭按钮,默认值false，不是一直显示关闭按钮
      disabledClose: PropTypes.bool// 控制时间选择关闭按钮是否禁用,默认值为false，不禁用
    }
  }

  static get defaultProps() {
    return {
      value: new Date(),
      isMultiple: false,
      // (thisReactElement)=>Unit
      onFocus() { },
      onBlur() { },
      dir: 'ltr',
      error: false,
      isAlwaysShowCloseIcon: false,
      disabledClose: false,
      valueList: []
    }
  }

  constructor(props: BasePickerProps, _type: string, state: any = {}) {
    require_condition(typeof _type === 'string')
    super(props);

    this.type = _type// type need to be set first
    this.state = Object.assign({}, state, {
      pickerVisible: false,
    }, this.propsToState(props))

    this.clickOutsideId = 'clickOutsideId_' + idGen.next()
  }

  // ---: start, abstract methods
  // (state, props)=>ReactElement
  pickerPanel(state: any, props: $Subtype<BasePickerProps>) {
    throw new Errors.MethodImplementationRequiredError(props)
  }

  getFormatSeparator() {
    // return undefined
    return this.props.rangeSeparator
  }
  // ---: end, abstract methods

  componentWillReceiveProps(nextProps: any) {
    this.setState(this.propsToState(nextProps))
  }

  /**
   * onPicked should only be called from picker pannel instance
   * and should never return a null date instance
   *
   * @param value: Date|Date[]|null
   * @param isKeepPannel: boolean = false
   */
  onPicked(value: ValidDateType, isKeepPannel: boolean = false, valueList: ?any) {//only change input value on picked triggered

    // 要区分是多选还是单选,根据
    if (this.props.isMultiple) {
      const list = valueList ? valueList.slice() : [];

      const txtList = list.map(item => this.dateToStr(item));

      this.setState({
        pickerVisible: isKeepPannel,
        valueList: list,
        text: txtList.join(',')
      });

      this.props.onChange(value, valueList);
      this.context.form && this.context.form.onFieldChange();

    } else {
      let hasChanged = !valueEquals(this.state.value, value)
      this.setState({
        pickerVisible: isKeepPannel,
        value,
        text: this.dateToStr(value)
      })

      if (hasChanged) {
        this.props.onChange(value);
        this.context.form && this.context.form.onFieldChange();
      }
    }
  }

  dateToStr(date: ValidDateType) {
    if (!isValidValue(date)) return ''

    const tdate = date
    const formatter = (
      TYPE_VALUE_RESOLVER_MAP[this.type] ||
      TYPE_VALUE_RESOLVER_MAP['default']
    ).formatter;
    const result = formatter(tdate, this.getFormat(), this.getFormatSeparator());

    return result;
  }

  // (string) => Date | null
  parseDate(dateStr: string): NullableDate {
    if (!dateStr) return null
    const type = this.type;
    const parser = (
      TYPE_VALUE_RESOLVER_MAP[type] ||
      TYPE_VALUE_RESOLVER_MAP['default']
    ).parser;
    return parser(dateStr, this.getFormat(), this.getFormatSeparator());
  }

  getFormat(): string {
    return this.props.format || DEFAULT_FORMATS[this.type]
  }

  propsToState(props: BasePickerProps) {
    const state = {}

    // 分情况：多选或单选
    if (props.isMultiple) {
      // 多选就是一个Date的list
      state.valueList = props.valueList

    } else {
      if (this.isDateValid(props.value)) {
        state.text = this.dateToStr(props.value)
        state.value = props.value
      } else {
        state.text = ''
        state.value = null
      }
    }

    // if (state.value == null) {
    //   state.value = new Date()
    // }

    return state
  }

  triggerClass(): string {
    return this.type.includes('time') ? 'el-icon-time' : 'el-icon-date';
  }

  calcIsShowTrigger() {
    if (this.props.isShowTrigger != null) {
      return !!this.props.isShowTrigger;
    } else {
      return haveTriggerType(this.type);
    }
  }

  handleFocus() {
    this.isInputFocus = true
    if (haveTriggerType(this.type) && !this.state.pickerVisible) {
      this.setState({ pickerVisible: true }, () => {
        this.props.onFocus(this);
      })
    }
  }


  handleBlur() {
    this.isInputFocus = false
    this.props.onBlur(this);
  }

  handleKeydown(evt: SyntheticKeyboardEvent<any>) {
    const keyCode = evt.keyCode;
    // tab
    if (keyCode === 9 || keyCode === 27) {
      this.setState({ pickerVisible: false })
      evt.stopPropagation()
    } else {
      // 禁止用户手动输入
      evt.preventDefault();
    }
  }

  togglePickerVisible() {
    this.setState({
      pickerVisible: !this.state.pickerVisible
    })
  }

  isDateValid(date: ValidDateType) {
    return date == null || isValidValue(date)
  }

  // return true on condition
  //  * input is parsable to date
  //  * also meet your other condition
  isInputValid(value: string): boolean {
    const parseable = this.parseDate(value)
    if (!parseable) {
      return false
    }

    const isdatevalid = this.isDateValid(parseable)
    if (!isdatevalid) {
      return false
    }
    return true
  }

  handleClickOutside(evt: SyntheticEvent<any>) {
    const { value, valueList, pickerVisible } = this.state
    if (!this.isInputFocus && !pickerVisible) {
      return
    }
    if (this.domRoot.contains(evt.target)) return
    if (this.pickerProxy && this.pickerProxy.contains(evt)) return

    // 单选多选分开判断
    if (this.props.isMultiple) {
      this.setState({ pickerVisible: false });
      this.props.onChange(value, valueList);
      this.context.form && this.context.form.onFieldChange();
    } else {
      if (this.isDateValid(value)) {
        this.setState({ pickerVisible: false })
        this.props.onChange(value)
        this.context.form && this.context.form.onFieldChange();
      } else {
        this.setState({ pickerVisible: false, text: this.dateToStr(value) })
      }
    }
  }

  handleClickIcon(e: SyntheticEvent<any>) {
    const { isReadOnly, isDisabled, isAlwaysShowCloseIcon, disabledClose } = this.props
    const { text } = this.state

    if (isReadOnly || isDisabled) return

    if (disabledClose) {
      return;
    }

    this.props.onClearClick && this.props.onClearClick(e);

    if (isAlwaysShowCloseIcon) {
      this.setState({ text: '', value: null, pickerVisible: false })
      this.props.onChange(null)
      this.context.form && this.context.form.onFieldChange();
      return;
    }

    if (!text) {
      this.togglePickerVisible()
    } else {
      this.setState({ text: '', value: null, pickerVisible: false })
      this.props.onChange(null)
      this.context.form && this.context.form.onFieldChange();
    }
  }

  render() {
    const { isReadOnly, placeholder, isDisabled, className, dir, error, isAlwaysShowCloseIcon, disabledClose } = this.props;
    const { pickerVisible, value, text, isShowClose } = this.state;

    const createIconSlot = () => {
      if (this.calcIsShowTrigger()) {

        const cls = isAlwaysShowCloseIcon ? 'el-icon-close' : (isShowClose && !disabledClose) ? 'el-icon-close' : this.triggerClass();

        return (
          <i
            className={this.classNames('el-input__icon', cls)}
            onClick={this.handleClickIcon.bind(this)}
            onMouseEnter={() => {
              if (isReadOnly || isDisabled) return
              if (text) {
                this.setState({ isShowClose: true })
              }
            }}
            onMouseLeave={() => {
              this.setState({ isShowClose: false })
            }}
          ></i>
        )
      } else {
        return null
      }
    }

    const createPickerPanel = () => {
      if (pickerVisible) {
        /* eslint-disable */
        let { placeholder, onFocus, onBlur, onChange, ...others } = this.props
        /* eslint-enable */
        return (
          <MountBody ref={e => this.pickerProxy = e}>
            {
              this.pickerPanel(
                this.state,
                {
                  ...others,
                  ... {
                    getPopperRefElement: () => ReactDOM.findDOMNode(this.refs.inputRoot),
                    popperMixinOption: {
                      placement: PLACEMENT_MAP[this.props.align] || PLACEMENT_MAP.left
                    }
                  }
                }
              )
            }
          </MountBody>
        )
      } else {
        return null
      }
    }

    return (
      <span
        dir={dir}
        className={this.classNames('el-date-editor', className, {
          'is-have-trigger': this.calcIsShowTrigger(),
          'is-active': pickerVisible,
          'is-filled': !!value,
          'is-error': error
        })}

        ref={v => this.domRoot = v}
      >

        <EventRegister
          id={this.clickOutsideId}
          target={document}
          eventName="click"
          func={this.handleClickOutside.bind(this)} />

        <Input
          className={this.classNames(`el-date-editor el-date-editor--${this.type}`)}
          readOnly={isReadOnly}
          disabled={isDisabled}
          type="text"
          placeholder={placeholder}
          onFocus={this.handleFocus.bind(this)}
          onBlur={this.handleBlur.bind(this)}
          onKeyDown={this.handleKeydown.bind(this)}
          onChange={value => {
            const iptxt = value
            const nstate: Object = { text: iptxt }

            if (iptxt.trim() === '' || !this.isInputValid(iptxt)) {
              nstate.value = null
            } else {//only set value on a valid date input
              nstate.value = this.parseDate(iptxt)
            }

            this.setState(nstate)
          }}
          ref="inputRoot"
          value={text}
          icon={createIconSlot()}
        />

        {createPickerPanel()}
      </span>
    )
  }
}


BasePicker.contextTypes = {
  form: PropTypes.any
};
