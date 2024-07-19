import React, { useEffect, useState } from 'react'
import { Button, Card, List, message, Modal } from 'antd'
import { mainApi } from '@/services'
import { ArrowLeftOutlined, CheckCircleOutlined, DeleteOutlined, ExclamationCircleOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import _ from 'lodash'
import StepModal from './StepModel'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

const Authenticator = (): JSX.Element => {
  const [data, setData] = useState<any>({
    enabled: 0,
    opened_at: null,
    method: 1
  })

  const [modal, setModal] = useState({
    step: 0,
    qrcode: '',
    secret: '',
    digits: 6,
    loading: false,
    open: false,
    type: 0,
    errorMsg: ''
  })

  const showModal = (type: number) => {
    setModal({
      ...modal,
      step: 0,
      loading: true,
      open: true,
      type
    })
    mainApi.generateDraftBoxSecret().then(res => {
      setModal({
        ...modal,
        step: 0,
        ...res.data,
        type,
        open: true,
        loading: false
      })
    }).catch(e => {
      setModal({
        ...modal,
        loading: false,
        open: false
      })
    })
  }

  const onVerify = (code: string) => {
    if (code.trim().length !== modal.digits) {
      setModal({ ...modal, errorMsg: 'PIN码无效，请重试' })
      return
    }
    setModal({
      ...modal,
      loading: true
    })
    mainApi.saveTwoStepItemConfig(1, code).then(res => {
      message.success('设置成功')
      setModal({ ...modal, errorMsg: '', open: false, loading: false })
      setData({ ...data, enabled: 1, opened_at: new Date() })
    }).catch(e => {
      setModal({ ...modal, errorMsg: 'PIN码无效，请重试', loading: false })
    })
  }

  useEffect(() => {
    mainApi.getTwoStepItemConfig(1).then(res => {
      setData(res.data)
    }).catch(e => {

    })
  }, [])

  const handleBackClick = () => {
    history.go(-1)
  }

  const handleDelete = () => {
    Modal.confirm({
      title: '移除身份验证器应用？',
      content: '为了能够继续登录并保障账号安全，请先确保您有其他可用的登录选项，然后再移除此选项。',
      okButtonProps: { type: 'link' },
      cancelButtonProps: { type: 'link' },
      onOk() {
        mainApi.deleteTwoStepItemConfig(1).then(res => {
          setData({ ...data, enabled: 2, opened_at: null })
        }).catch(e => {
        })
      },
      onCancel() {
      }
    })
  }

  const dataList = [
    {
      title: '身份验证器',
      description: (data.enabled === 1) ? `添加时间：${data.opened_at ? dayjs(data.opened_at).toNow() : '未知'}` : '未添加',
      icon: (data && data.enabled === 1) ? <CheckCircleOutlined style={{ color: 'green' }} /> : <ExclamationCircleOutlined style={{ color: 'black' }} />
    }
  ]

  return (<div style={{ minHeight: 600, marginTop: 80, marginLeft: '10%', width: '60%' }}>
    <br />
    <Card
      title={<div style={{ display: 'flex', alignItems: 'center' }}>
        <ArrowLeftOutlined onClick={handleBackClick} style={{ cursor: 'pointer', marginRight: '8px' }} />
        <span>“身份验证器”应用</span>
      </div>}
    >
      <p>您将通过身份验证器应用获取验证码，而无需等待短信。即使您的手机处于离线状态，该应用也能正常运行</p>
      <p>首先，从 <a target='_blank' href='https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2'>Google Play 商店</a>或者 <a target='_blank' href='https://apps.apple.com/us/app/google-authenticator/id388497605'>iOS App Store</a> 中下载 Google 身份验证器</p>
      {data.enabled !== 1 && <Button
        onClick={() => showModal(0)}
        size='large' shape='round' type="primary" icon={<PlusOutlined />} style={{
          marginTop: '10px',
          backgroundColor: 'white',
          borderColor: 'gray',
          color: '#1677ff'
        }}>设置身份验证器</Button>}
      {data.enabled === 1 && <Card
        style={{ marginTop: 20 }}
        styles={{ header: { borderBottom: 'none' } }}
        title={
          <span>您的身份验证器</span>
        }>
        <List
          itemLayout="horizontal"
          dataSource={dataList}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={item.icon}
                title={item.title}
                description={item.description}
              />
              <DeleteOutlined onClick={handleDelete} style={{ fontSize: '22px', cursor: 'pointer', paddingRight: '30px' }} />
            </List.Item>
          )}
        />
        <Button onClick={() => showModal(1)} type="link" >更改身份验证器应用</Button>
      </Card>}
      <StepModal
        {...modal}
        onCancel={() => {
          setModal({
            ...modal,
            step: 0,
            open: false
          })
        }}
        onVerify={onVerify}
        onChange={() => {
          setModal({
            ...modal,
            errorMsg: ''
          })
        }}
      />
    </Card>
  </div >)
}

export default Authenticator
