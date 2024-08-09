<template>
  <!-- MenuDrawer 组件是 form 和 Draw 组件的结合, 因此又基于它们再次封装 -->
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { formSchema } from './menu.data'
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer'

  import { getMenuList } from '/@/api/demo/system'
  import { createMenu, updateMenu } from '@/api/sys/menu'

  export default defineComponent({
    name: 'MenuDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const updatedRecordId = ref<number | null>(null)
      // 表单初始化 ,统一使用 hook(useForm)
      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 12, md: 24 },
      })
      // init drawer component ,
      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        // call function  will be called when click the edit button
        resetFields()
        setDrawerProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        // 回显数据
        if (unref(isUpdate)) {
          updatedRecordId.value = data.record.id
          setFieldsValue({
            parentMenu: data.record.pid, // 对齐字段
            ...data.record,
          })
        }
        // drawer 请求 API, 设置下拉
        const treeData = await getMenuList()
        updateSchema({
          field: 'parentMenu',
          componentProps: { treeData },
        })
      })

      const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'))

      // 提交
      async function handleSubmit() {
        try {
          const values = await validate()
          setDrawerProps({ confirmLoading: true })
          // pid 处理
          if (values.parentMenu) {
            values.pid = values.parentMenu
          } else {
            values.pid = 0
          }
          values.active = +values.active
          console.log(values)
          delete values.parentMenu

          let res
          if (unref(isUpdate)) {
            values.id = updatedRecordId.value
            res = await updateMenu(values)
          } else {
            res = await createMenu({ ...values })
          }

          console.log(res)
          if (res.code === 0) {
            closeDrawer()
            emit('success')
          }
        } finally {
          setDrawerProps({ confirmLoading: false })
        }
      }

      return { registerDrawer, registerForm, getTitle, handleSubmit }
    },
  })
</script>
