import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, List, message, Switch, Typography } from 'antd'
import { mainApi } from '@/services'
import { ArrowLeftOutlined, CheckCircleOutlined, ExclamationCircleOutlined, RightOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import _ from 'lodash'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

const TwoStepVerification = (): JSX.Element => {
  const navigator = useNavigate()
  const [data, setData] = useState({
    two_step_enabled: 0,
    two_step_opened_at: null,
    password_changed_at: null,
    two_step_method: []
  })
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    mainApi.getTwoStepConfig().then(res => {
      setData(res.data)
    }).catch(e => {

    })
  }, [])

  const handleBackClick = () => {
    history.go(-1)
  }

  const handleSwitchChange = (checked: any) => {
    setLoading(true)
    mainApi.saveTwostepConfig(checked).then(rs => {
      setLoading(false)
      if (checked) {
        message.success('开启成功')
      } else {
        message.success('关闭成功')
      }
      const newData = rs.data || {}
      setData({ ...data, ...newData })
    }).catch(e => {
      setData({ ...data, two_step_enabled: data.two_step_enabled })
      setLoading(false)
    })
  }

  const showAuthenticator = () => {
    navigator('/settings/security/two-step-verification/authenticator')
  }

  const handleClick = (key: string) => {
    switch (key) {
      case 'authenticator':
        showAuthenticator()
        break
      default:
        break
    }
  }

  const authenticatorSetting: any = _.first(data.two_step_method.filter((it: any) => it.method === 1))

  const dataList = [
    {
      key: 'authenticator',
      title: '身份验证器',
      description: (authenticatorSetting && authenticatorSetting.enabled === 1) ? `添加时间：${authenticatorSetting.opened_at ? dayjs(authenticatorSetting.opened_at).toNow() : '未知'}` : '未添加',
      icon: (authenticatorSetting && authenticatorSetting.enabled === 1) ? <CheckCircleOutlined style={{ color: 'green' }} /> : <ExclamationCircleOutlined style={{ color: 'black' }} />
    }
  ]

  return (<div style={{ minHeight: 600, marginTop: 80, marginLeft: '10%', width: '60%' }}>
    <br />
    <Card
      title={<div style={{ display: 'flex', alignItems: 'center' }}>
        <ArrowLeftOutlined onClick={handleBackClick} style={{ cursor: 'pointer', marginRight: '8px' }} />
        <span>第二个验证步骤</span>
      </div>}
      extra={<div style={{ width: '300px' }}>
        <Switch loading={loading} checkedChildren="开启" unCheckedChildren="关闭" onChange={(checked) => handleSwitchChange(checked)} checked={data.two_step_enabled === 1} defaultChecked={data.two_step_enabled === 1} />
        {data.two_step_enabled === 1 && <Typography.Text style={{ marginLeft: '10px' }}>开启时间:{dayjs(data.two_step_opened_at).format('YYYY年M月D日 HH:mm:ss')}</Typography.Text>}</div>}
    >
      <p>请务必及时更新这些信息并添加更多登录选项，确保您能够始终访问自己的帐号</p>
      <List
        itemLayout="horizontal"
        dataSource={dataList}
        renderItem={(item: any) => (
          <List.Item onClick={() => handleClick(item.key)} style={{ cursor: 'pointer' }}>
            <List.Item.Meta
              avatar={item.icon}
              title={item.title}
              description={item.description}
            />
            <RightOutlined />
          </List.Item>
        )}
      />
    </Card>
  </div>)
}

export default TwoStepVerification
