import * as React from 'react';
import Form from '../form'
import Field from '../field'
import useForm from '../use-form';
import { Button, Divider } from 'antd';

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
      name3: 'asdads',
      name4: 'dkdkdkadwd128',
      name5: 'kjansdkjnad'
    })
  }

  const getField = () => {
    console.log(form.getFieldValue('name2'))
  }

  const toggleInitialValue = () => {
    setInitialValue({ 
      name1: Date.now().toString(), 
      name2: Date.now().toString() 
    })
  }

  return (
    <Form initialValues={initialValue} form={form} onSubmit={handleSubmit}>
      <div>
        <Button style={marginBottom8} block htmlType="submit">提交</Button>
        <Button style={marginBottom8} block onClick={setFields}>set fields</Button>
        <Button style={marginBottom8} block onClick={getField}>get field value</Button>
        <Button style={marginBottom8} block onClick={toggleInitialValue}>toggle initialValue</Button>
      </div>
      <Divider />
      {Array(1000).fill('').map((_, i) => (
        <Field key={i} name={`name${i}`} />
      ))}
    </Form>
  )
}