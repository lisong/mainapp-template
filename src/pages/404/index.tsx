import React from 'react'
import styles from './index.module.less'

const M404 = (): JSX.Element => {
  return (
    <div className={styles.m404}>
      <div className={styles.m404Right}>
        <p className={styles.m404Text}>你访问的内容不存在！</p>
      </div>
    </div>
  )
}
export default M404
