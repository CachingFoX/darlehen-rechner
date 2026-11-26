<script setup lang="ts">
import { ref, computed, watch } from "vue";
import ValueCurrency from "./ValueCurrency.vue";
import ValuePercent from "./ValuePercent.vue";
import {
  textMonatKurzJahr,
  textMonatLangJahr,
  textZeitspanne,
} from "../stores/time.ts";

const props = defineProps({
  planOrigin: { type: Object, default: null },
  planCurrent: { type: Object, default: null },
});

// const store = ref(props.plan);

import { useDarlehenStore } from "../stores/darlehen.ts";

const storeDarlehen = useDarlehenStore();

/*
watch(
  () => props.plan,
  (neu, alt) => {
    store.value = neu;
  },
);
*/

const is_show = computed(() => props.planOrigin.id != props.planCurrent.id);
</script>

<template>
  <div class="header">Annuitätendarlehen Rechner</div>
  <div class="table-container">
    <div class="table-main">
      <div>
        <div class="table">
          <div>Darlehnssumme</div>
          <div class="col-span-2">
            <ValueCurrency :value="storeDarlehen.Darlehenssumme" />
          </div>

          <div>Zinssatz</div>
          <div class="col-span-2">
            <ValuePercent :value="storeDarlehen.Zinssatz" />
          </div>

          <div>Tilgungssatz</div>
          <div class="col-span-2">
            <ValuePercent :value="storeDarlehen.Tilgungssatz" />
          </div>

          <div>Bereitstellung</div>
          <div class="col-span-2">
            {{ textMonatLangJahr(storeDarlehen.Beginn) }}
          </div>

          <div>Laufzeit</div>
          <div class="col-span-2">
            {{ textZeitspanne(storeDarlehen.Laufzeit) }}
          </div>

          <div>Ende Zinsbindung</div>
          <div class="col-span-2">
            {{
              textMonatLangJahr(storeDarlehen.Beginn + storeDarlehen.Laufzeit)
            }}
          </div>

          <div></div>
          <div style="font-weight: bold; margin-top: 1em">
            {{ props.planOrigin.id }}
          </div>
          <div style="font-weight: bold; margin-top: 1em">
            <div v-show="is_show">{{ props.planCurrent.id }}</div>
          </div>

          <div>Restschuld</div>
          <div>
            <ValueCurrency
              :value="
                props.planOrigin.monate.length > storeDarlehen.Laufzeit
                  ? props.planOrigin.monate[storeDarlehen.Laufzeit].darlehn
                  : 0
              "
            />
          </div>
          <div>
            <ValueCurrency
              v-show="is_show"
              :value="
                props.planCurrent.monate.length > storeDarlehen.Laufzeit
                  ? props.planCurrent.monate[storeDarlehen.Laufzeit].darlehn
                  : 0
              "
            />
          </div>

          <div>Letzte Rate</div>
          <div>
            {{
              textMonatLangJahr(
                props.planOrigin.monate.length - 1 + storeDarlehen.Beginn,
              )
            }}
          </div>
          <div>
            <div v-show="is_show">
              {{
                textMonatLangJahr(
                  props.planCurrent.monate.length - 1 + storeDarlehen.Beginn,
                )
              }}
            </div>
          </div>

          <div>Gesamtlaufzeit</div>
          <div>
            {{ textZeitspanne(props.planOrigin.monate.length - 1) }}
          </div>
          <div>
            <div v-show="is_show">
              {{ textZeitspanne(props.planCurrent.monate.length - 1) }}
            </div>
          </div>

          <div>Zinsen</div>
          <div>
            <ValueCurrency :value="props.planOrigin.zinsen_total" />
          </div>
          <div>
            <ValueCurrency
              :value="props.planCurrent.zinsen_total"
              v-show="is_show"
            />
          </div>
        </div>
      </div>
      <div v-show="is_show" class="centeritem" style="border: 3px solid #ccc">
        <div style="display: inline-flex; flex-direction: column">
          <div style="font-size: 20pt; font-weight: bold; text-align: center">
            Ersparnis
          </div>
          <div
            style="
              font-size: 48pt;
              font-weight: 1000;
              font-style: italic;
              color: #00f000;
            "
          >
            <ValueCurrency
              :value="
                props.planOrigin.zinsen_total - props.planCurrent.zinsen_total
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  font-size: 48pt;
  font-weight: 200;
  color: #222;
  border-bottom: 2px solid #222;
  line-height: 1;
  padding-bottom: 0.15em;
  margin-bottom: 0.5em;
}
.table-container {
  margin-bottom: 1.5em;
}

.col-span-2 {
  grid-column: span 2;
}

.table-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.table {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.centeritem {
  display: grid;
  place-items: center; /* horizontal + vertikal */
  line-height: 1.3;
}
</style>
