export const turnstileSiteKey = '0x4AAAAAAABBYYY_xxxxxxx' // 线上使用真实的 cf turnstile 替换

export default {
  qiankun: {
    master: {
      apps: [
          {
            name: 'sub-articles',
            entry: 'http://127.0.0.1:3002/subapp/articles',
            container: '#subappContainer',
            activeRule: '/articles'
          }
      ]
    },
    excludeAssetWhiteList: []
  }
}
