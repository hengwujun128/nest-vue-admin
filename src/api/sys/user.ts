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
  Role = '/role',
  RoleMenu = '/role/role_menu',
  Permission = '/permission',
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

export function deleteUser(id): Promise<any> {
  console.log('删除用户参数', id)
  return defHttp.delete<GetUserInfoModel>({ url: `/user/${id}` }, { successMessageMode: 'message' })
}

/* -------------------------------------------------------------------------- */
/*                                    权限先关                                  */
/* -------------------------------------------------------------------------- */

export const getPermissionList = (params = {}) => {
  console.log('权限列表查询参数', params)
  return defHttp.get({ url: Api.Permission, params })
}
export const addPermission = (data = {}) => {
  console.log('新增权限参数', data)
  return defHttp.post({ url: Api.Permission, data }, { successMessageMode: 'message' })
}

export const editPermission = (data = {}) => {
  console.log('编辑权限参数', data)
  return defHttp.put({ url: Api.Permission, data }, { successMessageMode: 'message' })
}

export const deletePermission = (id) => {
  console.log('删除角色参数', id)
  return defHttp.delete({ url: `${Api.Permission}/${id}` }, { successMessageMode: 'message' })
}

/* -------------------------------------------------------------------------- */
/*                                    角色相关                                 */
/* -------------------------------------------------------------------------- */

export function getRoleList(params = {}) {
  console.log('角色列表查询参数', params)
  return defHttp.get({ url: Api.Role, params })
}

export function addRole(data): Promise<any> {
  console.log('新增角色参数', data)
  return defHttp.post({ url: Api.Role, data }, { successMessageMode: 'message' })
}

export function editRole(data): Promise<any> {
  console.log('编辑角色参数', data)
  return defHttp.put({ url: Api.Role, data }, { successMessageMode: 'message' })
}

export function deleteRole(id): Promise<any> {
  console.log('删除角色参数', id)
  return defHttp.delete({ url: `/role/${id}` }, { successMessageMode: 'message' })
}

// 获取角色菜单接口
// 该接口也是前端权限控制的依据，根据当前用户的角色，展示对应的菜单
export const getRoleMenusByRoleId = (roleId) => {
  console.log('根据角色ID 获取角色菜单', roleId)
  return defHttp.get({ url: Api.RoleMenu, params: { roleId: roleId } })
}

// 删除角色菜单
export const deleteRoleMenuByRoleId = (roleId) => {
  console.log('删除角色菜单', roleId)
  return defHttp.delete({ url: Api.RoleMenu, data: { roleId: roleId } })
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
