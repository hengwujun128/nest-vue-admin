/* eslint-disable @typescript-eslint/no-unused-vars */
import { BasicColumn, FormSchema } from '/@/components/Table'
import { h } from 'vue'
import { Switch } from 'ant-design-vue'

// @ts-ignore
import { setRoleStatus } from '/@/api/demo/system'
// @ts-ignore
import { useMessage } from '/@/hooks/web/useMessage'

export const columns: BasicColumn[] = [
  {
    title: '用户ID',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '用户名称',
    dataIndex: 'username',
    width: 180,
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    width: 200,
  },
  {
    title: '角色',
    dataIndex: 'roles',
    width: 200,
    customRender: ({ record }) => {
      const roles = JSON.parse(record.roles || [])
      return h('div', {}, roles.join(', '))
    },
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'active',
    width: 120,
    // switch 组件通过 h() 函数渲染
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false
      }
      return h(Switch, {
        checked: Number(record.active) === 1,
        checkedChildren: '已启用',
        unCheckedChildren: '已停用',
        loading: record.pendingStatus,
        // onChange(checked: boolean) {
        //   record.pendingStatus = true
        //   const newStatus = checked ? 1 : 0
        //   const { createMessage } = useMessage()
        //   setRoleStatus(record.id, newStatus)
        //     .then(() => {
        //       record.status = newStatus
        //       createMessage.success(`已成功修改角色状态`)
        //     })
        //     .catch(() => {
        //       createMessage.error('修改角色状态失败')
        //     })
        //     .finally(() => {
        //       record.pendingStatus = false
        //     })
        // },
      })
    },
  },
  // {
  //   title: '创建时间',
  //   dataIndex: 'createTime',
  //   width: 180,
  // },
  // {
  //   title: '备注',
  //   dataIndex: 'remark',
  // },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: '用户 ID',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'username',
    label: '用户名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'active',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '停用', value: 0 },
      ],
    },
    colProps: { span: 6 },
  },
]

export const formSchema: FormSchema[] = [
  {
    field: 'username',
    label: '用户名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'password',
    label: '密码',
    required: true,
    component: 'InputPassword',
  },
  {
    field: 'nickname',
    label: '昵称',
    required: true,
    component: 'Input',
  },
  // {
  //   field: 'avator',
  //   label: '头像',
  //   required: false,
  //   component: 'Upload',
  // },
  {
    field: 'roles',
    label: '角色',
    required: false,
    // 通过 slot 控制
    component: 'Input',
    slot: 'menu',
  },
  {
    field: 'active',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '停用', value: 0 },
      ],
    },
  },
  // {
  //   label: '备注',
  //   field: 'remark',
  //   component: 'InputTextArea',
  // },
  // {
  //   label: ' ',
  //   field: 'menu',
  //   slot: 'menu',
  //   component: 'Input',
  // },
]
