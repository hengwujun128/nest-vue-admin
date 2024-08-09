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
  import { createMenu } from '@/api/sys/menu'

  export default defineComponent({
    name: 'MenuDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      // 表单初始化 ,统一使用 hook(useForm)
      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 12, md: 24 },
      })

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields()
        setDrawerProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate

        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          })
        }
        // drawer 请求 API
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
          values.status = +values.status
          console.log(values)
          delete values.parentMenu
          const res = await createMenu({ ...values })

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
