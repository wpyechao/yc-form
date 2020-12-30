import * as React from 'react';
import Form, { useForm, Field } from '..'
import { Button, Divider, Input } from 'antd';

const marginBottom8: React.CSSProperties = {
  marginBottom: 8
}

export default () => {

  const [form] = useForm()

  const [initialValue, setInitialValue] = React.useState({})

  const handleSubmit = (v) => {
    console.log('v :>> ', v);
  }

  const setFields = () => {
    form.setFieldsValue({
      name2: 'asdads',
      name3: 'dkdkdkadwd128',
      name4: 'kjansdkjnad'
    })
  }

  const getField = () => {
    console.log(form.getFieldValue('name2'))
  }

  const resetFields = () => {
    form.resetFields()
  }

  const toggleInitialValue = () => {
    setInitialValue({ 
      name1: Date.now().toString(), 
      name2: Date.now().toString() 
    })
  }

  const [ini, set] = React.useState(void 0)
  React.useEffect(() => {
    setTimeout(() => {
      set('pingyechao')
    }, 1000);
  }, [])

  return (
    <Form initialValues={initialValue} form={form} onSubmit={handleSubmit}>
      <div>
        <Button style={marginBottom8} block htmlType="submit">提交</Button>
        <Button style={marginBottom8} block onClick={setFields}>set fields</Button>
        <Button style={marginBottom8} block onClick={getField}>get field value</Button>
        <Button style={marginBottom8} block onClick={resetFields}>reset fields</Button>
        <Button style={marginBottom8} block onClick={toggleInitialValue}>toggle initialValue</Button>
      </div>
      <Divider />
      <Field label={`姓名`} name={`name`} initialValue={ini} rules={[{ required: true }]}>
        <Input />
      </Field>
      <Field label={`blur trigger`} name={`a`} validateTrigger="onBlur" rules={[{ required: true }, { len: 5 }]}>
        <Input />
      </Field>
      {Array(1000).fill('').map((_, i) => (
        <Field label={`姓名${i}`} key={i} name={`name${i}`}>
          <Input />
        </Field>
      ))}
    </Form>
  )
}