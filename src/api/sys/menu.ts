import { defHttp } from '/@/utils/http/axios'
import { getMenuListResultModel, RouteItem } from './model/menuModel'

enum Api {
  GetMenuList = '/getMenuList',
  // GetAllMenus = '/menu',
  GetActiveMenus = '/menu/active',
  CreateMenu = '/menu',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList })
}

// 获取菜单接口
export const getActiveMenus = () => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetActiveMenus })
}

// 新增菜单
export const createMenu = (params: RouteItem) => {
  return defHttp.post({ url: Api.CreateMenu, data: params }, { successMessageMode: 'message' })
}

// 编辑菜单
export const updateMenu = (params: RouteItem) => {
  return defHttp.put({ url: Api.CreateMenu, data: params }, { successMessageMode: 'message' })
}
