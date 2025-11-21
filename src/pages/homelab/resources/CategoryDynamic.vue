<script setup>
import CustomPaginator from '@/components/CustomPaginator.vue';
import LastFetch from '@/components/LastFetch.vue';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { usePagination } from '@/composables/usePagination';
import { useReqMetric } from '@/composables/useReqMetric';
import { Button, Card, Column, DataTable, Dialog } from 'primevue';
import { computed, onMounted, ref } from 'vue';
import { useDarkModeStore } from '@/stores/useDarkMode';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
document.title = "Resources Category - Homelab"
const { data: resources, fetchData: fetchResources } = useReqMetric()
const { data: katalog, fetchData: fetchKatalog } = useReqMetric()
const { data: detail, fetchData: fetchDetail } = useReqMetric()
const { limit, offset, limitOptions } = usePagination()
const route = useRoute()
const props = defineProps(['setLoading'])
const darkMode = useDarkModeStore()
const { dmState } = storeToRefs(darkMode)
const selectedTypes = ref([])
onMounted(() => {
  props.setLoading(true)
  getData()
})
const getData = () => {
  props.setLoading(true)
  Promise.allSettled([
    fetchResources(`resources/${route.params.category}`),
    fetchKatalog(`resources`)
  ])
    .finally(() => props.setLoading(false))
}
const tableData = computed(() => {
  const data = resources.value?.data || []
  const filtered = selectedTypes.value.length > 0
    ? data.filter(d => selectedTypes.value.includes(d.kind))
    : data
  const paginate = filtered.slice(offset.value, limit.value + offset.value)
  return paginate
})

const isDetailOpen = ref(false)
const GetDetail = (data) => {
  detail.value = {}
  props.setLoading(true)
  isDetailOpen.value = true
  const item = `${data.kind.toLowerCase()}/${data.name} -n ${data.namespace}`
  fetchDetail('detail', 'post', { name: item })
    .finally(() => props.setLoading(false))
}
const kinds = computed(() => {
  try {
    const arr = resources.value?.data.map(i => i.kind)
    const result = Object.entries(
      arr.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {})
    ).map(([type, count]) => ({ type, count }));
    return result
  } catch {
    return []
  }
})
const categories = computed(() => {
  const result = katalog.value?.data.find(i => i.slug == route.params.category)
  return result
})
const toggleType = (type) => {
  if (selectedTypes.value.includes(type)) {
    selectedTypes.value = selectedTypes.value.filter(i => i != type)
  } else {
    selectedTypes.value.push(type)
  }
}
</script>
<template>
  <div class="my-5 px-3 flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-semibold">
        <RouterLink to="/homelab/resources">Resources:</RouterLink> {{ categories?.category }}
      </h1>
      <h3 class="text-xl italic">{{ categories?.types.join(", ") }}</h3>
    </div>
  </div>
  <div class="flex flex-wrap justify-center items-stretch">
    <div v-for="kind in kinds" class="p-2 w-1/2 sm:w-1/3 lg:w-1/5">
      <Card class="h-full cursor-pointer border" :class="selectedTypes.includes(kind.type) ?
        'border-green-500' : 'border-transparent'" @click="toggleType(kind.type)">
        <template #content>
          <div class="text-3xl font-bold">{{ kind.count }}</div>
          <div class="font-bold">{{ kind.type }}</div>
        </template>
      </Card>
    </div>
  </div>
  <div class="px-2 mt-5 shadow-lg">
    <!-- <div class="flex justify-end mb-2">
      <LastFetch :datetime="resources?.datetime" refresh @click-event="getData" />
    </div> -->
    <DataTable :value="tableData" stripedRows>
      <Column header="Name" field="name"></Column>
      <Column header="Namespace" field="namespace"></Column>
      <Column header="Kind" field="kind"></Column>
      <Column header="">
        <template #body="d">
          <Button v-tooltip.bottom="'Show Detail'" size="small" severity="info" icon="pi pi-eye"
            @click="GetDetail(d.data)"></Button>
        </template>
      </Column>
      <template #footer>
        <CustomPaginator v-model:rows="limit" v-model:first="offset" :totalRecords="resources?.data.length"
          :rowsPerPageOptions="limitOptions" />
      </template>
    </DataTable>
  </div>
  <Dialog v-model:visible="isDetailOpen" class="w-full! md:w-300! pb-5" modal :header="detail?.title ?
    detail.title : 'Loading Detail...'">
    <VueJsonPretty v-if="detail?.data" :data="detail.data" :show-line-number="true" :theme="dmState ? 'dark' : 'light'"
      :show-icon="true" />
    <div v-else class="flex justify-center">
      <span class="pi pi-spinner pi-spin"></span>
    </div>
  </Dialog>
</template>
