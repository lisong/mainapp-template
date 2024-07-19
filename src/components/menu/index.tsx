import React, { useState } from 'react'
import { Menu } from 'antd'
import { useNavigate } from 'react-router-dom'

interface MenuField {
  id: string;
  name: string;
  link: string;
  icon: string;
  children: MenuField[];
}

interface Props {
  current: string;
  menus: any[];
  onMenuChange: (paths: []) => void;
}

// 此组件的意义就是将数据抽离出来，通过传递数据去渲染
const CustomMenuLeft = (props: Props): JSX.Element => {
  const navigate = useNavigate()

  const [openKeys, setOpenKeys] = useState([])
  const [selectedKeys, setSelectedKeys] = useState<any>([])

  const onOpenChange = (openKeys: any) => {
    setOpenKeys(openKeys)
  }

  const handleMenuClick = (key: string | number) => {
    setSelectedKeys([key])
    const menuPaths = findMenuPath(props.menus, key)
    props.onMenuChange(menuPaths)
    if (menuPaths.length > 0 && menuPaths[menuPaths.length - 1].link !== '') {
      navigate(menuPaths[menuPaths.length - 1].link)
    }
  }

  const buildMenuItem = (item: any) => {
    const children = item?.children?.map((child: any) => buildMenuItem(child)) ?? []
    return {
      key: item.id,
      label: item.name,
      children: children.length > 0 ? children : null
    }
  }

  const items = props.menus?.map((item: any) => { return buildMenuItem(item) })
  return (
    <Menu
      mode="vertical"
      onOpenChange={onOpenChange}
      onClick={({ key }) => handleMenuClick(key)}
      openKeys={openKeys}
      selectedKeys={selectedKeys}
      style={{ height: '100%' }}
      items={items}
    />
  )
}

export const findMenuPath = (menus: MenuField[], key: string | number): any => {
  let ret: MenuField[] = []
  const step = (
    menus: MenuField[],
    targetKey: string | number,
    menuPaths: MenuField[]
  ): boolean => {
    let findRet = false
    for (const item of menus) {
      if (String(item.id) === String(targetKey)) {
        menuPaths.push(item)
        ret = menuPaths
        return true
      }
      if (item.children && item.children.length) {
        menuPaths.push(item)
        findRet = step(item.children, targetKey, menuPaths)
        if (findRet) {
          break
        } else {
          menuPaths.pop()
        }
      }
    }
    return findRet
  }
  step(menus, key, [])
  return ret
}

export default CustomMenuLeft
