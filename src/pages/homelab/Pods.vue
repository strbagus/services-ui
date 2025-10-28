<script setup>
import CustomPaginator from '@/components/CustomPaginator.vue';
import LastFetch from '@/components/LastFetch.vue';
import { usePagination } from '@/composables/usePagination';
import { useReqMetric } from '@/composables/useReqMetric';
import { Card, Column, DataTable } from 'primevue';
import { computed, onMounted } from 'vue';
document.title = "Pods - Homelab"
const { data: kinds, fetchData: fetchKinds } = useReqMetric()
const { data: pods, fetchData: fetchPods } = useReqMetric()
const { limit, offset, limitOptions } = usePagination()
const props = defineProps(['setLoading'])
onMounted(() => {
  props.setLoading(true)
  init()
})

const init = async () => {
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
      <template #footer>
        <CustomPaginator v-model:rows="limit" v-model:first="offset" :totalRecords="pods?.data.length"
          :rowsPerPageOptions="limitOptions" />
      </template>
    </DataTable>
  </div>
</template>
