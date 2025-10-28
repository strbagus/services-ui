<script setup>
import { Paginator } from 'primevue'
import { computed } from 'vue'

const props = defineProps(["totalRecords", "rows", "first", "rowsPerPageOptions"])
const emit = defineEmits(['update:rows', 'update:first'])

const startRecord = computed(() => props.first + 1)
const endRecord = computed(() => {
  const potentialEnd = props.first + props.rows
  return potentialEnd > props.totalRecords ? props.totalRecords : potentialEnd
})
</script>

<template>
  <Paginator :rows="props.rows" :first="props.first" :totalRecords="props.totalRecords"
    :rowsPerPageOptions="props.rowsPerPageOptions || [5, 10, 25, 50]" @update:rows="emit('update:rows', $event)"
    @update:first="emit('update:first', $event)">
    <template #start>
      <span>
        {{ `Showing ${startRecord} - ${endRecord} of ${props.totalRecords || 'X'} Records` }}
      </span>
    </template>
  </Paginator>
</template>
