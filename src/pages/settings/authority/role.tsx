import React, { useEffect, useState } from 'react'
import { Button, Card, Flex, Form, Input, message, Modal, Popconfirm, Row, Switch, Table } from 'antd'
import { mainApi } from '@/services'
import TextArea from 'antd/es/input/TextArea'

const Role = (): JSX.Element => {
  const [params, setParams] = useState<any>({
    total: 0,
    page: 1,
    pageSize: 20
  })
  const [data, setData] = useState<any[]>([])

  const [form] = Form.useForm()

  const [modal, setModal] = useState({
    title: ''
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState<number>(0)

  const showModal = ({ title, roleId, name, description }: any) => {
    setModal({ title })
    form.setFieldsValue({ title, roleId, name, description })
    setIsModalOpen(true)
  }

  useEffect(() => {
    mainApi.roleList(params).then((res) => {
      setData(res.data.items)
      setParams({
        page: res.data.page,
        pageSize: res.data.pageSize,
        total: res.data.total
      })
    })
  }, [])

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('values', values)
        if (values.roleId) {
          handleRoleChange(values)
          setIsModalOpen(false)
        } else {
          mainApi.roleCreate(values.name, values.description).then(rs => {
            if (rs.statusCode === 200) {
              setIsModalOpen(false)
              message.success('新建成功')
              setTimeout(function () {
                window.location.reload()
              }, 2000)
            }
          }).catch(e => {

          })
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  const handleCancel = () => {
    form.resetFields()
    setIsModalOpen(false)
  }

  const handleRoleChange = ({ roleId, status, name, description }: any) => {
    setLoading(roleId)
    mainApi.roleChange({ roleId, status, name, description }).then(rs => {
      setLoading(0)
      setData(data.map(it => {
        if (it.id === roleId) {
          return { ...it, ...rs.data }
        } else {
          return it
        }
      }))
      message.success('成功')
    }).catch(e => {
      setData(data.map(it => {
        if (it.id === roleId) {
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
      title: '角色名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: '状态',
      render(row: any) {
        return <Popconfirm
          title={`确认${row.status !== 1 ? '开启' : '锁定'} `}
          onConfirm={() => handleRoleChange({ roleId: row.id, status: (row.status !== 1 ? 1 : 2) })}
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
            <Button type="link" onClick={() => { showModal({ title: '修改角色', roleId: row.id, name: row.name, description: row.description }) }}>编辑</Button>
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
          <span>角色管理</span>
        </div>}
        extra={
          <>
            <Button type="link" onClick={() => { showModal({ title: '添加角色' }) }}>
              添加角色
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
            title={modal.title}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Form form={form} name="role_form">
              <Form.Item name="roleId" initialValue="0" style={{ display: 'none' }}>
                <Input type="hidden" name='roleId' />
              </Form.Item>
              <Form.Item
                label="角色名称"
                name="name"
                rules={[
                  { required: true, message: '请填写角色名称' }
                ]}
              >
                <Input autoComplete="off" />
              </Form.Item>
              <Form.Item
                label="描述"
                name="description"
                rules={[
                  { required: false, message: '请填写描述' }
                ]}
              >
                <TextArea autoComplete="off" />
              </Form.Item>
            </Form>
          </Modal>
        </Flex>
      </Card>
    </div>
  )
}

export default Role
