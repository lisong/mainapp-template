import React, { useEffect, useState } from 'react'
import { Dropdown, Modal } from 'antd'
import styles from './rightContent.module.less'
import { mainApi } from '@/services'
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

interface UserInfo {
  name: string;
  id: number;
}

const RightContent = (): JSX.Element => {
  const [userInfo, updateUserInfo] = useState<UserInfo>({ name: '', id: 1 })
  const [date, setDate] = useState(new Date().getHours())
  const [welcomeMsg, setWelcomeMsg] = useState('')

  const navigator = useNavigate()
  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date().getHours())
    }, 1000 * 60 * 10)
    if (date < 12) {
      setWelcomeMsg('上午好')
    } else if (date >= 12 && date <= 19) {
      setWelcomeMsg('下午好')
    } else {
      setWelcomeMsg('晚上好')
    }
    return () => {
      clearInterval(interval)
    }
  }, [])

  const logoutConfirm = () => {
    localStorage.removeItem('menu')
    Modal.confirm({
      title: '确定退出登录吗?',
      content: '',
      okText: '',
      okType: 'primary',
      cancelText: '取消',
      onOk: () => {
        mainApi.logout().then(() => {
          window.location.replace('/login')
        })
      },
      onCancel: () => {
        console.log('Cancel')
      }
    })
  }
  const onMenuClick = ({ key }: any) => {
    if (key === 'logout') {
      logoutConfirm()
    } else if (key === 'settings') {
      navigator('/settings/profile')
    }
  }

  const getUserProfileQuery = () => {
    mainApi.getUserProfile().then((res: any) => {
      updateUserInfo(res.data || { name: '', id: '' })
      localStorage.setItem('userInfo', JSON.stringify(res.data || { name: '', id: '' }))
    }).catch(error => {
      console.log(error)
    })
  }

  useEffect(() => {
    getUserProfileQuery()
  }, [])

  return (
    <div className={styles.headerList}>
      <Dropdown menu={{ items: [{ icon: <SettingOutlined />, label: '个人设置', key: 'settings' }, { icon: <LogoutOutlined />, label: '退出登录', key: 'logout' }], onClick: onMenuClick }} >
        <span>{welcomeMsg}，{userInfo.name}</span>
      </Dropdown>
    </div>
  )
}

export default RightContent
