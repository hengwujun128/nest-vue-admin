<template>
  <div>
    <BasicTable @register="registerTable" :scroll="{ x: 1200, y: 1000 }">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增菜单 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
              },

              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, nextTick } from 'vue'

  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { getMenuList, deleteMenu } from '@/api/sys/menu'

  import { useDrawer } from '/@/components/Drawer'
  import MenuDrawer from './MenuDrawer.vue'

  import { columns, searchFormSchema } from './menu.data'

  export default defineComponent({
    name: 'MenuManagement',
    components: { BasicTable, MenuDrawer, TableAction },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer()

      const pagination = reactive({
        pageSize: 10,
        page: 1,
        total: 0,
      })
      // hooks
      const [registerTable, { reload, expandAll }] = useTable({
        title: '菜单列表',
        api: getMenuList,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        isTreeTable: true,
        pagination: pagination,
        striped: false,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        canResize: false,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          // slots: { customRender: 'action' },
          fixed: undefined,
        },
      })

      // 设置分页
      // setPagination(pagination)

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        })
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record,
          isUpdate: true,
        })
      }

      function handleDelete(record: Recordable) {
        console.log(record)
        deleteMenu(record.id).then(() => {
          reload()
        })
      }

      function handleSuccess() {
        reload()
      }

      function onFetchSuccess() {
        // 演示默认展开所有表项
        nextTick(expandAll)
      }

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        onFetchSuccess,
      }
    },
  })
</script>
