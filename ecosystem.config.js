const packageInfo = require('./package.json')
const name = packageInfo.name
module.exports = {
  apps: [{
    name,
    cwd: `/opt/web/${name}/dist/`,
    script: 'server.js',
    exec_mode: 'cluster',
    instances: 2,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    out_file: '/opt/log/pm2.log',
    error_file: '/opt/log/pm2-error.log',
    merge_logs: true,
    combine_logs: true
  }]
}
