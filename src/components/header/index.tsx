import React from 'react'
import styles from './index.module.less'
import RightContent from './rightContent'
import TopMenu from '../top-menu'

interface Props {
  activeKey: string;
  menus: any[];
  onSelect: (key: string) => void;
}

const MainHeader = (props: Props): JSX.Element => {
  const handleClick = (e: any) => {
    props.onSelect && props.onSelect(`${e.key}`)
  }

  const items = (props.menus || []).map((item: { key: string; name: string }) => { return { label: item.name, key: item.key } })
  return <div className={styles.mainHeader}>
    <div className={styles.logo}>CMS</div>
    <div className={styles.headerMenu}>
      <TopMenu theme="dark" mode="horizontal" onClick={handleClick} selectedKeys={[props.activeKey]} items={items} />    </div>
    <RightContent />
  </div>
}

export default MainHeader
