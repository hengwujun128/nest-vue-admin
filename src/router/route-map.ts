// import { LAYOUT } from '/@/router/constant'
import { asyncRoutes } from './routes/index'
// name->component
// export const ROUTE_MAP = {
//   Dashboard: LAYOUT,
//   Analysis: () => import('/@/views/dashboard/analysis/index.vue'),
//   Workbench: () => import('/@/views/dashboard/workbench/index.vue'),

//   About: LAYOUT,
//   AboutPage: () => import('/@/views/sys/about/index.vue'),
//   Charts: LAYOUT,

//   BaiduMap: () => import('/@/views/demo/charts/map/Baidu.vue'),
//   AMap: () => import('/@/views/demo/charts/map/Gaode.vue'),
//   GoogleMap: () => import('/@/views/demo/charts/map/Google.vue'),
//   Map: () => import('/@/views/demo/charts/Map.vue'),
//   Pie: () => import('/@/views/demo/charts/Pie.vue'),
//   Line: () => import('/@/views/demo/charts/Line.vue'),
// }

// refactor : nenerate route map by function

const newRoutes = {}
const generateRouteMap = (routes) => {
  routes.forEach((route) => {
    newRoutes[route.name] = route.component

    if (route.children && route.children.length) {
      generateRouteMap(route.children)
    }
    newRoutes[route.name] = route.component
  })
}

generateRouteMap(asyncRoutes)
export const ROUTE_MAP = newRoutes
// console.log('dynamicly generate route map: ', ROUTE_MAP)
