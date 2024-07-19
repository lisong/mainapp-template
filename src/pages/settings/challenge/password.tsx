import React, { useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { getQueryPrams } from '@/utils/tool'
import { mainApi } from '@/services'
import { Result } from '@/services/types/main'
import OtpVerify from '@/components/otp'

const Password = (): JSX.Element => {
  const [form] = Form.useForm()
  const location = useLocation()
  const navigate = useNavigate()
  const [otpOpened, setOtpOpened] = useState(false)
  const [verifyToken, setVerifyToken] = useState<string | null>()

  const goto = () => {
    const query = getQueryPrams(location.search)
    setTimeout(function () {
      if (query.redirect && query.redirect !== '') {
        navigate(query.redirect, { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    }, 1000)
  }

  const onFinish = (values: any) => {
    mainApi.challengePwd(values.currentPassword).then(res => {
      message.success('验证成功')
      if (res.statusCode === 200) {
        const twoStepEnabled = res.data?.two_step_enabled === 1
        setOtpOpened(twoStepEnabled)
        if (!twoStepEnabled) {
          message.success('登录成功!')
          goto()
        } else {
          setVerifyToken(res.data?.two_step_token)
        }
      } else {
        message.error(res.message)
      }
    }).catch(e => {

    })
  }

  const onCancel = () => {
    form.resetFields()
    goto()
  }

  const handleOtpVerify = (code: string) => {
    mainApi.challengeTwoStep(verifyToken ?? '', 1, code).then((res: Result<boolean>) => {
      if (res.statusCode === 200) {
        message.success('验证成功!')
        goto()
      } else {
        message.error(res.message)
      }
    }).catch(error => {
      console.log('challengeTwoStep', error)
    })
  }

  if (otpOpened) {
    return (
      <div style={{ minHeight: 600, marginTop: 80, marginLeft: '10%', width: '50%' }}>
        <OtpVerify separator='' numInputs={6} handleSubmit={handleOtpVerify} />
      </div>
    )
  }

  return (
    <div style={{ minHeight: 600, marginTop: 80, marginLeft: '10%', width: '60%' }}>
      <br />
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 12 }}
        form={form}
        style={{ maxWidth: 600 }}
        name="change_password"
        onFinish={onFinish}
      >
        <Form.Item
          name="currentPassword"
          label="当前密码"
          rules={[{ required: true, message: '请输入当前密码!' }]}
        >
          <Input.Password style={{ height: 40 }} prefix={<LockOutlined />} placeholder="当前密码" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 12 }}>
          <Button type="primary" htmlType="submit">
            确认
          </Button>
          <Button
            type="default"
            onClick={onCancel}
            style={{ marginLeft: '10px' }}
          >
            取消
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Password
