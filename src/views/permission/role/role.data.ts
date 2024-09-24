import { unref, Ref } from 'vue'
import { BasicColumn, FormSchema } from '/@/components/Table'

export const columns: BasicColumn[] = [
  {
    title: '角色ID',
    dataIndex: 'id',
  },
  {
    title: '角色名称',
    dataIndex: 'name',
  },

  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'roleNme',
    label: '角色名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: '1' },
        { label: '停用', value: '0' },
      ],
    },
    colProps: { span: 8 },
  },
]

export const formSchema: FormSchema[] = [
  {
    field: 'name',
    label: '角色名称',
    required: true,
    component: 'Input',
  },

  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
  {
    label: ' ',
    field: 'menu',
    slot: 'menu',
    component: 'Input',
  },
  {
    label: ' ',
    field: 'permission',
    slot: 'permission',
    component: 'Input',
  },
]

// refactor: formSchema 改造, 由数组改造成函数
export function getFormSchemas(isUpdate: Ref<boolean>): FormSchema[] {
  return [
    {
      field: 'name',
      label: '角色名称',
      required: true,
      component: 'Input',
      // TIPS: 控制 组件是否显示
      ifShow: (value) => {
        console.log(value)
        return !unref(isUpdate)
      },
      // TIPS: 表单字段禁用时，控制组件是否禁用
      componentProps: {
        disabled: unref(isUpdate),
      },
    },

    {
      label: '备注',
      field: 'remark',
      component: 'InputTextArea',
    },
    {
      label: ' ',
      field: 'menu',
      slot: 'menu',
      component: 'Input',
    },
  ]
}
