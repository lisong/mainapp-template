import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Switch,
  Table
} from 'antd'
import { mainApi } from '@/services'

const User = (): JSX.Element => {
  const [params, setParams] = useState<any>({
    total: 0,
    page: 1,
    pageSize: 20
  })
  const [form] = Form.useForm()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState<number>(0)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        mainApi.userCreate(values.username, values.password).then(rs => {
          if (rs.statusCode === 200) {
            setIsModalOpen(false)
            message.success('新建成功')
            setTimeout(function () {
              window.location.reload()
            }, 2000)
          }
        }).catch(e => {

        })
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    mainApi.userList(params).then((res) => {
      setData(res.data.items)
      setParams({
        page: res.data.page,
        pageSize: res.data.pageSize,
        total: res.data.total
      })
    })
  }, [])

  const handleStatus = (userId: number, checked: boolean) => {
    setLoading(userId)
    mainApi.userChange(userId, checked ? 1 : 2).then(rs => {
      setLoading(0)
      setData(data.map(it => {
        if (it.id === userId) {
          return { ...it, status: checked ? 1 : 2 }
        } else {
          return it
        }
      }))
      message.success('成功')
    }).catch(e => {
      setData(data.map(it => {
        if (it.id === userId) {
          return { ...it, status: it.status }
        } else {
          return it
        }
      }))
      setLoading(0)
    })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '状态',
      render(row: any) {
        return <Switch loading={loading === row.id} checkedChildren="开启" onChange={(checked) => handleStatus(row.id, checked)} unCheckedChildren="锁定" checked={row.status === 1} defaultChecked={row.status === 1} />
      }
    },
    {
      title: '操作',
      render(row: any) {
        return (
          <>
            <Button type="link">重置密码</Button>
          </>
        )
      }
    }
  ]
  return (
    <div style={{ minHeight: 600, marginTop: 80, marginLeft: '10%', width: '60%' }}>
      <br />
      <Card
        title={<div style={{ display: 'flex', alignItems: 'center' }}>
          <span>用户管理</span>
        </div>}
        extra={
          <>
            <Button type="link" onClick={showModal}>
              添加用户
            </Button>
          </>
        }
      >
        <Flex wrap gap="small" style={{ marginBottom: '10px' }}>
          <Modal
            title="添加用户"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Form form={form} name="add_user_form">
              <Form.Item
                label="用户名"
                name="username"
                rules={[
                  { required: true, message: '请输入名称' }
                ]}
              >
                <Input autoComplete="off" />
              </Form.Item>

              <Form.Item
                label="初始密码"
                name="password"
                rules={[
                  { required: true, message: '请输入初始密码' }
                ]}
              >
                <Input.Password autoComplete="off" />
              </Form.Item>
            </Form>
          </Modal>
        </Flex>
        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            defaultPageSize: params.pageSize,
            total: params.total,
            onChange: (page, pageSize) => {
              setParams({ ...params, page, pageSize })
            },
            showTotal: (total) => `共${total}条记录 `
          }}
        />
      </Card>
    </div>
  )
}

export default User
