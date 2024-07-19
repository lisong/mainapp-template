import React from 'react'
import { Tag } from 'antd'

interface Props {
  state: number
}

const StatusLabel = (props: Props): JSX.Element => {
  switch (props?.state) {
    case 1:
      return <Tag color="green">正常</Tag>
    case 2:
      return <Tag color="grey">锁定</Tag>
    default:
      return <Tag color="red">未知</Tag>
  }
}

export default StatusLabel
