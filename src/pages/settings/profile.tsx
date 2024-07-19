import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Col, message } from 'antd'
import ChangePasswordForm from './security/ChangePasswordForm'
import { mainApi } from '@/services'
import AccountOptions from './security/AccountOptions'
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import _ from 'lodash'

const Profile = (): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false)
  const [data, setData] = useState({
    two_step_enabled: 0,
    two_step_opened_at: null,
    password_changed_at: null,
    two_step_method: []
  })
  const navigator = useNavigate()

  useEffect(() => {
    mainApi.getTwoStepConfig().then(res => {
      setData(res.data)
    }).catch(e => {

    })
  }, [])

  const changePassword = (currentPassword: string, newPassword: string) => {
    mainApi.changePassword(currentPassword, newPassword).then(rs => {
      if (rs.statusCode === 200) {
        message.info('修改成功')
        setTimeout(function () {
          setShowPassword(false)
        }, 1000)
      } else {
        message.error(rs.message)
      }
    }).catch(e => {
    })
  }

  const showTwoStepVerification = () => {
    navigator('/settings/security/two-step-verification')
  }

  const showAuthenticator = () => {
    navigator('/settings/security/two-step-verification/authenticator')
  }

  const handleClick = (key: string) => {
    switch (key) {
      case 'twoStepVerification':
        showTwoStepVerification()
        break
      case 'password':
        setShowPassword(!showPassword)
        break
      case 'authenticator':
        showAuthenticator()
        break
      default:
        break
    }
  }

  const buildItems = () => {
    const authenticatorSetting: any = _.first(data.two_step_method.filter((it: any) => it.method === 1))
    const diffInDays = dayjs().diff(dayjs(data.password_changed_at), 'day')
    const items = [
      {
        title: '两步验证',
        description: data.two_step_enabled === 1 ? `启用时间：${data.two_step_opened_at ? dayjs(data.two_step_opened_at).format('YYYY年M月D日') : '未知'}` : '未启用',
        icon: data.two_step_enabled === 1 ? <CheckCircleOutlined style={{ color: 'green' }} /> : <ExclamationCircleOutlined style={{ color: 'black' }} />,
        key: 'twoStepVerification'
      },
      {
        title: '密码',
        description: `上次更改时间：${data.password_changed_at ? dayjs(data.password_changed_at).format('YYYY年M月D日') : '未知'}`,
        icon: (diffInDays < 365) ? <CheckCircleOutlined style={{ color: 'green' }} /> : <ExclamationCircleOutlined style={{ color: 'black' }} />,
        key: 'password'
      },
      {
        title: '身份验证器',
        description: (authenticatorSetting && authenticatorSetting.enabled === 1) ? `添加时间：${authenticatorSetting.opened_at ? dayjs(authenticatorSetting.opened_at).format('YYYY年M月D日') : '未知'}` : '未添加',
        icon: (authenticatorSetting && authenticatorSetting.enabled === 1) ? <CheckCircleOutlined style={{ color: 'green' }} /> : <ExclamationCircleOutlined style={{ color: 'black' }} />,
        key: 'authenticator'
      }
    ]
    return items
  }

  const items: any[] = buildItems()

  return (
    <div style={{ minHeight: 600, marginTop: 80, marginLeft: '10%', width: '60%' }}>
      {showPassword && <><Col offset={5} md={15}><ChangePasswordForm onFinish={(values) => {
        changePassword(values.currentPassword, values.newPassword)
      }} onCancel={() => setShowPassword(false)} /></Col></>}

      {!showPassword && <AccountOptions data={items} handleClick={handleClick} />}
    </div >)
}

export default Profile
