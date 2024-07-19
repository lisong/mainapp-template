import React, { useState } from 'react'
import { Button, Card, Form, Input, Modal, Space, Steps, Typography } from 'antd'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import _ from 'lodash'
import { QRCodeSVG } from 'qrcode.react'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

interface Props {
  qrcode: string;
  secret: string;
  digits: number;
  step?: number,
  loading?: boolean
  open?: boolean;
  type?: number;
  onCancel?: () => void;
  onVerify?: (code: string) => void;
  onChange?: () => void;
  errorMsg?: string;
}

const StepModal = (props: Props): JSX.Element => {
  const [current, setCurrent] = useState(props?.step || 0)

  const [steps, setSteps] = useState<number[]>([0, 2])
  const [code, setCode] = useState<string>('')

  const next = () => {
    const index = _.indexOf(steps, current)
    const tmp = _.nth(steps, index + 1)
    setCurrent(Number(tmp))
  }

  const prev = () => {
    const index = _.indexOf(steps, current)
    const tmp = _.nth(steps, index - 1)
    if (tmp === 0) {
      setSteps([0, 2])
    }
    setCurrent(Number(tmp))
  }

  const cannotScan = () => {
    setSteps([0, 1, 2])
    setCurrent(1)
  }

  const onCancel = () => {
    props?.onCancel && props?.onCancel()
    setCurrent(0)
  }

  const onVerify = () => {
    props?.onVerify && props?.onVerify(code || '')
  }

  const formatString = (input: string) => {
    const chunks = _.chunk(input.split(''), 4)
    return _.join(chunks.map(chunk => chunk.join('')), ' ')
  }

  let title = '设置身份验证器应用'
  if (props?.type === 1) {
    title = '更改身份验证器应用'
  }

  return (<Modal
    loading={props?.loading}
    open={props?.open}
    closable={false}
    footer={<div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        {current > 0 && (
          <Button style={{ width: 80 }} type='link' key="back" onClick={prev}>
            上一步
          </Button>
        )}
      </div>
      <div>
        <Button type='link' key="cancel" onClick={onCancel}>
          取消
        </Button>
        {current !== _.last(steps) &&
          (
            <Button type='link' key="next" onClick={next} style={{ width: 80, marginLeft: 8 }}>
              下一页
            </Button>
          )
        }
        {current === _.last(steps) && (
          <Button type='link' key="submit" onClick={() => { onVerify() }} style={{ width: 80, marginLeft: 8 }}>
            验证
          </Button>
        )}
      </div>
    </div>}
  >
    <Card title={title} styles={{ header: { border: 'none' } }} style={{ height: 400 }}>
      {current === 0 && <>
        {props?.type === 1 && (<p style={{ marginBottom: 20, marginTop: -30 }}>您将无法使用之前的身份验证器获取验证码，也无法使用它为您的 Google 账号进行两步验证</p>)}
        <Typography>
          <Typography.Paragraph>
            <ul>
              <li style={{ listStyleType: 'disc' }}>
                <Typography.Text>在 Google 身份验证器应用中，点按<strong> + </strong></Typography.Text>
              </li>
              <li style={{ listStyleType: 'disc' }}>
                <Typography.Text>选择<strong>扫描二维码</strong></Typography.Text>
              </li>
            </ul>
          </Typography.Paragraph>
        </Typography>
        <br />
        <Space direction="vertical" align="center" style={{ width: '100%', justifyContent: 'center', display: 'flex' }} >
          <QRCodeSVG value={props.qrcode || '-'} />
          <p><Button type='link' onClick={cannotScan}>无法扫描?</Button></p>
        </Space>
      </>}
      {current === 1 && <>
        <Typography>
          <Typography.Paragraph>
            <ul>
              <li style={{ listStyle: 'decimal' }}>
                <Typography.Text>在 Google 身份验证器应用中，依次点击 <strong>+</strong> 和<strong>输入设置密钥</strong></Typography.Text>
              </li>
              <li style={{ listStyle: 'decimal' }}>
                <Typography.Text>输入您的电子邮件地址和以下密钥（空格没有影响）：<br /></Typography.Text>
                <Typography.Text code><strong>{formatString(props.secret)}</strong></Typography.Text>
              </li>
              <li style={{ listStyle: 'decimal' }}>
                <Typography.Text>确保已选择<strong>基于时间</strong></Typography.Text>
              </li>
              <li style={{ listStyle: 'decimal' }}>
                <Typography.Text>点击<strong>添加</strong>完成设置</Typography.Text>
              </li>
            </ul>
          </Typography.Paragraph>
        </Typography>
      </>}
      {current === 2 && <>
        <Space direction="vertical" style={{ width: '100%', display: 'flex' }} >
          <Typography>
            <Typography.Paragraph>
              <Typography.Text>请输入您在该应用中看到的 {props.digits} 位数验证码<br /></Typography.Text>
            </Typography.Paragraph>
          </Typography>
          <Form.Item
            validateStatus={props.errorMsg ? 'error' : ''}
            help={props.errorMsg}
          >
            <Input style={{ height: 40 }} placeholder='请输入验证码' onChange={(e) => {
              setCode(e.target.value)
              props?.onChange && props?.onChange()
            }} />
          </Form.Item>
        </Space>
      </>}
    </Card>
  </Modal >)
}

export default StepModal
