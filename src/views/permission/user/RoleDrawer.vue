<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <!--  -->
      <template #menu="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="treeData"
          :fieldNames="{ title: 'remark', key: 'id' }"
          checkable
          toolbar
          title="角色列表"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue'
  //
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { formSchema } from './role.data'
  // component+ hooks 相结合
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer'

  import { BasicTree, TreeItem } from '/@/components/Tree'

  // import { getMenuList } from '/@/api/demo/system'
  import { addUser, editUser, getRoleList } from '/@/api/sys/user'

  // import { useMessage } from '/@/hooks/web/useMessage'

  // const { createMessage } = useMessage()
  const emit = defineEmits(['success', 'register'])
  const isUpdate = ref(true)
  const updatedRecordId = ref<number | null>(null)

  const treeData = ref<TreeItem[]>([])

  //新增用户表单逻辑
  const [
    registerForm,
    { resetFields, removeSchemaByField, setFieldsValue, getFieldsValue, validate },
  ] = useForm({
    labelWidth: 90,
    baseColProps: { span: 20 },
    schemas: formSchema, // 新增用户|编辑用户表单配置
    showActionButtonGroup: false,
  })

  //编辑用户表单逻辑
  // registerDrawer 也是封装到 hooks 中的方法, 作为外部的事件处理器
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    // NOTE:编辑用户不支持修改密码,因此不需要密码字段
    // const updateFormSchema = formSchema.filter((item) => {
    //   return item.field !== 'password'
    // })
    // resetSchema(updateFormSchema)

    removeSchemaByField('password') // 编辑时候不需要展示 password 字段
    resetFields()
    setDrawerProps({ confirmLoading: false })
    // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
    if (unref(treeData).length === 0) {
      // 获取角色列表
      treeData.value = await getRoleList()
    }
    isUpdate.value = !!data?.isUpdate
    //  NOTE: 编辑操作的回填数据,处理 treeData 反选问题, 注意不能直接修改data.record.roles 的数据结构, 因为 table,form 共用
    if (unref(isUpdate)) {
      updatedRecordId.value = data.record.id
      let updatedRoles = []
      if (data.record.roles) {
        const roles = JSON.parse(data.record.roles)
        updatedRoles = roles.map((role) => {
          const roleItem = treeData.value.find((item) => item.name === role)
          return roleItem?.id
        })
        console.log('------编辑回填数据------', data.record)
      }
      setFieldsValue({
        ...data.record,
        roles: updatedRoles,
      })
    }
  })

  const getTitle = computed(() => (!unref(isUpdate) ? '新增用户' : '编辑用户'))

  async function handleSubmit() {
    try {
      const values = await validate()
      setDrawerProps({ confirmLoading: true })
      const params: any = {}
      params.username = values.username
      params.password = values.password
      params.nickname = values.nickname
      // params.roles = values.roles || '[]'
      params.roles = JSON.stringify(
        values.roles.map((role) => {
          const roleItem = unref(treeData).find((item) => item.id === role)
          return roleItem?.name
        }),
      )
      params.avatar = values.avatar || 'https://vuejs.org/viteconf.svg'
      params.active = values.active
      const update = unref(isUpdate)
      if (update) {
        params.id = updatedRecordId.value

        // 因为数据库中 username 是唯一的,所以可以使用 username 作为更新条件
        console.log({ '编辑 user': getFieldsValue() })
        editUser(params).then(() => {
          closeDrawer()
          emit('success')
        })
      } else {
        addUser(params).then(() => {
          // createMessage.success(`新增用户成功`)  // 拦截器统一显示
          closeDrawer()
          emit('success')
        })
      }
    } finally {
      setDrawerProps({ confirmLoading: false })
    }
  }
</script>
