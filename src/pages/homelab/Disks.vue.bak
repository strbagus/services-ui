<script setup>
import CustomPaginator from '@/components/CustomPaginator.vue';
import LastFetch from '@/components/LastFetch.vue';
import 'vue-json-pretty/lib/styles.css';
import { usePagination } from '@/composables/usePagination';
import { useReqMetric } from '@/composables/useReqMetric';
import { changeUnit } from '@/utils/calc';
import { Column, ColumnGroup, DataTable, Row } from 'primevue';
import { computed, onMounted } from 'vue';
const props = defineProps(['setLoading'])
const { data: disks, fetchData: fetchDisks } = useReqMetric()
const { limit, offset, limitOptions } = usePagination()
document.title = "Disks - Homelab"
onMounted(() => {
  props.setLoading(true)
  init()
})
const init = () => {
  fetchDisks("disks")
    .finally(() => props.setLoading(false))
}
const totals = computed(() => {
  const result = {
    used: 0,
    size: 0,
    available: 0
  }
  if (disks.value && disks.value.data.length > 0) {
    disks.value.data.forEach((i) => {
      result.used += i.used
      result.size += i.size
      result.available += i.available
    })
  }
  return result
})
</script>
<template>
  <div class="my-5 px-3 flex justify-between items-center">
    <h1 class="text-3xl font-semibold">Disks</h1>
  </div>
  <div class="shadow-lg px-2">
    <div class="flex justify-end mb-2">
      <LastFetch :datetime="disks?.datetime" />
    </div>
    <DataTable :value="disks?.data" striped-rows>
      <Column header="Hostname" field="hostname"></Column>
      <Column header="Used">
        <template #body="d">
          {{ changeUnit(d.data?.used, "", "Gi") }} GiB ({{ d.data?.usage }})
        </template>
      </Column>
      <Column header="Size">
        <template #body="d">
          {{ changeUnit(d.data?.size, "", "Gi") }} GiB
        </template>
      </Column>
      <Column header="Available">
        <template #body="d">{{ changeUnit(d.data?.available, "", "Gi") }} GiB</template>
      </Column>
      <ColumnGroup type="footer">
        <Row>
          <Column footer="Total:" footer-style="text-align:right" />
          <Column :footer="`${changeUnit(totals.used, '', 'Gi')} GiB`" />
          <Column :footer="`${changeUnit(totals.size, '', 'Gi')} GiB`" />
          <Column :footer="`${changeUnit(totals.available, '', 'Gi')} GiB`" :colspan="2" />
        </Row>
      </ColumnGroup>
      <template #footer>
        <CustomPaginator v-model:rows="limit" v-model:first="offset" :totalRecords="disks?.data.length"
          :rowsPerPageOptions="limitOptions" />
      </template>
    </DataTable>
  </div>
</template>
