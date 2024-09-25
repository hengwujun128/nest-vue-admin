import { defHttp } from '/@/utils/http/axios'
import { getMenuListResultModel, RouteItem } from './model/menuModel'

enum Api {
  GetMenuList = '/getMenuList',
  GetActiveMenus = '/menu/active',
  Menu = '/menu',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defHttp.get<getMenuListResultModel>({ url: Api.Menu })
}

// 获取菜单接口
export const getActiveMenus = () => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetActiveMenus })
}

// 新增菜单
export const createMenu = (params: RouteItem) => {
  return defHttp.post({ url: Api.Menu, data: params }, { successMessageMode: 'message' })
}

// 编辑菜单
export const updateMenu = (params: RouteItem) => {
  return defHttp.put({ url: Api.Menu, data: params }, { successMessageMode: 'message' })
}

// 删除菜单
export const deleteMenu = (id) => {
  return defHttp.delete({ url: `${Api.Menu}/${id}` }, { successMessageMode: 'message' })
}
