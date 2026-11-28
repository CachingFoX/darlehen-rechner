<script setup lang="ts">
import { ref, computed } from "vue";
import OverviewTable from "./components/OverviewTable.vue";
import MonthlyTable from "./components/MonthlyTable.vue";
import DownUpload from "./components/DownUpload.vue";

import { useBaseKreditStore, useRealKreditStore } from "./stores/kredit.ts";
import { useDarlehenStore } from "./stores/darlehen.ts";

const plaene = [useBaseKreditStore(), useRealKreditStore()];
const plan_index = ref(0);
const plan = computed(() => plaene[plan_index.value]);
const darlehen = useDarlehenStore();

const version = __APP_VERSION__;
const commit = __COMMIT_HASH__;

const storeDarlehen = useDarlehenStore();
</script>

<template>
  <div class="header">Annuitätendarlehen Rechner</div>

  <div class="version">
    Version:
    <a
      :href="
        'https://github.com/CachingFoX/darlehen-rechner/releases/tag/' + version
      "
      >{{ version }}</a
    >
    Hash:
    <a
      :href="'https://github.com/CachingFoX/darlehen-rechner/commit/' + commit"
      >{{ commit }}</a
    >
  </div>

  <DownUpload />

  <OverviewTable :plan-origin="plaene[0]" :plan-current="plan" />

  <div style="margin-bottom: 1em; display: flex; gap: 1em">
    <button
      v-for="(plan, index) in plaene"
      class="button"
      :class="{ selected: plan_index == index }"
      @click="plan_index = index"
    >
      {{ plan.id }}
    </button>
  </div>
  <MonthlyTable :plan="plan" />
</template>

<style scoped>
.button {
  padding: 1em;
  width: 100%;
}
.button.selected {
  border: 3px solid #f00;
}
.header {
  font-size: 48pt;
  font-weight: 200;
  color: #222;
  border-bottom: 2px solid #222;
  line-height: 1;
}
.version {
  margin-bottom: 0.5em;
  padding-bottom: 0.15em;
}
</style>
