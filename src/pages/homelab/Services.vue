<script setup>
import CustomPaginator from '@/components/CustomPaginator.vue';
import LastFetch from '@/components/LastFetch.vue';
import { usePagination } from '@/composables/usePagination';
import { useReqMetric } from '@/composables/useReqMetric';
import { changeUnit } from '@/utils/calc';
import { Badge, Column, ColumnGroup, DataTable, Row } from 'primevue';
import { computed, onMounted } from 'vue';

const { data: services, fetchData: fetchServices } = useReqMetric()
const { limit, offset, limitOptions } = usePagination()
const props = defineProps(['setLoading'])

document.title = "Services - Homelab"

onMounted(() => {
  props.setLoading(true)
  init()
})
const init = () => {
  fetchServices('services')
    .finally(() => props.setLoading(false))
}
const totalMemory = computed(() => {
  let result = "0 GiB"
  if (services.value && services.value.data.length > 0) {
    const total = services.value.data.reduce((acc, d) => acc + d.memory, 0)
    result = `${changeUnit(total, services.value.data[0].memory_unit, "Mi")} MiB`
  }
  return result
})
</script>
<template>
  <div class="my-5 px-3 flex justify-between items-center">
    <h1 class="text-3xl font-semibold">Systemd Services</h1>
  </div>
  <div class="shadow-lg px-2">
    <div class="flex justify-between mb-2">
      <div>Services running on <span class="font-semibold italic text-primary">{{ services?.host }}</span></div>
      <LastFetch :datetime="services?.datetime" />
    </div>
    <DataTable :value="services?.data" striped-rows>
      <Column header="PID" field="pid"></Column>
      <Column header="Name" field="name">
        <template #body="d">
          <div class="font-bold">
            {{ d.data.name }}
          </div>
          <div>
            {{ d.data.description }}
          </div>
        </template>
      </Column>
      <Column header="Memory" field="memory">
        <template #body="d">{{ changeUnit(d.data?.memory, d.data?.memory_unit, "Mi") }} MiB</template>
      </Column>
      <Column header="Status">
        <template #body="d">
          <Badge :severity="d.data.is_active ? 'success' : 'danger'" :value="d.data.sub_state" />
        </template>
      </Column>
      <ColumnGroup type="footer">
        <Row>
          <Column footer="Total:" colspan="2" footer-style="text-align:right" />
          <Column :footer="totalMemory" colspan="2" />
        </Row>
      </ColumnGroup>

      <template #footer>
        <CustomPaginator v-model:rows="limit" v-model:first="offset" :totalRecords="services?.data.length"
          :rowsPerPageOptions="limitOptions" />
      </template>
    </DataTable>

  </div>
</template>
