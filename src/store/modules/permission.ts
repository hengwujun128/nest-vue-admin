/* eslint-disable @typescript-eslint/no-unused-vars */
import type { AppRouteRecordRaw, Menu } from '/@/router/types'

import { defineStore } from 'pinia'
import { store } from '/@/store'
import { useI18n } from '/@/hooks/web/useI18n'
import { useUserStore } from './user'
import { useAppStoreWithOut } from './app'
import { toRaw } from 'vue'
import { transformObjToRoute, flatMultiLevelRoutes } from '/@/router/helper/routeHelper'
import { transformRouteToMenu } from '/@/router/helper/menuHelper'

import projectSetting from '/@/settings/projectSetting'

import { PermissionModeEnum } from '/@/enums/appEnum'

// 前端路由表
import { asyncRoutes } from '/@/router/routes'
import { ERROR_LOG_ROUTE, PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic'

import { filter } from '/@/utils/helper/treeHelper'

import { getMenuList, getActiveMenus } from '/@/api/sys/menu'
import { getPermCode } from '/@/api/sys/user'

import { useMessage } from '/@/hooks/web/useMessage'
import { PageEnum } from '/@/enums/pageEnum'
import { ROUTE_MAP } from '@/router/route-map'

interface PermissionState {
  // Permission code list
  // 权限代码列表
  permCodeList: string[] | number[]
  // Whether the route has been dynamically added
  // 路由是否动态添加
  isDynamicAddedRoute: boolean
  // To trigger a menu update
  // 触发菜单更新
  lastBuildMenuTime: number
  // Backstage menu list
  // 后台菜单列表
  backMenuList: Menu[]
  // 菜单列表
  frontMenuList: Menu[]
}

/* ---------------------------- 用户权限用过 store 来处理 ---------------------------- */
export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    // 权限代码列表
    permCodeList: [],
    // Whether the route has been dynamically added
    // 路由是否动态添加
    isDynamicAddedRoute: false,
    // To trigger a menu update
    // 触发菜单更新
    lastBuildMenuTime: 0,
    // Backstage menu list
    // 后台菜单列表
    backMenuList: [],
    // menu List
    // 菜单列表
    frontMenuList: [],
  }),
  getters: {
    getPermCodeList(state): string[] | number[] {
      return state.permCodeList
    },
    getBackMenuList(state): Menu[] {
      return state.backMenuList
    },
    getFrontMenuList(state): Menu[] {
      return state.frontMenuList
    },
    getLastBuildMenuTime(state): number {
      return state.lastBuildMenuTime
    },
    getIsDynamicAddedRoute(state): boolean {
      return state.isDynamicAddedRoute
    },
  },
  actions: {
    setPermCodeList(codeList: string[]) {
      this.permCodeList = codeList
    },

    setBackMenuList(list: Menu[]) {
      this.backMenuList = list
      list?.length > 0 && this.setLastBuildMenuTime()
    },

    setFrontMenuList(list: Menu[]) {
      this.frontMenuList = list
    },

    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime()
    },

    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added
    },
    resetState(): void {
      this.isDynamicAddedRoute = false
      this.permCodeList = []
      this.backMenuList = []
      this.lastBuildMenuTime = 0
    },
    async changePermissionCode() {
      const codeList = await getPermCode()
      this.setPermCodeList(codeList)
    },

    // 构建路由-基于角色构建前端路由（动态路由）-场景: 登录之后, 刷新页面, 重置
    async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
      const { t } = useI18n()
      const userStore = useUserStore()
      const appStore = useAppStoreWithOut()

      let routes: AppRouteRecordRaw[] = []
      const roleList = toRaw(userStore.getRoleList) || []
      // 权限模式, 三种,
      const { permissionMode = projectSetting.permissionMode } = appStore.getProjectConfig

      // 路由过滤器 在 函数filter 作为回调传入遍历使用
      const routeFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route
        // 抽出角色
        const { roles } = meta || {}
        if (!roles) return true
        // 进行角色权限判断(判断当前用户角色是否存在路由角色列表中)
        return roleList.some((role) => roles.includes(role))
      }

      const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route
        // ignoreRoute 为true 则路由仅用于菜单生成，不会在实际的路由表中出现
        const { ignoreRoute } = meta || {}
        // arr.filter 返回 true 表示该元素通过测试
        return !ignoreRoute
      }

      /**
       * @description 根据设置的首页path，修正routes中的affix标记（固定首页）
       * */
      const patchHomeAffix = (routes: AppRouteRecordRaw[]) => {
        if (!routes || routes.length === 0) return
        let homePath: string = userStore.getUserInfo.homePath || PageEnum.BASE_HOME

        function patcher(routes: AppRouteRecordRaw[], parentPath = '') {
          if (parentPath) parentPath = parentPath + '/'
          routes.forEach((route: AppRouteRecordRaw) => {
            const { path, children, redirect } = route
            const currentPath = path.startsWith('/') ? path : parentPath + path
            if (currentPath === homePath) {
              if (redirect) {
                homePath = route.redirect! as string
              } else {
                route.meta = Object.assign({}, route.meta, { affix: true })
                throw new Error('end')
              }
            }
            children && children.length > 0 && patcher(children, currentPath)
          })
        }

        try {
          patcher(routes)
        } catch (e) {
          // 已处理完毕跳出循环
        }
        return
      }
      /* -------------------------------------------------------------------------- */
      /*                              基于前端路由名称和组件映射的改造                   */
      /* -------------------------------------------------------------------------- */
      /* ------------------------------ 后端下发 routes 改造 start ------------------------ */
      let backendRouteList: AppRouteRecordRaw[] = []
      // console.log(JSON.stringify(asyncRoutes))
      // backendRouteList = asyncRoutes // 模拟后端下发的路由列表

      const menuListToMenuRoutes = (menuList) => {
        const menuRoutes: AppRouteRecordRaw[] = []
        menuList.forEach((menu) => {
          if (menu.meta) {
            try {
              menu.meta = JSON.parse(menu.meta)
            } catch (e) {
              console.log(e)
            }
          }

          if (menu.pid === 0) {
            menuRoutes.push(menu)
          } else {
            const parentMenu = menuList.find((m) => m.id === menu.pid)
            // 父菜单如果不存在,说明父菜单被禁用(API在查询时候直接过滤掉了),则其下的子菜单也不显示
            if (parentMenu) {
              if (!parentMenu.children) {
                parentMenu.children = []
              }
              parentMenu.children.push(menu)
            }
          }
        })
        return menuRoutes
      }
      const getAllMenuData = () => {
        return getActiveMenus().then((data) => {
          console.log('---原始 menu---', data)
          return menuListToMenuRoutes(data)
        })
      }

      const wrapperRouteComponent = (routes) => {
        return routes.map((route) => {
          route.component = ROUTE_MAP[route.name]
          if (route.children && route.children.length > 0) {
            route.children = wrapperRouteComponent(route.children)
          }

          return route
        })
      }

      const parseRouteRoles = (routes) => {
        return routes.map((route) => {
          route.component = ROUTE_MAP[route.name]
          if (route?.meta?.roles) {
            try {
              route.meta.roles = JSON.parse(route.meta.roles)
            } catch (e) {
              console.log(e)
              route.meta.roles = []
            }
          }
          if (route.children && route.children.length > 0) {
            route.children = parseRouteRoles(route.children)
          }

          return route
        })
      }
      // 抽离 page not found,数组开始插入一个元素
      const addPageNotFoundAtFirst = (routes) => {
        routes.unshift(PAGE_NOT_FOUND_ROUTE)
        return routes
      }
      try {
        // 获取菜单并转化成前端路由
        const backendRouteData = await getAllMenuData()
        console.log('---backendRouteData---', backendRouteData)
        backendRouteList = backendRouteData
        // backendRouteList = wrapperRouteComponent(backendRouteList)
        // 解析
        backendRouteList = parseRouteRoles(backendRouteList)
        backendRouteList = addPageNotFoundAtFirst(backendRouteList)
        console.log('---finalbackendRouteData---', backendRouteList)
      } catch (e) {
        console.log(e)
      }

      //
      // backendRouteList = asyncRoutes
      /* ------------------------------ 后端下发 routes 改造 end ------------------------------ */
      // TIPS:
      switch (permissionMode) {
        // 角色权限
        case PermissionModeEnum.ROLE:
          // 对非一级路由进行过滤
          routes = filter(backendRouteList, routeFilter)
          // 对一级路由根据角色权限过滤
          routes = routes.filter(routeFilter)
          // Convert multi-level routing to level 2 routing
          // 将多级路由转换为 2 级路由
          routes = flatMultiLevelRoutes(routes)
          break

        // 路由映射， 默认进入该case
        case PermissionModeEnum.ROUTE_MAPPING:
          // 对非一级路由进行过滤(根据用户信息角色,过滤出菜单上的路由)
          routes = filter(backendRouteList, routeFilter)
          // 对一级路由再次根据角色权限过滤
          routes = routes.filter(routeFilter)
          // 将路由转换成菜单
          const menuList = transformRouteToMenu(routes, true)
          // 移除掉 ignoreRoute: true 的路由 非一级路由
          routes = filter(routes, routeRemoveIgnoreFilter)
          // 移除掉 ignoreRoute: true 的路由 一级路由；
          routes = routes.filter(routeRemoveIgnoreFilter)
          // 对菜单进行排序
          menuList.sort((a, b) => {
            return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0)
          })

          // 设置菜单列表
          this.setFrontMenuList(menuList)

          // Convert multi-level routing to level 2 routing
          // 将多级路由转换为 2 级路由(为了显示菜单)
          routes = flatMultiLevelRoutes(routes)
          break

        //  If you are sure that you do not need to do background dynamic permissions, please comment the entire judgment below
        //  如果确定不需要做后台动态权限，请在下方注释整个判断
        case PermissionModeEnum.BACK:
          const { createMessage } = useMessage()

          createMessage.loading({
            content: t('sys.app.menuLoading'),
            duration: 1,
          })

          // !Simulate to obtain permission codes from the background,
          // 模拟从后台获取权限码，
          // this function may only need to be executed once, and the actual project can be put at the right time by itself
          // 这个功能可能只需要执行一次，实际项目可以自己放在合适的时间
          let routeList: AppRouteRecordRaw[] = []
          try {
            await this.changePermissionCode()
            routeList = (await getMenuList()) as AppRouteRecordRaw[]
          } catch (error) {
            console.error(error)
          }

          // Dynamically introduce components
          // 动态引入组件
          routeList = transformObjToRoute(routeList)

          //  Background routing to menu structure
          //  后台路由到菜单结构
          const backMenuList = transformRouteToMenu(routeList)
          this.setBackMenuList(backMenuList)

          // remove meta.ignoreRoute item
          // 删除 meta.ignoreRoute 项
          routeList = filter(routeList, routeRemoveIgnoreFilter)
          routeList = routeList.filter(routeRemoveIgnoreFilter)

          routeList = flatMultiLevelRoutes(routeList)
          routes = [PAGE_NOT_FOUND_ROUTE, ...routeList]
          break
      }

      routes.push(ERROR_LOG_ROUTE)
      patchHomeAffix(routes)
      return routes
    },
  },
})

// Need to be used outside the setup
// 需要在设置之外使用
export function usePermissionStoreWithOut() {
  return usePermissionStore(store)
}
