<script setup>
import CustomPaginator from '@/components/CustomPaginator.vue';
import LastFetch from '@/components/LastFetch.vue';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { usePagination } from '@/composables/usePagination';
import { useReqMetric } from '@/composables/useReqMetric';
import { useDarkModeStore } from '@/stores/useDarkMode';
import { changeUnit } from '@/utils/calc';
import { storeToRefs } from 'pinia';
import { Badge, Button, Column, ColumnGroup, DataTable, Dialog, Row } from 'primevue';
import { computed, onMounted, ref } from 'vue';
const props = defineProps(['setLoading'])
const { data: nodes, fetchData: fetchNodes } = useReqMetric()
const { data: detail, fetchData: fetchDetail } = useReqMetric()
const { limit, offset, limitOptions } = usePagination()
const darkMode = useDarkModeStore()
const { dmState } = storeToRefs(darkMode)
document.title = "Nodes - Homelab"
onMounted(() => {
  props.setLoading(true)
  init()
})
const init = () => {
  fetchNodes("nodes")
    .finally(() => props.setLoading(false))
}
const totals = computed(() => {
  const result = {
    cpu: 0,
    ram: 0,
    storage: 0
  }
  if (nodes.value && nodes.value.data.length > 0) {
    nodes.value.data.forEach((i) => {
      result.cpu += i.cpus
      result.ram += i.memory
      result.storage += i.storage
    })
  }
  return result
})
const isDetailOpen = ref(false)
const GetDetail = (data) => {
  detail.value = {}
  props.setLoading(true)
  isDetailOpen.value = true
  const item = `node/${data.name}`
  fetchDetail('detail', 'post', { name: item })
    .finally(() => props.setLoading(false))
}
</script>
<template>
  <div class="my-5 px-3 flex justify-between items-center">
    <h1 class="text-3xl font-semibold">Nodes</h1>
  </div>
  <div class="shadow-lg px-2">
    <div class="flex justify-end mb-2">
      <LastFetch :datetime="nodes?.datetime" />
    </div>
    <DataTable :value="nodes?.data" striped-rows>
      <Column header="Name" field="name">
        <template #body="d">
          <div>
            {{ d.data.name }}
          </div>
          <div v-if="d.data.is_control_plane">
            <Badge size="small" value="Control Plane" />
          </div>

        </template>
      </Column>
      <Column header="CPUs" field="cpus"></Column>
      <Column header="Memory" field="memory">
        <template #body="d">{{ changeUnit(d.data?.memory, d.data?.memory_unit, "Gi") }} GiB</template>
      </Column>
      <Column header="Storage" field="storage">
        <template #body="d">{{ changeUnit(d.data?.storage, d.data?.storage_unit, "Gi") }} GiB</template>
      </Column>
      <Column header="About">
        <template #body="d">
          <div class="text-sm">Architecture: <span class="font-bold">{{ d.data.arch }}</span></div>
          <div class="text-sm">Internal IP: <span class="font-bold">{{ d.data.internal_ip }}</span></div>
          <div class="text-sm">Kernel: <span class="font-bold">{{ d.data.kernel_version }}</span></div>
          <div class="text-sm">OS: <span class="font-bold">{{ d.data.os_image }}</span></div>
        </template>
      </Column>
      <Column header="">
        <template #body="d">
          <Button v-tooltip.bottom="'Show Detail'" size="small" severity="info" icon="pi pi-eye" @click="GetDetail(d.data)"></Button>
        </template>
      </Column>
      <ColumnGroup type="footer">
        <Row>
          <Column footer="Total:" footer-style="text-align:right" />
          <Column :footer="totals.cpu" />
          <Column :footer="`${changeUnit(totals.ram, nodes?.data[0].memory_unit, 'Gi')} GiB`" />
          <Column :footer="`${changeUnit(totals.storage, nodes?.data[0].storage_unit,
'Gi')} GiB`" :colspan="3" />
        </Row>
      </ColumnGroup>
      <template #footer>
        <CustomPaginator v-model:rows="limit" v-model:first="offset" :totalRecords="nodes?.data.length"
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
