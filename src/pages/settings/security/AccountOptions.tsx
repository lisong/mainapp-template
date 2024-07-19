import React from 'react'
import { Card, List, Avatar, Button } from 'antd'
import { RightOutlined } from '@ant-design/icons'

interface Props {
  data: any[];
  handleClick: (key: string) => void;
}

const AccountOptions = (props: Props) => {
  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>您的帐号登录选项</span>
        </div>
      }
    >
      <p>请务必及时更新这些信息，确保您始终能够访问自己的帐号</p>
      <List
        itemLayout="horizontal"
        dataSource={props.data}
        renderItem={item => (
          <List.Item onClick={() => props.handleClick(item.key)} style={{ cursor: 'pointer' }}>
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
  )
}

export default AccountOptions
