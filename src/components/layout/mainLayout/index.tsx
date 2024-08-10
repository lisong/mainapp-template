import React, { useEffect, useState } from 'react'
import { Layout, Breadcrumb } from 'antd'
import styles from './index.module.less'
import { registerMicroApps, start, initGlobalState, runAfterFirstMounted } from 'qiankun'
import { mainApi } from '@/services'
import { getQueryPrams } from '@/utils/tool'
import config from '@/config/config'
import MainHeader from '@/components/header'
import CustomMenuLeft, { findMenuPath } from '@/components/menu'

const { Sider } = Layout
const LAST_SELECTED_MENU = 'last_selected_menu'

interface Props {
  children?: any;
}

const MainLayout = (props: Props) => {
  const [current, setCurrent] = useState('')
  const [menus, setMenus] = useState<any[]>([])
  const [currentMenuPaths, setCurrentMenuPaths] = useState([])
  const [selectedHeaderMenuKey, setSelectedHeaderMenuKey] = useState('1')

  useEffect(() => {
    registerMicroApps(
      config.qiankun.master.apps,
      {
        beforeLoad: [(app) => Promise.resolve(app.name)],
        beforeMount: [(app) => Promise.resolve(app.name)],
        afterUnmount: [(app) => Promise.resolve(app.name)]
      }
    )

    const { onGlobalStateChange, setGlobalState } = initGlobalState({
      user: 'qiankun'
    })

    onGlobalStateChange((value, prev) => console.log('[onGlobalStateChange - master]:', value, prev))

    setGlobalState({
      ignore: 'master',
      user: {
        name: 'master'
      }
    })

    start({
      sandbox: { strictStyleIsolation: true }, //  主应用与子应用样式隔离
      prefetch: false,
      excludeAssetFilter: (assetUrl) => {
        const whiteList = config.qiankun.excludeAssetWhiteList
        const res = whiteList.find((item) => assetUrl.includes(item))
        return !!res
      },
      singular: false
    })

    getMenuQuery()

    runAfterFirstMounted(() => {
      console.log('[MainApp] first app mounted')
    })
  }, [])

  const getMenuQuery = () => {
    // const cacheMenu = localStorage.getItem('menus')
    // if (cacheMenu) {
    //   setMenus(JSON.parse(cacheMenu))
    //   return
    // }
    mainApi.getMenu().then((res) => {
      if (res.data) {
        // localStorage.setItem('menus', JSON.stringify(res.data.menus))
        setMenus(res.data.menus)
        // if (current) {
        //   const menuPath = findMenuPath(res.data.menus.children, current)
        //   setSelectedHeaderMenuKey(menuPath[0].id)
        //   handleHeaderMenuChange(menuPath[0].id)
        //   handleMenuChange(menuPath)
        // }
      }
    }).catch(error => {
      console.log(error)
    })
  }

  const handleMenuChange = (menuPaths: any) => {
    setCurrentMenuPaths(menuPaths)
    if (menuPaths.length) {
      localStorage.setItem(LAST_SELECTED_MENU, menuPaths[menuPaths.length - 1].id)
    }
  }

  const handleHeaderMenuChange = (key: string) => {
    console.log('handleHeaderMenuChange', key)
    setSelectedHeaderMenuKey(key)
  }

  const query = getQueryPrams()
  const renderBreadcrumb = query.breadcrumb !== '0' && currentMenuPaths.length
  const footerRender = query.footerRender !== '0'
  const headerRender = query.headerRender !== '0'
  return (
    <>
      {headerRender
        ? (
          <MainHeader
            menus={menus.map((item: any) => ({ key: item.id, name: item.name, link: item.link }))}
            onSelect={handleHeaderMenuChange}
            activeKey={selectedHeaderMenuKey}
          />
        )
        : (
          <></>
        )}
      <div style={{ paddingTop: headerRender ? 46 : 0 }} className={styles.mainContent}>
        <Sider
          style={{
            overflow: 'auto',
            height: '100%',
            position: 'fixed',
            left: 0,
            width: 200,
            backgroundColor: '#fff'
          }}
        >
          <CustomMenuLeft
            menus={menus.find((item: any) => String(item.id) === selectedHeaderMenuKey)?.children}
            current={current}
            onMenuChange={handleMenuChange}
          />
        </Sider>
        <div style={{ marginLeft: 200 }} className={styles.mainPageContent}>
          {renderBreadcrumb
            ? (
              <Breadcrumb
                items={currentMenuPaths.map((item: any) => {
                  return { id: item.id, title: item.name }
                })}
                className={styles.breadcrumb}
              />
            )
            : (
              <></>
            )}
          {props?.children}
          <div
            id="subappContainer"
            style={{
              paddingTop: renderBreadcrumb ? 46 + 20 : 20,
              paddingBottom: footerRender ? 34 + 20 : 20
            }}
            className={styles.subappContent}
          />
          {footerRender
            ? (
              <footer className={styles.footer}>后台管理系统 ©2024-{new Date().getFullYear()} Created by xxxx</footer>
            )
            : (
              <></>
            )}
        </div>
      </div>
    </>
  )
}

export default MainLayout
