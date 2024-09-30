/* eslint-disable @typescript-eslint/no-unused-vars */
import { BasicColumn, FormSchema } from '/@/components/Table'
import { h } from 'vue'
import { Tag, Tooltip } from 'ant-design-vue'
// import Icon from '@/components/Icon/Icon.vue'

export const columns: BasicColumn[] = [
  {
    title: '菜单ID',
    dataIndex: 'id',
    width: 100,
    fixed: 'left',
  },
  {
    title: '菜单路径',
    dataIndex: 'path',
    width: 180,
    fixed: 'left',
  },
  {
    title: '菜单名称',
    dataIndex: 'name',
    width: 200,
    fixed: 'left',
    align: 'left',
  },
  // {
  //   title: '图标',
  //   dataIndex: 'icon',
  //   width: 50,
  //   customRender: ({ record }) => {
  //     return h(Icon, { icon: record.icon })
  //   },
  // },

  {
    title: '重定向',
    dataIndex: 'redirect',
  },
  {
    title: '元数据',
    dataIndex: 'meta',
    width: '100%',
    ellipsis: true,
    align: 'left',
    customRender({ text }) {
      return h(
        Tooltip,
        {
          title: text,
          placement: 'top',
        },
        () => {
          // return text.slice(0, 10) + '...'
          return text
        },
      )
    },
  },
  {
    title: '父菜单ID',
    dataIndex: 'pid',
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'active',
    width: 80,
    customRender: ({ record }) => {
      const status = record.active
      const enable = ~~status === 1
      const color = enable ? 'green' : 'red'
      const text = enable ? '启用' : '停用'
      return h(Tag, { color: color }, () => text)
    },
  },
  // {
  //   title: '创建时间',
  //   dataIndex: 'createTime',
  //   width: 180,
  // },
]

const isDir = (type: string) => type === '0'
const isMenu = (type: string) => type === '1'
const isButton = (type: string) => type === '2'

// form 通过配置的形式
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '菜单名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '停用', value: 0 },
      ],
    },
    colProps: { span: 8 },
  },
]

// form 通过配置的形式
export const formSchema: FormSchema[] = [
  // {
  //   field: 'type',
  //   label: '菜单类型',
  //   component: 'RadioButtonGroup',
  //   defaultValue: '0',
  //   componentProps: {
  //     options: [
  //       { label: '目录', value: '0' },
  //       { label: '菜单', value: '1' },
  //       { label: '按钮', value: '2' },
  //     ],
  //   },
  //   colProps: { lg: 24, md: 24 },
  // },
  {
    field: 'path',
    label: '菜单路径',
    component: 'Input',
    required: true,
  },
  {
    field: 'name',
    label: '菜单名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'label',
    label: 'Label',
    component: 'Input',
    required: true,
  },
  {
    field: 'redirect',
    label: '重定向地址',
    component: 'Input',
    required: false,
  },
  {
    field: 'meta',
    label: '元数据',
    component: 'Input',
    required: false,
  },
  // TODO: 改成 层级形式, 如何实现自带搜索功能
  {
    field: 'parentMenu',
    label: '上级菜单',
    component: 'TreeSelect',

    componentProps: {
      fieldNames: {
        label: 'label',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'active',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
  },

  // {
  //   field: 'orderNo',
  //   label: '排序',
  //   component: 'InputNumber',
  //   required: true,
  // },
  // {
  //   field: 'icon',
  //   label: '图标',
  //   component: 'IconPicker',
  //   required: true,
  //   ifShow: ({ values }) => !isButton(values.type),
  // },

  // {
  //   field: 'routePath',
  //   label: '路由地址',
  //   component: 'Input',
  //   required: true,
  //   ifShow: ({ values }) => !isButton(values.type),
  // },
  // {
  //   field: 'component',
  //   label: '组件路径',
  //   component: 'Input',
  //   ifShow: ({ values }) => isMenu(values.type),
  // },
  // {
  //   field: 'permission',
  //   label: '权限标识',
  //   component: 'Input',
  //   ifShow: ({ values }) => !isDir(values.type),
  // },

  // {
  //   field: 'isExt',
  //   label: '是否外链',
  //   component: 'RadioButtonGroup',
  //   defaultValue: '0',
  //   componentProps: {
  //     options: [
  //       { label: '否', value: '0' },
  //       { label: '是', value: '1' },
  //     ],
  //   },
  //   ifShow: ({ values }) => !isButton(values.type),
  // },

  // {
  //   field: 'keepalive',
  //   label: '是否缓存',
  //   component: 'RadioButtonGroup',
  //   defaultValue: '0',
  //   componentProps: {
  //     options: [
  //       { label: '否', value: '0' },
  //       { label: '是', value: '1' },
  //     ],
  //   },
  //   ifShow: ({ values }) => isMenu(values.type),
  // },

  // {
  //   field: 'show',
  //   label: '是否显示',
  //   component: 'RadioButtonGroup',
  //   defaultValue: '0',
  //   componentProps: {
  //     options: [
  //       { label: '是', value: '0' },
  //       { label: '否', value: '1' },
  //     ],
  //   },
  //   ifShow: ({ values }) => !isButton(values.type),
  // },
]
