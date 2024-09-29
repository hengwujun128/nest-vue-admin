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
  import { message } from 'ant-design-vue'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { formSchema } from './menu.data'
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer'

  import { createMenu, updateMenu, getMenuList } from '@/api/sys/menu'

  export default defineComponent({
    name: 'MenuDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const updatedRecordId = ref<number | null>(null)
      let menuList
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
        const params = {
          page: 1,
          pageSize: 1000,
        }
        const { list: treeData } = await getMenuList(params)
        menuList = treeData
        updateSchema({
          field: 'parentMenu',
          componentProps: { treeData },
        })
      })

      const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'))

      // 判断所有子菜单全部关闭后,主菜单才能关闭(禁用)
      function checkAllChildrenMenuDisabled(updateMenu) {
        const id = updateMenu.id
        let isAllClosed = true // 默认可以关闭(禁用)

        // 查询当前菜单的子菜单(二级菜单)
        const subMenus = menuList.filter((item) => item.pid === id)
        if (subMenus.length > 0) {
          // return 在 foreach不能跳出循环
          const isActive = subMenus.find((subMenu) => {
            return subMenu.active === 1
          })

          if (isActive) {
            isAllClosed = false
            return isAllClosed
          }
          // 递归处理三级以上菜单
          for (let subMenu of subMenus) {
            let result = checkAllChildrenMenuDisabled(subMenu)
            if (!result) {
              isAllClosed = false
              return isAllClosed
            }
          }
        }
        //没有子菜单,直接返回
        return isAllClosed
      }
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
          delete values.parentMenu
          console.log(values)

          if (unref(isUpdate)) {
            values.id = updatedRecordId.value
            // 关闭菜单状态要做校验
            let canUpdate = true
            if (values.active === 0) {
              canUpdate = checkAllChildrenMenuDisabled(values)
              console.log('canUpdate----', canUpdate)
            }
            if (canUpdate) {
              await updateMenu(values)
            } else {
              message.warning('请先禁用所有子菜单')
            }
          } else {
            await createMenu({ ...values })
          }
          closeDrawer()
          emit('success')
        } finally {
          setDrawerProps({ confirmLoading: false })
        }
      }

      return { registerDrawer, registerForm, getTitle, handleSubmit }
    },
  })
</script>
