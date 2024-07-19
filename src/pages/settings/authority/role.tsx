import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Col, Divider, Flex, Form, Input, message, Modal, Row, Switch, Table } from 'antd'
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

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState<number>(0)

  const showModal = () => {
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
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleStatus = (roleId: number, checked: boolean) => {
    setLoading(roleId)
    mainApi.roleChange(roleId, checked ? 1 : 2).then(rs => {
      setLoading(0)
      setData(data.map(it => {
        if (it.id === roleId) {
          return { ...it, status: checked ? 1 : 2 }
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
        return <Switch loading={loading === row.id} checkedChildren="开启" onChange={(checked) => handleStatus(row.id, checked)} unCheckedChildren="锁定" checked={row.status === 1} defaultChecked={row.status === 1} />
      }
    },
    {
      title: '操作',
      render(row: any) {
        return (
          <>
            <Button type="link">编辑</Button>
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
            <Button type="link" onClick={showModal}>
              添加角色
            </Button>
          </>
        }
      >
        <Flex wrap gap="small" style={{ marginBottom: '10px' }}>
          <Modal
            title="角色名称"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Form form={form} name="add_role_form">
              <Form.Item
                label="角色名称"
                name="name"
                rules={[
                  { required: true, message: '请填写角色名称' }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="描述"
                name="description"
                rules={[
                  { required: true, message: '请填写描述' }
                ]}
              >
                <TextArea />
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

export default Role
