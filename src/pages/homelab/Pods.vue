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
document.title = "Pods - Homelab"
const { data: kinds, fetchData: fetchKinds } = useReqMetric()
const { data: pods, fetchData: fetchPods } = useReqMetric()
const { data: detail, fetchData: fetchDetail } = useReqMetric()
const { limit, offset, limitOptions } = usePagination()
const props = defineProps(['setLoading'])
const darkMode = useDarkModeStore()
const { dmState } = storeToRefs(darkMode)
onMounted(() => {
  props.setLoading(true)
  init()
})
const init = () => {
  Promise.allSettled([
    fetchPods('pods'),
    fetchKinds('kinds')
  ])
    .finally(() => props.setLoading(false))
}
const tableData = computed(() => {
  const data = pods.value?.data || []
  const paginate = data.slice(offset.value, limit.value + offset.value)
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
</script>
<template>
  <div class="my-5 px-3 flex justify-between items-center">
    <h1 class="text-3xl font-semibold">Pods</h1>
  </div>
  <div class="flex flex-wrap justify-center items-stretch">
    <div v-for="kind in kinds?.data" class="p-2 w-1/2 sm:w-1/3 lg:w-1/5">
      <Card class="h-full">
        <template #content>
          <div class="text-3xl font-bold">{{ kind.count }}</div>
          <div class="font-bold">{{ kind.kind }}</div>
        </template>
      </Card>
    </div>
  </div>
  <div class="px-2 mt-5 shadow-lg">
    <div class="flex justify-end mb-2">
      <LastFetch :datetime="kinds?.datetime" />
    </div>
    <DataTable :value="tableData" stripedRows>
      <Column header="Pod Name" field="name">
        <template #body="d">
          <div>
            {{ d.data.name }}
          </div>
        </template>
      </Column>
      <Column header="App Name" field="app"></Column>
      <Column header="Kind" field="kind"></Column>
      <Column header="Namespace" field="namespace"></Column>
      <Column header="Status" field="status"></Column>
      <Column header="Node" field="node"></Column>
      <Column header="References">
        <template #body="d">
          <ul>
            <li class="list-disc" v-for="r in d.data.ref">{{ `${r.kind}: ${r.name}` }}</li>
          </ul>
        </template>
      </Column>
      <Column header="">
        <template #body="d">
          <Button v-tooltip.bottom="'Show Detail'" size="small" severity="info" icon="pi pi-eye" @click="GetDetail(d.data)"></Button>
        </template>
      </Column>
      <template #footer>
        <CustomPaginator v-model:rows="limit" v-model:first="offset" :totalRecords="pods?.data.length"
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
