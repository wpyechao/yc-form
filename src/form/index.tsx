import * as React from 'react';
import { usePersistFn } from 'yc-hooks';
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
    getFieldsChanged,
    setFieldsChanged,
  } = formInstance.getInternalCallbacks(INTERNAL_MARK)

  const handleSubmit = usePersistFn((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const values = formInstance.getFieldsValue()
    onSubmit?.(values)
  })

  React.useEffect(() => {
    const fieldChanged = getFieldsChanged()

    if(!fieldChanged) {
      setInitialValue(initialValues)
    }
  }, [initialValues])

  return (
    <FormProvider value={{ subscribe, setFieldsChanged, }}>
      <form onSubmit={handleSubmit}>
        {children}
      </form>
    </FormProvider>
  )
}

export default Form
