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
  <table class="table">
    <thead>
      <tr>
        <th class="left">Monat</th>
        <th class="right">Kontostand</th>
        <th class="right">Tilgung</th>
        <th class="right">Zinsen</th>
        <th class="right">Rate</th>
        <th class="right">Sondertilgung</th>
        <th class="right">Zinsentotal</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(rate, index) in store.monate">
        <tr
          v-if="rate.monat_absolute % 12 == 0 || index == 0"
          class="subheader full-row"
        >
          <td colspan="1000">
            {{ Math.floor(rate.monat_absolute / 12) }}
          </td>
        </tr>

        <tr
          v-if="rate.monat_relative == storeDarlehen.Laufzeit"
          class="subheader full-row"
        >
          <td>Ende der Zinsbindung</td>
        </tr>

        <tr>
          <td class="left">
            {{ Math.floor(rate.monat_absolute / 12) }}
            {{ textMonatLang(rate.monat_absolute % 12) }}
          </td>
          <td class="right">
            <ValueCurrency :value="rate.darlehen * -1" class="monospace" />
          </td>
          <td class="right">
            <ValuePercent :value="rate.tilgung" class="monospace" />
          </td>
          <td class="right">
            <ValueCurrency :value="rate.zins * -1" class="monospace" />
          </td>
          <td class="right">
            <ValueCurrency :value="rate.rate" class="monospace" />
          </td>
          <td class="right">
            <ValueCurrency
              :value="rate.sondertilgung"
              :zero="false"
              class="monospace"
            />
          </td>
          <td class="body right">
            <ValueCurrency :value="rate.zins_total" class="monospace" />
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<style scoped>
.table {
  width: 100%;
  border-spacing: 0px;
  border-collapse: separate;
}

tr th {
  font-weight: bold;
  font-size: 13pt;
  border-bottom: 2px solid #000;
}

tr.subheader td {
  font-weight: bold;
  border-bottom: 1px solid #000;
}

/* ---------------------------------------- */
</style>
