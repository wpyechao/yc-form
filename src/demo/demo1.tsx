import * as React from 'react';
import { Form } from 'antd'
import { Button, Divider, Input } from 'antd';

const marginBottom8: React.CSSProperties = {
  marginBottom: 8
}

export default Form.create()((props: any) => {

  const handleSubmit = (v) => {
    console.log('v :>> ', v);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <div>
        <Button style={marginBottom8} block htmlType="submit">提交</Button>
      </div>
      <Divider />
      {Array(500).fill('').map((_, i) => (
        <Form.Item label={`姓名${i}`} key={i}>
          {props.form.getFieldDecorator(`name${i}`)(<Input />)}
        </Form.Item>
      ))}
    </Form>
  )
})