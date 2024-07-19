import React from 'react'
import { createRoot } from 'react-dom/client'
import zhCN from 'antd/lib/locale/zh_CN'
import { ConfigProvider } from 'antd'
import moment from 'moment'
import './index.less'
import Router from './routers/index'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

interface Props {
  container?: any
}

let root: any = null

function render(props: any) {
  const { container } = props
  root = createRoot(container ? container.querySelector('#root') : document.querySelector('#root'))
  root.render(<ConfigProvider locale={zhCN}>
    <Router />
  </ConfigProvider>)
}

if (!window.__POWERED_BY_QIANKUN__) {
  render({})
}

export async function bootstrap(): Promise<void> {
  console.log('react app bootstraped')
}

export async function mount(props: Props): Promise<void> {
  console.log('props from main framework', props)
  render(props)
}

export async function unmount(): Promise<void> {
  if (root != null) {
    root.unmount()
  }
}
