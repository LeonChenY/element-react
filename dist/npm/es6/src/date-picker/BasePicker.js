import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _createClass from 'babel-runtime/helpers/createClass';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import ReactDOM from 'react-dom';

import { PropTypes, Component } from '../../libs';
import { EventRegister } from '../../libs/internal';

import Input from '../input';
import { PLACEMENT_MAP, HAVE_TRIGGER_TYPES, TYPE_VALUE_RESOLVER_MAP, DEFAULT_FORMATS } from './constants';
import { Errors, require_condition, IDGenerator } from '../../libs/utils';
import { MountBody } from './MountBody';


var idGen = new IDGenerator();
var haveTriggerType = function haveTriggerType(type) {
  return HAVE_TRIGGER_TYPES.indexOf(type) !== -1;
};

var isValidValue = function isValidValue(value) {
  if (value instanceof Date) return true;
  if (Array.isArray(value) && value.length !== 0 && value[0] instanceof Date) return true;
  return false;
};

// only considers date-picker's value: Date or [Date, Date]
var valueEquals = function valueEquals(a, b) {
  var aIsArray = Array.isArray(a);
  var bIsArray = Array.isArray(b);

  var isEqual = function isEqual(a, b) {
    // equal if a, b date is equal or both is null or undefined
    var equal = false;
    if (a && b) equal = a.getTime() === b.getTime();else equal = a === b && a == null;
    return equal;
  };

  if (aIsArray && bIsArray) {
    return isEqual(a[0], b[0]) && isEqual(a[1], b[1]);
  }
  if (!aIsArray && !bIsArray) {
    return isEqual(a, b);
  }
  return false;
};

var BasePicker = function (_Component) {
  _inherits(BasePicker, _Component);

  _createClass(BasePicker, null, [{
    key: 'propTypes',
    get: function get() {
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
        value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.arrayOf(PropTypes.instanceOf(Date))]),
        valueList: PropTypes.array, // 多选
        isMultiple: PropTypes.bool, // 是否开启多选
        dir: PropTypes.string,
        error: PropTypes.bool,
        isAlwaysShowCloseIcon: PropTypes.bool, // 控制是否一直显示关闭按钮,默认值false，不是一直显示关闭按钮
        disabledClose: PropTypes.bool // 控制时间选择关闭按钮是否禁用,默认值为false，不禁用
      };
    }
  }, {
    key: 'defaultProps',
    get: function get() {
      return {
        value: new Date(),
        isMultiple: false,
        // (thisReactElement)=>Unit
        onFocus: function onFocus() {},
        onBlur: function onBlur() {},

        dir: 'ltr',
        error: false,
        isAlwaysShowCloseIcon: false,
        disabledClose: false,
        valueList: []
      };
    }
  }]);

  function BasePicker(props, _type) {
    var state = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, BasePicker);

    require_condition(typeof _type === 'string');

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.type = _type; // type need to be set first
    _this.state = Object.assign({}, state, {
      pickerVisible: false
    }, _this.propsToState(props));

    _this.clickOutsideId = 'clickOutsideId_' + idGen.next();
    return _this;
  }

  // ---: start, abstract methods
  // (state, props)=>ReactElement


  BasePicker.prototype.pickerPanel = function pickerPanel(state, props) {
    throw new Errors.MethodImplementationRequiredError(props);
  };

  BasePicker.prototype.getFormatSeparator = function getFormatSeparator() {
    // return undefined
    return this.props.rangeSeparator;
  };
  // ---: end, abstract methods

  BasePicker.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.setState(this.propsToState(nextProps));
  };

  /**
   * onPicked should only be called from picker pannel instance
   * and should never return a null date instance
   *
   * @param value: Date|Date[]|null
   * @param isKeepPannel: boolean = false
   */


  BasePicker.prototype.onPicked = function onPicked(value) {
    var _this2 = this;

    var isKeepPannel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var valueList = arguments[2];
    //only change input value on picked triggered

    // 要区分是多选还是单选,根据
    if (this.props.isMultiple) {
      var list = valueList ? valueList.slice() : [];

      var txtList = list.map(function (item) {
        return _this2.dateToStr(item);
      });

      this.setState({
        pickerVisible: isKeepPannel,
        valueList: list,
        text: txtList.join(',')
      });

      this.props.onChange(value, valueList);
      this.context.form && this.context.form.onFieldChange();
    } else {
      var hasChanged = !valueEquals(this.state.value, value);
      this.setState({
        pickerVisible: isKeepPannel,
        value: value,
        text: this.dateToStr(value)
      });

      if (hasChanged) {
        this.props.onChange(value);
        this.context.form && this.context.form.onFieldChange();
      }
    }
  };

  BasePicker.prototype.dateToStr = function dateToStr(date) {
    if (!isValidValue(date)) return '';

    var tdate = date;
    var formatter = (TYPE_VALUE_RESOLVER_MAP[this.type] || TYPE_VALUE_RESOLVER_MAP['default']).formatter;
    var result = formatter(tdate, this.getFormat(), this.getFormatSeparator());

    return result;
  };

  // (string) => Date | null


  BasePicker.prototype.parseDate = function parseDate(dateStr) {
    if (!dateStr) return null;
    var type = this.type;
    var parser = (TYPE_VALUE_RESOLVER_MAP[type] || TYPE_VALUE_RESOLVER_MAP['default']).parser;
    return parser(dateStr, this.getFormat(), this.getFormatSeparator());
  };

  BasePicker.prototype.getFormat = function getFormat() {
    return this.props.format || DEFAULT_FORMATS[this.type];
  };

  BasePicker.prototype.propsToState = function propsToState(props) {
    var state = {};

    // 分情况：多选或单选
    if (props.isMultiple) {
      // 多选就是一个Date的list
      state.valueList = props.valueList;
    } else {
      if (this.isDateValid(props.value)) {
        state.text = this.dateToStr(props.value);
        state.value = props.value;
      } else {
        state.text = '';
        state.value = null;
      }
    }

    // if (state.value == null) {
    //   state.value = new Date()
    // }

    return state;
  };

  BasePicker.prototype.triggerClass = function triggerClass() {
    return this.type.includes('time') ? 'el-icon-time' : 'el-icon-date';
  };

  BasePicker.prototype.calcIsShowTrigger = function calcIsShowTrigger() {
    if (this.props.isShowTrigger != null) {
      return !!this.props.isShowTrigger;
    } else {
      return haveTriggerType(this.type);
    }
  };

  BasePicker.prototype.handleFocus = function handleFocus() {
    var _this3 = this;

    this.isInputFocus = true;
    if (haveTriggerType(this.type) && !this.state.pickerVisible) {
      this.setState({ pickerVisible: true }, function () {
        _this3.props.onFocus(_this3);
      });
    }
  };

  BasePicker.prototype.handleBlur = function handleBlur() {
    this.isInputFocus = false;
    this.props.onBlur(this);
  };

  BasePicker.prototype.handleKeydown = function handleKeydown(evt) {
    var keyCode = evt.keyCode;
    // tab
    if (keyCode === 9 || keyCode === 27) {
      this.setState({ pickerVisible: false });
      evt.stopPropagation();
    } else {
      // 禁止用户手动输入
      evt.preventDefault();
    }
  };

  BasePicker.prototype.togglePickerVisible = function togglePickerVisible() {
    this.setState({
      pickerVisible: !this.state.pickerVisible
    });
  };

  BasePicker.prototype.isDateValid = function isDateValid(date) {
    return date == null || isValidValue(date);
  };

  // return true on condition
  //  * input is parsable to date
  //  * also meet your other condition


  BasePicker.prototype.isInputValid = function isInputValid(value) {
    var parseable = this.parseDate(value);
    if (!parseable) {
      return false;
    }

    var isdatevalid = this.isDateValid(parseable);
    if (!isdatevalid) {
      return false;
    }
    return true;
  };

  BasePicker.prototype.handleClickOutside = function handleClickOutside(evt) {
    var _state = this.state,
        value = _state.value,
        valueList = _state.valueList,
        pickerVisible = _state.pickerVisible;

    if (!this.isInputFocus && !pickerVisible) {
      return;
    }
    if (this.domRoot.contains(evt.target)) return;
    if (this.pickerProxy && this.pickerProxy.contains(evt)) return;

    // 单选多选分开判断
    if (this.props.isMultiple) {
      this.setState({ pickerVisible: false });
      this.props.onChange(value, valueList);
      this.context.form && this.context.form.onFieldChange();
    } else {
      if (this.isDateValid(value)) {
        this.setState({ pickerVisible: false });
        this.props.onChange(value);
        this.context.form && this.context.form.onFieldChange();
      } else {
        this.setState({ pickerVisible: false, text: this.dateToStr(value) });
      }
    }
  };

  BasePicker.prototype.handleClickIcon = function handleClickIcon(e) {
    var _props = this.props,
        isReadOnly = _props.isReadOnly,
        isDisabled = _props.isDisabled,
        isAlwaysShowCloseIcon = _props.isAlwaysShowCloseIcon,
        disabledClose = _props.disabledClose;
    var text = this.state.text;


    if (isReadOnly || isDisabled) return;

    if (disabledClose) {
      return;
    }

    this.props.onClearClick && this.props.onClearClick(e);

    if (isAlwaysShowCloseIcon) {
      this.setState({ text: '', value: null, pickerVisible: false });
      this.props.onChange(null);
      this.context.form && this.context.form.onFieldChange();
      return;
    }

    if (!text) {
      this.togglePickerVisible();
    } else {
      this.setState({ text: '', value: null, pickerVisible: false });
      this.props.onChange(null);
      this.context.form && this.context.form.onFieldChange();
    }
  };

  BasePicker.prototype.render = function render() {
    var _this4 = this;

    var _props2 = this.props,
        isReadOnly = _props2.isReadOnly,
        placeholder = _props2.placeholder,
        isDisabled = _props2.isDisabled,
        className = _props2.className,
        dir = _props2.dir,
        error = _props2.error,
        isAlwaysShowCloseIcon = _props2.isAlwaysShowCloseIcon,
        disabledClose = _props2.disabledClose;
    var _state2 = this.state,
        pickerVisible = _state2.pickerVisible,
        value = _state2.value,
        text = _state2.text,
        isShowClose = _state2.isShowClose;


    var createIconSlot = function createIconSlot() {
      if (_this4.calcIsShowTrigger()) {

        var cls = isAlwaysShowCloseIcon ? 'el-icon-close' : isShowClose && !disabledClose ? 'el-icon-close' : _this4.triggerClass();

        return React.createElement('i', {
          className: _this4.classNames('el-input__icon', cls),
          onClick: _this4.handleClickIcon.bind(_this4),
          onMouseEnter: function onMouseEnter() {
            if (isReadOnly || isDisabled) return;
            if (text) {
              _this4.setState({ isShowClose: true });
            }
          },
          onMouseLeave: function onMouseLeave() {
            _this4.setState({ isShowClose: false });
          }
        });
      } else {
        return null;
      }
    };

    var createPickerPanel = function createPickerPanel() {
      if (pickerVisible) {
        /* eslint-disable */
        var _props3 = _this4.props,
            _placeholder = _props3.placeholder,
            onFocus = _props3.onFocus,
            onBlur = _props3.onBlur,
            onChange = _props3.onChange,
            others = _objectWithoutProperties(_props3, ['placeholder', 'onFocus', 'onBlur', 'onChange']);
        /* eslint-enable */


        return React.createElement(
          MountBody,
          { ref: function ref(e) {
              return _this4.pickerProxy = e;
            } },
          _this4.pickerPanel(_this4.state, _extends({}, others, {
            getPopperRefElement: function getPopperRefElement() {
              return ReactDOM.findDOMNode(_this4.refs.inputRoot);
            },
            popperMixinOption: {
              placement: PLACEMENT_MAP[_this4.props.align] || PLACEMENT_MAP.left
            }
          }))
        );
      } else {
        return null;
      }
    };

    return React.createElement(
      'span',
      {
        dir: dir,
        className: this.classNames('el-date-editor', className, {
          'is-have-trigger': this.calcIsShowTrigger(),
          'is-active': pickerVisible,
          'is-filled': !!value,
          'is-error': error
        }),

        ref: function ref(v) {
          return _this4.domRoot = v;
        }
      },
      React.createElement(EventRegister, {
        id: this.clickOutsideId,
        target: document,
        eventName: 'click',
        func: this.handleClickOutside.bind(this) }),
      React.createElement(Input, {
        className: this.classNames('el-date-editor el-date-editor--' + this.type),
        readOnly: isReadOnly,
        disabled: isDisabled,
        type: 'text',
        placeholder: placeholder,
        onFocus: this.handleFocus.bind(this),
        onBlur: this.handleBlur.bind(this),
        onKeyDown: this.handleKeydown.bind(this),
        onChange: function onChange(value) {
          var iptxt = value;
          var nstate = { text: iptxt };

          if (iptxt.trim() === '' || !_this4.isInputValid(iptxt)) {
            nstate.value = null;
          } else {
            //only set value on a valid date input
            nstate.value = _this4.parseDate(iptxt);
          }

          _this4.setState(nstate);
        },
        ref: 'inputRoot',
        value: text,
        icon: createIconSlot()
      }),
      createPickerPanel()
    );
  };

  return BasePicker;
}(Component);

export default BasePicker;


BasePicker.contextTypes = {
  form: PropTypes.any
};