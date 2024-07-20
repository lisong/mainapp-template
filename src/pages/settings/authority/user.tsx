import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Switch,
  Table,
  Typography
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

  const [allRoles, setAllRoles] = useState([])

  const [roleModal, setRoleModal] = useState<any>({
    open: false,
    selectedRoles: [],
    userId: 0
  })

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
    mainApi.roleList({ page: 1, pageSize: 1000 }).then((res) => {
      setAllRoles(res.data?.items || [])
    }).catch((e) => {

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

  const resetPassword = (userId: number) => {
    mainApi.userResetPassword(userId).then(res => {
      Modal.success({
        title: '重置成功',
        content: <><Typography >
          <Typography.Paragraph>
            <Typography.Text>新密码:<Typography.Text code><strong>{res.data}</strong></Typography.Text></Typography.Text>
          </Typography.Paragraph>
        </Typography></>,
        okText: '复制密码',
        onOk() {
          navigator.clipboard.writeText(res.data).then(() => {
            message.success('复制成功')
          }).catch((error) => {
            message.error('复制失败，请重试.')
            console.error('复制错误:', error)
          })
        }
      })
    }).catch(e => {

    })
  }

  const showModifyRole = (userId: number, role: any[]) => {
    setRoleModal({
      ...roleModal,
      open: true,
      userId,
      selectedRoles: role.map((it) => Number(it.role_id))
    })
  }
  const handleSaveRole = () => {
    mainApi.userRoleChange(roleModal.userId, roleModal.selectedRoles).then(res => {
      setData(data.map(it => {
        if (it.id === roleModal.userId) {
          return { ...it, role: res.data || [] }
        } else {
          return it
        }
      }))
    }).catch(e => {

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
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render(roles: any[]) {
        return <p style={{ fontSize: 12 }}>{roles.map((it) => it.name).join(',')}</p>
      }
    },
    {
      title: '状态',
      render(row: any) {
        return <Popconfirm
          title={`确认${row.status !== 1 ? '开启' : '锁定'} `}
          onConfirm={() => handleStatus(row.id, row.status !== 1)}
          onCancel={handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <Switch loading={loading === row.id} checkedChildren="开启" unCheckedChildren="锁定" checked={row.status === 1} />
        </Popconfirm>
      }
    },
    {
      title: '操作',
      render(row: any) {
        return (
          <>
            <Popconfirm
              title={'重置密码？'}
              onConfirm={() => resetPassword(row.id)}
              okText="确认"
              cancelText="取消"
            >
              <Button type="link">重置密码</Button>
            </Popconfirm>
            <Button type="link" onClick={() => { showModifyRole(row.id, row.role) }}>修改角色</Button>
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
        <Flex wrap gap="small" style={{ marginBottom: '10px' }}>
          <Modal
            title="修改用户角色"
            open={roleModal.open}
            onOk={handleSaveRole}
            okText='保存'
            onCancel={() => setRoleModal({ ...roleModal, open: false })}
            styles={{ body: { height: 100 } }}
          >
            <Select
              mode="multiple"
              style={{ width: '70%', marginBottom: 20 }}
              placeholder="选择角色"
              value={roleModal.selectedRoles}
              onChange={(e) => setRoleModal({ ...roleModal, selectedRoles: e })}
            >
              {allRoles.map((role: any) => (
                <Select.Option key={role.id} value={role.id}>{role.name}</Select.Option>
              ))}
            </Select>
            <br />
          </Modal>
        </Flex>
      </Card>
    </div>
  )
}

export default User
