<template>
  <a-tree-select v-bind="getAttrs" @change="handleChange" :field-names="fieldNames">
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
    <template #suffixIcon v-if="loading">
      <LoadingOutlined spin />
    </template>
  </a-tree-select>
</template>

<script lang="ts">
  import { type Recordable } from '@vben/types'
  import { type PropType, computed, defineComponent, watch, ref, onMounted, unref } from 'vue'
  import { TreeSelect } from 'ant-design-vue'
  import { isArray, isFunction } from '/@/utils/is'
  import { get } from 'lodash-es'
  import { propTypes } from '/@/utils/propTypes'
  import { LoadingOutlined } from '@ant-design/icons-vue'

  export default defineComponent({
    name: 'ApiTreeSelect',
    components: { ATreeSelect: TreeSelect, LoadingOutlined },
    props: {
      api: { type: Function as PropType<(arg?: Recordable<any>) => Promise<Recordable<any>>> },
      params: { type: Object },
      immediate: { type: Boolean, default: true },
      resultField: propTypes.string.def(''),
      labelField: propTypes.string.def('title'),
      valueField: propTypes.string.def('value'),
      childrenField: propTypes.string.def('children'),
    },
    emits: ['options-change', 'change'],
    setup(props, { attrs, emit }) {
      const treeData = ref<Recordable<any>[]>([])
      const isFirstLoaded = ref<Boolean>(false)
      const loading = ref(false)
      const getAttrs = computed(() => {
        return {
          ...(props.api ? { treeData: unref(treeData) } : {}),
          ...attrs,
        }
      })
      const fieldNames = {
        children: props.childrenField,
        value: props.valueField,
        label: props.labelField,
      }

      function handleChange(...args) {
        emit('change', ...args)
      }

      watch(
        () => props.params,
        () => {
          !unref(isFirstLoaded) && fetch()
        },
        { deep: true },
      )

      watch(
        () => props.immediate,
        (v) => {
          v && !isFirstLoaded.value && fetch()
        },
      )

      onMounted(() => {
        props.immediate && fetch()
      })

      async function fetch() {
        const { api } = props
        if (!api || !isFunction(api) || loading.value) return
        loading.value = true
        treeData.value = []
        let result
        try {
          result = await api(props.params)
        } catch (e) {
          console.error(e)
        }
        loading.value = false
        if (!result) return
        if (!isArray(result)) {
          result = get(result, props.resultField)
        }
        treeData.value = (result as Recordable<any>[]) || []
        isFirstLoaded.value = true
        emit('options-change', treeData.value)
      }
      return { getAttrs, loading, handleChange, fieldNames }
    },
  })
</script>
