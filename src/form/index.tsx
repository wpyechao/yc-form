import * as React from 'react';
import { usePersistFn } from 'yc-hooks';
import { Form as AntdForm } from 'antd'
import { FormProvider } from '../context'
import { TFormInstance } from '../types';
import useForm, { INTERNAL_MARK } from '../use-form';

type TFormProps = {
  form?: TFormInstance
  initialValues?: any
  onSubmit?: (values: any) => void
}

const Form: React.FC<TFormProps> = (props) => {
  const { form, children, onSubmit, initialValues } = props

  const [formInstance] = useForm(form)

  const { 
    subscribe, 
    setInitialValue, 
    setFieldsChanged,
    getFieldChanged,
  } = formInstance.getInternalCallbacks(INTERNAL_MARK)

  const handleSubmit = usePersistFn((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    formInstance.validateFields().then(values => {
      if(onSubmit) {
        onSubmit(values)
      }
    })
  })

  React.useEffect(() => {
    setInitialValue(initialValues)
  }, [initialValues])

  return (
    <FormProvider value={{ subscribe, setInitialValue, setFieldsChanged, getFieldChanged }}>
      <AntdForm onSubmit={handleSubmit}>
        {children}
      </AntdForm>
    </FormProvider>
  )
}

export default Form
