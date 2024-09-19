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
      <template #menu="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="treeData"
          :fieldNames="{ title: 'name', key: 'id' }"
          checkable
          toolbar
          title="菜单分配"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { formSchema } from './role.data'
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer'
  import { BasicTree, TreeItem } from '/@/components/Tree'

  import { getActiveMenus } from '/@/api/sys/menu'

  import { addRole, editRole, getRoleMenuByRoleId } from '/@/api/sys/user'

  const emit = defineEmits(['success', 'register'])
  const isUpdate = ref(true)
  const updatedRecordId = ref<null | number>(null)
  const treeData = ref<TreeItem[]>([])

  const [registerForm, { resetFields, setFieldsValue, validate, updateSchema }] = useForm({
    labelWidth: 90,
    baseColProps: { span: 20 },
    schemas: formSchema,
    // schemas: getFormSchemas(isUpdate),
    showActionButtonGroup: false,
  })

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields()
    setDrawerProps({ confirmLoading: false })
    // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
    if (unref(treeData).length === 0) {
      treeData.value = (await getActiveMenus()) as any as TreeItem[]
    }
    isUpdate.value = !!data?.isUpdate

    if (unref(isUpdate)) {
      updatedRecordId.value = data.record.id
      //NOTE: 编辑时候设置表单字段禁用,禁止修改
      updateSchema({
        field: 'name',
        componentProps: {
          disabled: true,
        },
      })
      // NOTE: 编辑的时候,要回填菜单,根据用户的角色去获取角色对应的菜单
      const roleId = data.record.id
      const menus = (await getRoleMenuByRoleId(roleId)) || []
      // eslint-disable-next-line no-debugger
      debugger
      data.record.menu = menus.map((item) => {
        return item.menuId
      })

      setFieldsValue({
        ...data.record,
      })
    } else {
      updateSchema({
        field: 'name',
        componentProps: {
          disabled: false,
        },
      })
    }
  })

  const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'))

  async function handleSubmit() {
    try {
      const values = await validate()
      setDrawerProps({ confirmLoading: true })
      console.log(values)
      const params = { ...values }
      if (unref(isUpdate)) {
        params.id = updatedRecordId.value
        editRole(params).then(() => {
          closeDrawer()
          emit('success')
        })
      } else {
        addRole(params).then(() => {
          closeDrawer()
          emit('success')
        })
      }
    } finally {
      setDrawerProps({ confirmLoading: false })
    }
  }
</script>
