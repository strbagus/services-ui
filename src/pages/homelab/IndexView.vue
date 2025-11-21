<script setup>
import { Badge, Card } from 'primevue';
import { computed, onMounted, watch } from 'vue';
import { useWebSocket } from '@/composables/useWebSocket';
import { changeUnit } from '@/utils/calc';
import { useReqMetric } from '@/composables/useReqMetric';

const { messages, live } = useWebSocket(`/top`);
const props = defineProps(['setLoading'])
const { data: nodes, fetchData: fetchNodes } = useReqMetric()
const { data: pods, fetchData: fetchPods } = useReqMetric()
const { data: top, fetchData: fetchTop } = useReqMetric()
const { data: services, fetchData: fetchServices } = useReqMetric()
const { data: disks, fetchData: fetchDisks } = useReqMetric()

onMounted(() => {
  props.setLoading(true)
  init()
})
const init = () => {
  Promise.allSettled([
    fetchNodes("nodes"),
    fetchTop("top"),
    fetchPods("pods"),
    fetchServices("services"),
    fetchDisks("disks")
  ])
    .finally(() => props.setLoading(false))
}
watch(messages, (a) => {
  top.value && (top.value.data = a)
})

const mergedMetrics = computed(() => {
  const nodeTop = mergeByKey(nodes.value?.data, top.value?.data, "name")
  return nodeTop.map(i => {
    const d = disks.value?.data.find(di => di.hostname == i.name)
    return { ...i, dcap: d.size, dused: d.used, dperc: d.usage }
  })
})

const allCounter = computed(() => {
  const mg = mergedMetrics.value
  const c = {
    nodes: 0,
    cpu_usage: 0,
    cpu_cap: 0,
    mem_usage: 0,
    mem_cap: 0,
    stg_cap: 0,
    stg_used: 0
  }
  mg.forEach(i => {
    c.nodes++
    c.cpu_usage += i.cused / 1000
    c.cpu_cap += i.cpus
    c.mem_usage += i.mused
    c.mem_cap += i.memory
  })
  disks.value?.data.forEach(i => {
    c.stg_cap += i.size
    c.stg_used += i.used
  })
  const mem_unit = "Gi"
  const mem_usage = changeUnit(c.mem_usage, mg[0]?.munit, mem_unit)
  const mem_cap = changeUnit(c.mem_cap, mg[0]?.memory_unit, mem_unit)
  const stg_cap = changeUnit(c.stg_cap, "", mem_unit)
  const stg_used = changeUnit(c.stg_used, "", mem_unit)
  const stg_perc = (stg_used / stg_cap * 100)?.toFixed(2) + "%"
  const result = {
    ...c,
    cpu_usage: Number(c.cpu_usage?.toFixed(2)),
    cpu_perc: Number((c.cpu_usage / c.cpu_cap * 100)?.toFixed(2)),
    mem_perc: Number((mem_usage / mem_cap * 100)?.toFixed(2)),
    mem_usage,
    mem_cap,
    mem_unit,
    stg_cap,
    stg_used,
    stg_perc,
  }
  return result
})

const percToColor = (perc) => {
  const int = typeof perc == 'number' ? perc : Number(perc.replace("%", ""))
  let color = ""
  if (int < 30) {
    color = "rgb(0, 255, 0)"
  } else if (int < 75) {
    color = "rgb(255, 200, 0)"
  } else {
    color = "rgb(255, 0, 0)"
  }
  return `<span style="color: ${color}"> (${int}%) </span>`
}

const mergeByKey = (a, b, key = 'name') => {
  if (!a || !b) {
    return []
  }
  const map = new Map();
  a.forEach(item => map.set(item[key], { ...item }));
  b.forEach(item => map.set(item[key], { ...(map.get(item[key]) || {}), ...item }));
  return Array.from(map.values());
};
</script>
<template>
  <div class="my-5 px-3 flex justify-between items-center">
    <h1 class="text-3xl font-semibold">Homelab Overview</h1>
    <div><i v-if="live" v-tooltip.left="'Connected to WS'" class="blink text-red-500 pi pi-circle-fill"></i></div>
  </div>
  <div class="flex flex-wrap justify-center items-stretch">
    <div class="w-full sm:w-1/2 md:w-1/3 p-2">
      <Card class="h-full">
        <template #content>
          <div class="flex items-center">
            <div class="bg-primary-400 dark:bg-neutral-700 rounded-2xl p-3">
              <span class="material-symbols-outlined" style="font-size: 4rem;">dns</span>
            </div>
            <div class="grow px-5">
              <div class="mb-3">
                <span class="text-4xl font-bold">{{ allCounter.nodes || 0 }}&nbsp;</span>
                <span class="text-xl font-bold">Nodes</span>
              </div>
              <span class="font-semibold">{{ allCounter.nodes || 0 }} {{ allCounter.nodes > 1 ?
                'nodes' : 'node' }} is running.</span>
            </div>
          </div>
        </template>
      </Card>
    </div>
    <div class="w-full sm:w-1/2 md:w-1/3 p-2">
      <Card class="h-full">
        <template #content>
          <div class="flex items-center">
            <div class="bg-primary-400 dark:bg-neutral-700 rounded-2xl p-3">
              <span class="material-symbols-outlined" style="font-size: 4rem;">memory</span>
            </div>
            <div class="grow px-5">
              <div class="mb-3">
                <span class="text-4xl font-bold">{{ allCounter.cpu_cap || 0 }}&nbsp;</span>
                <span class="text-xl font-bold">CPU Core</span>
              </div>
              <span class="font-semibold">{{ `${allCounter.cpu_usage}/${allCounter.cpu_cap}`
              }}<span v-html="percToColor(allCounter.cpu_perc)"></span>a cores is used.</span>
            </div>
          </div>
        </template>
      </Card>
    </div>
    <div class="w-full md:w-1/3 p-2">
      <Card class="h-full">
        <template #content>
          <div class="flex items-center">
            <div class="bg-primary-400 dark:bg-neutral-700 rounded-2xl p-3">
              <span class="material-symbols-outlined" style="font-size: 4rem;">memory_alt</span>
            </div>
            <div class="grow px-5">
              <div class="mb-3">
                <span class="text-4xl font-bold">{{ `${allCounter.mem_cap} GiB` }}&nbsp;</span>
                <span class="text-xl font-bold">Memory</span>
              </div>
              <span class="font-semibold">{{ `${allCounter.mem_usage}/${allCounter.mem_cap} GiB` }}
                <span v-html="percToColor(allCounter.mem_perc)"></span> memory is used.</span>
            </div>
          </div>
        </template>
      </Card>
    </div>
    <div class="w-full md:w-1/3 p-2">
      <Card class="h-full">
        <template #content>
          <div class="flex items-center">
            <div class="bg-primary-400 dark:bg-neutral-700 rounded-2xl p-3">
              <span class="material-symbols-outlined" style="font-size: 4rem;">host</span>
            </div>
            <div class="grow px-5">
              <div class="mb-3">
                <span class="text-4xl font-bold">{{ `${pods?.data ? pods?.data.length : 0}` }}&nbsp;</span>
                <span class="text-xl font-bold">Pod</span>
              </div>
              <span class="font-semibold">{{pods?.data.filter(i => i.status == 'Running').length}}/{{ pods?.data.length
                }}
                Pod is
                Running.</span>
            </div>
          </div>
        </template>
      </Card>
    </div>
    <div class="w-full md:w-1/3 p-2">
      <Card class="h-full">
        <template #content>
          <div class="flex items-center">
            <div class="bg-primary-400 dark:bg-neutral-700 rounded-2xl p-3">
              <span class="material-symbols-outlined" style="font-size: 4rem;">hard_disk</span>
            </div>
            <div class="grow px-5">
              <div class="mb-3">
                <span class="text-4xl font-bold">{{ `${allCounter.stg_cap} GiB` }}&nbsp;</span>
                <span class="text-xl font-bold">Storage</span>
              </div>
              <span class="font-semibold">{{ `${allCounter.stg_used}/${allCounter.stg_cap} GiB` }}
                <span v-html="percToColor(allCounter.stg_perc)"></span> storage is used.</span>
            </div>
          </div>
        </template>
      </Card>
    </div>
    <div class="w-full md:w-1/3 p-2">
      <Card class="h-full">
        <template #content>
          <div class="flex items-center">
            <div class="bg-primary-400 dark:bg-neutral-700 rounded-2xl p-3">
              <span class="material-symbols-outlined" style="font-size: 4rem;">dynamic_form</span>
            </div>
            <div class="grow px-5">
              <div class="mb-3">
                <span class="text-4xl font-bold">{{ services?.data.length }}&nbsp;</span>
                <span class="text-xl font-bold">Systemd</span>
              </div>
              <span class="font-semibold">{{services?.data.filter(i => i.is_active).length}}/{{ services?.data.length
              }} systemd services is running.</span>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
  <div class="text-xl text-center mt-5 font-semibold">NODES</div>
  <div class="flex flex-wrap justify-evenly items-stretch">
    <div v-for="d in mergedMetrics" class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
      <Card class="h-full">
        <template #title>
          <div class="text-center flex items-center justify-center gap-2">{{ d.name }}
            <Badge v-if="d.roles?.includes('master')" size="small" style="text-align:
            center;">master</Badge>
          </div>
        </template>
        <template #content>
          <div class="font-semibold">{{ `CPU: ${(d.cused / 1000).toFixed(2)} /
            ${d.cpus} cores` }}<span v-html="percToColor(d.cperc)"></span></div>
          <div class="font-semibold">{{ `MEM: ${changeUnit(d.mused, d.munit, "Gi").toFixed(2)} / ${changeUnit(d.memory,
            d.memory_unit, "Gi")} GiB` }}<span v-html="percToColor(d.mperc)"></span></div>
          <div class="font-semibold">{{ `STG: ${changeUnit(d.dused, "", "Gi")} / ${changeUnit(d.dcap, "", "Gi")} GiB`
          }}<span v-html="percToColor(d.dperc)"></span>
          </div>
          <hr class="my-2" />
          <div class="text-sm">{{ `Internal IP: ${d.internal_ip}` }}</div>
          <div class="text-sm">{{ `Kernel: ${d.kernel_version}` }}</div>
          <div class="text-sm">{{ `Image: ${d.os_image}` }}</div>
        </template>
      </Card>
    </div>
  </div>
</template>
<style scoped>
.blink {
  animation: blinker 1s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>
<!-- <style src="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&icon_names=home&display=block" /> -->
