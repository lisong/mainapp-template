import { lazy } from 'react'

const routes = [
  {
    path: '/',
    component: lazy(() => import('@/pages/welcome')),
    layout: 'main',
    meta: {
      title: '欢迎'
    }
  },
  {
    path: '/login',
    component: lazy(() => import('@/pages/login')),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/authority',
    component: lazy(() => import('@/pages/welcome')),
    layout: 'main',
    meta: {
      title: '系统设置'
    }
  },
  {
    path: '/settings/profile',
    component: lazy(() => import('@/pages/settings/profile')),
    layout: 'main',
    meta: {
      title: '个人设置'
    }
  },
  {
    path: '/settings/authority/user',
    component: lazy(() => import('@/pages/settings/authority/user')),
    layout: 'main',
    meta: {
      title: '用户管理'
    }
  },
  {
    path: '/settings/authority/role',
    component: lazy(() => import('@/pages/settings/authority/role')),
    layout: 'main',
    meta: {
      title: '角色管理'
    }
  },
  {
    path: '/settings/challenge/password',
    component: lazy(() => import('@/pages/settings/challenge/password')),
    layout: 'main',
    meta: {
      title: '密码校验'
    }
  },
  {
    path: '/settings/security/two-step-verification',
    component: lazy(() => import('@/pages/settings/security/two-step-verification')),
    layout: 'main',
    meta: {
      title: '两步验证'
    }
  },
  {
    path: '/settings/security/two-step-verification/authenticator',
    component: lazy(() => import('@/pages/settings/security/two-step-verification/authenticator')),
    layout: 'main',
    meta: {
      title: '身份验证器'
    }
  }
]

export default routes
