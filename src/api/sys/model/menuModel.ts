import type { RouteMeta } from 'vue-router'

export interface RouteItem {
  path: string
  component: any
  meta: RouteMeta
  name?: string
  alias?: string | string[]
  redirect?: string
  caseSensitive?: boolean
  children?: RouteItem[]
}

export type MenuList = {
  list: RouteItem[]
  page: number
  pageSize: number
  pages?: number
  total: number
}

/**
 * @description: Get menu return value
 */
export type getMenuListResultModel = RouteItem[]
