import React, { useState } from 'react'
import styles from './index.module.less'
interface Props {
  theme: string;
  mode: string
  selectedKeys: any[],
  items: any[];
  onClick: (item: any) => void;
}

const TopMenu = (props: Props): JSX.Element => {
  const handleClick = (e: any) => {
    props.onClick && props.onClick(e)
  }

  // return <Menu theme="dark" mode="horizontal" onClick={handleClick} selectedKeys={props.selectedKeys} items={props.items} />

  return (
    <div className={styles.topMenu}>
      <ul>
        {props.items.map((item: any) => (
          <li key={item.key} className={props.selectedKeys.includes(String(item.key)) ? styles.selected : ''}>
            <span role={'button'}
              tabIndex={0}
              onClick={() => { handleClick(item) }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleClick(item)
                }
              }} >{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TopMenu
