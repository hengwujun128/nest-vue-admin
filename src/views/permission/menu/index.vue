<template>
  <!-- 页面主要是通过 table 和MenuDrawer 构成  -->
  <div>
    <!-- BasicTable 自带搜索功能 -->
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <!--  -->
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增菜单 </a-button>
      </template>
      <!--  -->
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
    <!-- 封装新增 menu 组件 -->
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick } from 'vue'

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
        pagination: false,
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
