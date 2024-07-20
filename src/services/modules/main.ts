import { AxiosResponse } from 'axios'
import request from '../request'
import { LoginVO, Result, UserInfoVO } from '../types/main'

export function getMenu (): Promise<any> {
  return request.get('/admin/menu', { })
}

export function getUserProfile () : Promise<Result<UserInfoVO>> {
  return request.get('/admin/auth/profile')
}

export function login (username:string, password:string, captcha:string) : Promise<Result<LoginVO>> {
  return request.post('/admin/auth/login', { username, password, captcha })
}

export function logout () : Promise<Result<LoginVO>> {
  return request.get('/admin/auth/logout')
}

export function challengeTwoStep (token:string, method:number, code:string) : Promise<Result<boolean>> {
  return request.post(`/admin/auth/challenge/two-step?token=${token}`, { method, code })
}

export function csrfToken () : Promise<Result<any>> {
  return request.get('/admin/csrf/token')
}

export function changePassword (currentPassword:string, newPassword:string) : Promise<Result<boolean>> {
  return request.post('/admin/security/password/change', { currentPassword, newPassword })
}

export function saveTwostepConfig (two_step_enabled:boolean) : Promise<Result<boolean>> {
  return request.post('/admin/security/two-step/config', { two_step_enabled })
}

export function saveTwoStepItemConfig (method:number, verifyCode:string) : Promise<Result<boolean>> {
  return request.post('/admin/security/two-step/item/config', { method, enabled: 1, verifyCode })
}

export function deleteTwoStepItemConfig (method:number) : Promise<Result<boolean>> {
  return request.post('/admin/security/two-step/item/config', { method, enabled: 2 })
}

export function getTwoStepItemConfig (method:number) : Promise<Result<any>> {
  return request.get('/admin/security/two-step/item/config', { params: { method } })
}

export function generateDraftBoxSecret () : Promise<Result<any>> {
  return request.post('/admin/security/two-step/totp/draft-box-secret')
}

export function profile () : Promise<Result<any>> {
  return request.get('/admin/auth/profile')
}

export function challengePwd (password:string) : Promise<Result<any>> {
  return request.post('/admin/auth/challenge/pwd', { password })
}

export function userList (params:any) : Promise<Result<any>> {
  return request.get('/admin/authority/user/list', { params })
}

export function roleList (params:any) : Promise<Result<any>> {
  return request.get('/admin/authority/role/list', { params })
}

export function userCreate (username:string, password:string) : Promise<Result<any>> {
  return request.post('/admin/authority/user/create', { username, password })
}

export function userChange (userId:number, status:number) : Promise<Result<any>> {
  return request.post('/admin/authority/user/change', { userId, status })
}

export function roleCreate (name:string, description:string) : Promise<Result<any>> {
  return request.post('/admin/authority/role/create', { name, description })
}

export function roleChange ({ roleId, status, name, description }:any) : Promise<Result<any>> {
  return request.post('/admin/authority/role/change', { roleId, status, name, description })
}

export function getTwoStepConfig () : Promise<Result<any>> {
  return request.get('/admin/auth/config/list')
}
