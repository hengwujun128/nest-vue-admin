import { defHttp } from '/@/utils/http/axios'
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel'

import { ErrorMessageMode } from '/#/axios'

enum Api {
  Login = '/auth/login',
  Logout = '/logout',
  GetUserInfo = '/user/info',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
  User = '/user',
}

/**
 * @description: getUserInfo
 */
export function getUserList(params) {
  console.log('用户列表查询参数', params)
  return defHttp.get<GetUserInfoModel>({ url: Api.User, params: params })
}

export function addUser(data): Promise<any> {
  console.log('新增用户参数', data)
  return defHttp.post<GetUserInfoModel>({ url: Api.User, data }, { successMessageMode: 'message' })
}

export function editUser(data): Promise<any> {
  console.log('编辑用户参数', data)
  return defHttp.put<GetUserInfoModel>({ url: Api.User, data }, { successMessageMode: 'message' })
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  )
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' })
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode })
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout })
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  )
}
