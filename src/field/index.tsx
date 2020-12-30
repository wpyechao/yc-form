import classnames from 'classnames'
import Form, { FormItemProps } from 'antd/lib/form'
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form'
import * as React from 'react'
import { usePersistFn } from 'yc-hooks'
import { useFormContext } from '../context'
import { TValidateStatus } from '../types'
import Validator from 'async-validator'
import { Transition } from 'react-transition-group';

export interface IFieldProps extends FormItemProps, 
Omit<GetFieldDecoratorOptions, 'getValueProps' | 'normalize' | 'preserve' | 'trigger'> {
  name: string
}

const ExplainStyle: React.CSSProperties = {
  transition: 'all .2s',
  position: 'absolute',
  left: 0,
  right: 0,
}

const Field: React.FC<IFieldProps> = (props) => {
  const {
    name,
    // fieldKey,
    // hidden = false,
    className,
    children,
    /** getFieldDecorator options */
    valuePropName = 'value',
    getValueFromEvent = defaultGetValueFromEvent,
    initialValue: initialValueFromItem,
    validateTrigger = 'onChange',
    rules,
    validateFirst = true,
    /** getFieldDecorator options */
    ...restProps
  } = props;

  const { subscribe, setFieldsChanged, getFieldChanged, setInitialValue } = useFormContext()

  const [validateStatus, setValidateStatus] = React.useState<TValidateStatus>('success')

  const [explain, setExplain] = React.useState<string>(void 0)

  const [state, setState] = React.useState(void 0)

  const validatorTriggers = React.useMemo(() => {
    return [].concat(validateTrigger)
  }, [validateTrigger])

  const triggerHandlers = React.useMemo(() => {
    return validatorTriggers.filter(i => i !== 'onChange').reduce((res, trigger) => {
      return {
        ...res,
        [trigger]: (e: any) => {
          const value = getValueFromEvent(e)
          validate(value)
        }
      }
    }, {})
  }, [validatorTriggers])

  React.useEffect(() => {
    const changed = getFieldChanged(name)
    if(!changed) {
      setInitialValue({ [name]: initialValueFromItem })
    }
  }, [initialValueFromItem])

  React.useEffect(() => {
    const unsubscribe = subscribe({
      name,
      state,
      setState
    })

    return () => {
      unsubscribe()
    }
  }, [state])

  /** onChange的时候 收集表单值 */
  const handleCollect = usePersistFn((e: React.ChangeEvent<HTMLInputElement> | any) => {
    const value = getValueFromEvent(e)
    setFieldsChanged(name, true)
  
    setState(value)

    if(validatorTriggers.includes('onChange')) {
      validate(value)
    }
  })

  const validate = usePersistFn((value: any) => {
    setFieldsChanged(name, true)
    const validator = new Validator({
      [name]: rules || []
    })

    validator.validate({ [name]: value }).then(() => {
      setValidateStatus('success')
    }).catch(({ errors }) => {
      setExplain(() => {
        if(validateFirst) {
          return errors[0]?.message
        }
        return errors.map(error => error.message).join(' ')
      })
      setValidateStatus('error')
    })
  })

  const classNames = classnames(className, {
    'has-success': validateStatus === 'success',
    'has-warning': validateStatus === 'warning',
    'has-error': validateStatus === 'error',
    'is-validating':  validateStatus === 'validating',
  })

  const renderExplain = () => {
    const transitionStyles = {
      entering: { transform: 'translateY(-5px)', opacity: '0'},
      entered:  { transform: 'translateY(0)', opacity: '1' },
      exiting: { transform: 'translateY(0)', opacity: '1'},
      exited: { transform: 'translateY(-5px)', opacity: '0'}
    }
    return (
      <Transition in={validateStatus === 'error'} timeout={200}>
        {state => (
          <div style={{...ExplainStyle, ...transitionStyles[state]}} className="ant-form-explain">
            {explain}
          </div>
        )}
      </Transition>
    )
  }

  return (
    <Form.Item className={classNames} {...restProps}>
      {React.cloneElement(children as React.ReactElement, {
        id: name,
        onChange: handleCollect,
        [valuePropName]: state,
        ...triggerHandlers
      })}
      {renderExplain()}
    </Form.Item>
  )
}

export default React.memo(Field)

function defaultGetValueFromEvent(e: any) {
  if (!e || !e.target) {
    return e;
  }
  const { target } = e;
  return target.type === 'checkbox' ? target.checked : target.value;
}