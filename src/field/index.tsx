import { Input } from 'antd'
import Form, { FormItemProps } from 'antd/lib/form'
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form'
import * as React from 'react'
import { usePersistFn } from 'yc-hooks'
import { useFormContext } from '../context'

export interface IFieldProps extends FormItemProps, GetFieldDecoratorOptions {
  name: string
}

const Field: React.FC<IFieldProps> = (props) => {
  const {
    name,
    // fieldKey,
    // hidden = false,
    children,
    // noStyle = false,
    /** getFieldDecorator options */
    getValueProps,
    normalize,
    valuePropName = 'value',
    trigger = 'onChange',
    getValueFromEvent = defaultGetValueFromEvent,
    initialValue: initialValueFromItem,
    validateTrigger = 'onChange',
    rules,
    validateFirst = false,
    preserve,
    /** getFieldDecorator options */
    ...restProps
  } = props;

  const { subscribe, setFieldsChanged, getFieldChanged } = useFormContext()

  const [state, setState] = React.useState(void 0)

  React.useEffect(() => {
    const changed = getFieldChanged(name)
    if(!changed) {
      setState(initialValueFromItem)
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

  const handleChange = usePersistFn((e: React.ChangeEvent<HTMLInputElement> | any) => {
    const value = getValueFromEvent(e)

    setFieldsChanged(name, true)

    setState(value)
  })

  return (
    <Form.Item {...restProps}>
      {React.cloneElement(children as React.ReactElement, {
        [valuePropName]: state,
        [trigger]: handleChange
      })}
    </Form.Item>
  )
}

export default Field

function defaultGetValueFromEvent(e: any) {
  if (!e || !e.target) {
    return e;
  }
  const { target } = e;
  return target.type === 'checkbox' ? target.checked : target.value;
}