import React from 'react'
import { createRoot } from 'react-dom/client'
import zhCN from 'antd/lib/locale/zh_CN'
import { ConfigProvider } from 'antd'
import moment from 'moment'
import './index.less'
import Router from './routers/index'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const root = createRoot(document.querySelector('#root')!)
root.render(<ConfigProvider locale={zhCN}>
  <Router />
</ConfigProvider>)
