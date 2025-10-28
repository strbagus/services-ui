import { computed, reactive, ref, toRefs, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const usePagination = () => {
  const router = useRouter()
  const route = useRoute()
  const p = reactive({
    search: route.query.search || '',
    limit: Number(route.query.limit) || 10,
    offset: Number(route.query.offset) || 0,
    order_by: route.query.order_by || '',
    order_dir: route.query.order_dir || '',
    filter: {},
  })

  const limitOptions = ref([5, 10, 25, 50])
  const { limit, offset, order_by, order_dir, search, filter } = toRefs(p)
  const query = computed(() => ({
    ...(p.limit && { limit: p.limit }),
    ...(p.offset && { offset: p.offset }),
    ...(p.search && { search: p.search }),
    ...(p.order_by && { order_by: p.order_by }),
    ...(p.order_dir && { order_dir: p.order_dir }),
  }))

  watch(
    query,
    (nv) => {
      router.push({
        query: nv,
      })
    },
    { deep: true },
  )

  return { limit, offset, order_by, order_dir, query, search, filter, limitOptions }
}
