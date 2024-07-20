const Koa = require('koa')
const Router = require('koa-router')
const koaStatic = require('koa-static')
const fs = require('fs')

const app = new Koa({
  proxy: true
})

const router = new Router()

const templatePath = './index.html'
let template = ''
if (fs.existsSync(templatePath)) {
  template = fs.readFileSync(templatePath, 'utf-8')
}

router.all('*', async (ctx) => {
  ctx.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers':
      'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range'
  })
  ctx.body = template
})

// eslint-disable-next-line n/no-path-concat
app.use(koaStatic(__dirname + '/dist/'))

app.use(router.routes()).use(router.allowedMethods())

const port = process.env.PORT || 8001

app.listen(port, '127.0.0.1', () => {
  console.log(`Server listening on http://127.0.0.1:${port}`)
})
