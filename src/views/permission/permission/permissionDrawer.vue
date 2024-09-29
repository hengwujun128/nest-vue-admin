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
          :fieldNames="{ title: 'menuName', key: 'id' }"
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
  import { formSchema } from './permission.data'
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer'
  import { BasicTree, TreeItem } from '/@/components/Tree'

  // import { getActiveMenus } from '/@/api/sys/menu'

  import { addPermission, editPermission } from '/@/api/sys/user'

  const emit = defineEmits(['success', 'register'])
  const isUpdate = ref(true)
  const treeData = ref<TreeItem[]>([])
  const updatedRecordId = ref<null | number>(null)

  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 90,
    baseColProps: { span: 24 },
    schemas: formSchema,
    showActionButtonGroup: false,
  })

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields()
    setDrawerProps({ confirmLoading: false })
    // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
    // if (unref(treeData).length === 0) {
    //   treeData.value = (await getActiveMenus()) as any as TreeItem[]
    // }
    isUpdate.value = !!data?.isUpdate

    if (unref(isUpdate)) {
      updatedRecordId.value = data.record.id
      updateSchema({
        field: 'key',
        componentProps: {
          disabled: true,
        },
      })

      setFieldsValue({
        ...data.record,
      })
    } else {
      updateSchema({
        field: 'key',
        componentProps: {
          disabled: false,
        },
      })
    }
  })

  const getTitle = computed(() => (!unref(isUpdate) ? '新增权限' : '编辑权限'))

  async function handleSubmit() {
    try {
      const values = await validate()
      setDrawerProps({ confirmLoading: true })
      const params = { ...values }

      // TODO custom api
      if (unref(isUpdate)) {
        params.id = updatedRecordId.value
        console.log('update', params)
        await editPermission(params)
      } else {
        await addPermission(params)
      }
      console.log(values)
      closeDrawer()
      emit('success')
    } finally {
      setDrawerProps({ confirmLoading: false })
    }
  }
</script>
