export interface Result<T = any> {
  data?: T; // 返回数据
  statusCode: number; // code码 200-成功
  message?: any; // 错误信息
}

interface MethodItem {
  method: number;
  prompt: string;
}

export interface LoginVO {
  access_token: boolean; // 临时身份cookie
  two_step_token?: string; // 二次验证临时token
  two_step_enabled?: number; // 是否开启二次验证
  two_step_method?: MethodItem[]; // 开启的二次验证列表
}

export interface UserInfoVO {
  id?: number; // 用户id
  userName?: string; // 用户名
}
