<script setup lang="ts">
import { ref, computed, watch } from "vue";
import ValueCurrency from "./ValueCurrency.vue";
import ValuePercent from "./ValuePercent.vue";
import {
  textMonatKurz,
  textMonatLang,
  textMonatKurzJahr,
  textMonatLangJahr,
  textZeitspanne,
} from "../stores/time.ts";
import {
  defineKreditStore,
  useBaseKreditStore,
  useRealKreditStore,
} from "../stores/kredit.ts";

const props = defineProps({
  plan: { type: Object, default: null },
});

const store = ref(props.plan);

import { useDarlehenStore } from "../stores/darlehen.ts";

const storeDarlehen = useDarlehenStore();

watch(
  () => props.plan,
  (neu, alt) => {
    store.value = neu;
    console.log(`Wert geändert von ${alt} zu ${neu}`);
    // hier auf die Änderung reagieren
  },
);
</script>

<template>
  <div class="table">
    <div class="header left">Monat</div>
    <div class="header">Kontostand</div>
    <div class="header">Tilgung</div>
    <div class="header">Zinsen</div>
    <div class="header">Rate</div>
    <div class="header">Sondertilgung</div>
    <div class="header">Zinsentotal</div>

    <template v-for="(rate, index) in store.monate">
      <div
        v-if="rate.monat_absolute % 12 == 0 || index == 0"
        class="subheader full-row"
      >
        {{ Math.floor(rate.monat_absolute / 12) }}
      </div>

      <div
        v-if="rate.monat_relative == storeDarlehen.Laufzeit"
        class="full-row heading2"
      >
        Ende der Zinsbindung
      </div>

      <div class="left">
        {{ Math.floor(rate.monat_absolute / 12) }}
        {{ textMonatLang(rate.monat_absolute % 12) }}
      </div>
      <div class="body">
        <ValueCurrency :value="rate.darlehen * -1" />
      </div>
      <div class="body">
        <ValuePercent :value="rate.tilgung" />
      </div>
      <div class="body"><ValueCurrency :value="rate.zins * -1" /></div>
      <div class="body">
        <ValueCurrency :value="rate.rate" />
      </div>
      <div class="body">
        <ValueCurrency :value="rate.sondertilgung" :zero="false" />
      </div>
      <div class="body"><ValueCurrency :value="rate.zins_total" /></div>
    </template>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}
.table {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}
.table div.full-row {
  grid-column: 1 / 8;
  text-align: left;
}

.table div.subheader {
  font-weight: bold;
  border-bottom: 1px solid #000;
  text-align: left;
  margin-top: 3px;
}

.table div.heading2 {
  text-align: left;
  margin-bottom: -5px;
  color: #aaa;
}

.table div.header {
  font-weight: bold;
  border-bottom: 2px solid #000;
  margin-bottom: 3px;
  font-size: 13pt;
}
.table div.body {
  font-family: monospace;
}

.table div {
  text-align: right;
}
.table div.left {
  text-align: left;
}
</style>
