/**
 * 路由映射: name => component
 */

import { asyncRoutes } from '@/router/routes/index'

const newRoutes = {}
export const generateRouteMap = (routes) => {
  return routes.map((route) => {
    if (route.children && route.children.length) {
      generateRouteMap(route.children)
    }
    newRoutes[route.name] = route.component
  })
}

// 生成路由映射
generateRouteMap(asyncRoutes)
console.log(newRoutes)
export const ROUTES_MAP = newRoutes
