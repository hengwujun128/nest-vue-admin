import { LAYOUT } from '/@/router/constant'

// name->component
export const ROUTE_MAP = {
  Dashboard: LAYOUT,
  Analysis: () => import('/@/views/dashboard/analysis/index.vue'),
  Workbench: () => import('/@/views/dashboard/workbench/index.vue'),

  About: LAYOUT,
  AboutPage: () => import('/@/views/sys/about/index.vue'),
  Charts: LAYOUT,

  BaiduMap: () => import('/@/views/demo/charts/map/Baidu.vue'),
  AMap: () => import('/@/views/demo/charts/map/Gaode.vue'),
  GoogleMap: () => import('/@/views/demo/charts/map/Google.vue'),
  Map: () => import('/@/views/demo/charts/Map.vue'),
  Pie: () => import('/@/views/demo/charts/Pie.vue'),
  Line: () => import('/@/views/demo/charts/Line.vue'),
}
