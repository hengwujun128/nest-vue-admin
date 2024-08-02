import { LAYOUT, EXCEPTION_COMPONENT } from '/@/router/constant'

// name->component
export const ROUTE_MAP = {
  Dashboard: LAYOUT,
  Analysis: () => import('/@/views/dashboard/analysis/index.vue'),
  Workbench: () => import('/@/views/dashboard/workbench/index.vue'),
  NOT_FOUND: () => EXCEPTION_COMPONENT,
}
