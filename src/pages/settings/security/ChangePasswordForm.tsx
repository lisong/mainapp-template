import React from 'react'
import { Form, Input, Button, Col, Card } from 'antd'
import { ArrowLeftOutlined, LockOutlined } from '@ant-design/icons'

interface Props {
  onCancel: () => void;
  onFinish: (values: any) => void;
}

const ChangePasswordForm = (props: Props) => {
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values)
    // 在这里处理密码修改逻辑，例如发送请求到服务器
    props?.onFinish(values)
  }

  const onCancel = () => {
    form.resetFields() // 重置表单字段
    // 你也可以在这里添加其他取消操作，比如导航到其他页面
    props?.onCancel()
  }

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ArrowLeftOutlined onClick={props.onCancel} style={{ cursor: 'pointer', marginRight: '8px' }} />
          <span>修改账号密码</span>
        </div>
      }
    >
      <Form
        form={form}
        name="change_password"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="currentPassword"
          label="当前密码"
          rules={[{ required: true, message: '请输入当前密码!' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="当前密码"
          />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[
            { required: true, message: '请输入新密码!' },
            { min: 6, message: '密码至少6位!' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="新密码"
          />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="确认新密码"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: '请确认新密码!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('两次输入的密码不一致!'))
              }
            })
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="确认新密码"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            修改密码
          </Button>
          <Button type="default" onClick={onCancel} style={{ marginLeft: '10px' }}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default ChangePasswordForm
