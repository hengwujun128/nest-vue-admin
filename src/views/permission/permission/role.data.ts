import { BasicColumn, FormSchema } from '/@/components/Table'
// import { h } from 'vue'
// import { Switch } from 'ant-design-vue'
// import { setRoleStatus } from '/@/api/demo/system'
// import { useMessage } from '/@/hooks/web/useMessage'

export const columns: BasicColumn[] = [
  {
    title: '权限ID',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '权限key',
    dataIndex: 'key',
    // width: 180,
  },
  {
    title: '权限名称',
    dataIndex: 'name',
    // width: 200,
  },

  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '权限名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  // {
  //   field: 'status',
  //   label: '状态',
  //   component: 'Select',
  //   componentProps: {
  //     options: [
  //       { label: '启用', value: '1' },
  //       { label: '停用', value: '0' },
  //     ],
  //   },
  //   colProps: { span: 8 },
  // },
]

export const formSchema: FormSchema[] = [
  {
    field: 'key',
    label: '权限key',
    required: true,
    component: 'Input',
  },
  {
    field: 'name',
    label: '权限名称',
    required: true,
    component: 'Input',
  },

  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
]
