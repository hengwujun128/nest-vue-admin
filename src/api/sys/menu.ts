import { defHttp } from '/@/utils/http/axios'
import { getMenuListResultModel } from './model/menuModel'

enum Api {
  GetMenuList = '/getMenuList',
  GetAllMenus = '/menu',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList })
}

// 获取菜单接口
export const getAllMenus = () => {
  return defHttp.get({ url: Api.GetAllMenus })
}
