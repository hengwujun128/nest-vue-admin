import { BasicColumn, FormSchema } from '/@/components/Table'
import { h } from 'vue'
import { Switch } from 'ant-design-vue'
import { setRoleStatus } from '/@/api/demo/system'
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
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    // switch 组件通过 h() 函数渲染
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false
      }
      return h(Switch, {
        checked: record.status === '1',
        checkedChildren: '停用',
        unCheckedChildren: '启用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true
          const newStatus = checked ? '1' : '0'
          const { createMessage } = useMessage()
          setRoleStatus(record.id, newStatus)
            .then(() => {
              record.status = newStatus
              createMessage.success(`已成功修改角色状态`)
            })
            .catch(() => {
              createMessage.error('修改角色状态失败')
            })
            .finally(() => {
              record.pendingStatus = false
            })
        },
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
    colProps: { span: 8 },
  },
  {
    field: 'username',
    label: '用户名称',
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
    field: 'userName',
    label: '用户名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'nickName',
    label: '昵称',
    required: true,
    component: 'Input',
  },
  {
    field: 'avator',
    label: '头像',
    required: false,
    component: 'Upload',
  },
  {
    field: 'role',
    label: '角色',
    required: true,
    // 通过 slot 控制
    component: 'Input',
    slot: 'menu',
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '启用', value: '1' },
        { label: '停用', value: '0' },
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
