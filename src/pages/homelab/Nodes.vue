<script setup>
import CustomPaginator from '@/components/CustomPaginator.vue';
import LastFetch from '@/components/LastFetch.vue';
import { usePagination } from '@/composables/usePagination';
import { useReqMetric } from '@/composables/useReqMetric';
import { changeUnit } from '@/utils/calc';
import { Badge, Column, ColumnGroup, DataTable, Row } from 'primevue';
import { computed, onMounted } from 'vue';
const props = defineProps(['setLoading'])
const { data: nodes, fetchData: fetchNodes } = useReqMetric()
const { limit, offset, limitOptions } = usePagination()
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
      <ColumnGroup type="footer">
        <Row>
          <Column footer="Total:" footer-style="text-align:right" />
          <Column :footer="totals.cpu" />
          <Column :footer="`${changeUnit(totals.ram, nodes?.data[0].memory_unit, 'Gi')} GiB`" />
          <Column :footer="`${changeUnit(totals.storage, nodes?.data[0].storage_unit, 'Gi')} GiB`" :colspan="2" />
        </Row>
      </ColumnGroup>
      <template #footer>
        <CustomPaginator v-model:rows="limit" v-model:first="offset" :totalRecords="nodes?.data.length"
          :rowsPerPageOptions="limitOptions" />
      </template>
    </DataTable>
  </div>
</template>
