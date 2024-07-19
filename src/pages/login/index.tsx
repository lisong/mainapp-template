import React, { useRef, useState } from 'react'
import styles from './index.module.less'
import { Button, Form, Input, message } from 'antd'
import { mainApi } from '@/services'
import { LoginVO, Result } from '@/services/types/main'
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile'
import { turnstileSiteKey } from '@/config/config'
import OtpVerify from '@/components/otp'
import { useLocation, useNavigate } from 'react-router-dom'
import { getQueryPrams } from '@/utils/tool'

const layout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  }
}
const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 16
  }
}

const isProduction = process.env.NODE_ENV === 'production'

const Login = (): JSX.Element => {
  const [captcha, setCaptcha] = useState('')
  const [otpOpened, setOtpOpened] = useState(false)
  const [verifyToken, setVerifyToken] = useState<string | null>()

  const turnstileRef = useRef<TurnstileInstance>(null)

  const navigate = useNavigate()
  const location = useLocation()

  const onFinish = (values: { username: string; password: string }) => {
    // Handle form submission here
    const { username, password } = values
    mainApi.login(username, password, captcha).then((res: Result<LoginVO>) => {
      if (res.statusCode === 200) {
        const twoStepEnabled = res.data?.two_step_enabled === 1
        setOtpOpened(twoStepEnabled)
        if (!twoStepEnabled) {
          message.success('登录成功!')
          const query = getQueryPrams(location.search)
          setTimeout(function () {
            if (query.redirect && query.redirect !== '') {
              navigate(query.redirect)
            } else {
              navigate('/')
            }
          }, 1000)
        } else {
          setVerifyToken(res.data?.two_step_token)
        }
      } else {
        message.error(res.message)
      }
    }).catch(error => {
      console.log(error)
    })
  }

  const handleOtpVerify = (code: string) => {
    mainApi.challengeTwoStep(verifyToken ?? '', 1, code).then((res: Result<boolean>) => {
      if (res.statusCode === 200) {
        message.success('验证成功!')
        navigate('/')
      } else {
        message.error(res.message)
      }
    }).catch(error => {
      console.log('challengeTwoStep', error)
    })
  }

  if (otpOpened) {
    return (
      <div className={styles.loginContainer}>
        <OtpVerify separator='' numInputs={6} handleSubmit={handleOtpVerify} />
      </div>
    )
  }

  return (
    <div className={styles.loginContainer}>
      <Form
        {...layout}
        name="basic"
        onFinish={onFinish}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            {
              required: true,
              message: '请输入用户名'
            }
          ]}
        >
          <Input style={{ height: 40 }} />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码'
            }
          ]}
        >
          <Input.Password style={{ height: 40 }} />
        </Form.Item>
        <div style={{ marginBottom: 30 }}>
          {isProduction && <Turnstile ref={turnstileRef} siteKey={`${turnstileSiteKey}`} onSuccess={(token) => setCaptcha(token)} onExpire={() => { setCaptcha('') }} onError={() => { setCaptcha('') }} />}
        </div>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
export default Login
