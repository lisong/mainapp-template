const Mock = require('mockjs')

Mock.mock('/admin/auth/profile', 'get', () => {
  return Mock.mock({
    statusCode: 200,
    data: {
      id: 1,
      userName: 'admin'
    },
    message: 'success'
  })
})
