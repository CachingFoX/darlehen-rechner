<script setup lang="ts">
import { defineProps, defineModel, computed } from "vue";

const props = defineProps({
  decimals: { type: Number, default: 2 },
  locale: { type: String, default: "de-DE" },
  unit: { type: String, default: "" },
  value: { type: Number, default: null },
  zero: { type: Boolean, default: true },
});
// const model = defineModel<number>({ default: '' });

function runden(wert: number): number {
  if (!Number.isFinite(wert)) return 0;
  return Number(wert.toFixed(props.decimals));
}

const text = computed(() => {
  if (!Number.isFinite(props.value)) return 0;
  if (props.value == 0 && props.zero != null) {
    //  return props.zero;
  }
  const num = Number(props.value.toFixed(props.decimals));
  return num.toLocaleString(props.locale, {
    minimumFractionDigits: props.decimals,
    maximumFractionDigits: props.decimals,
  });
});
</script>

<template>
  <div class="valueunit-container" :class="{ negative: props.value < 0 }">
    <div
      class="value"
      :style="{ display: props.value || props.zero ? 'inline' : 'none' }"
    >
      {{ text }}
    </div>
    <div
      class="unit"
      :style="{ display: props.value || props.zero ? 'inline' : 'none' }"
    >
      {{ props.unit }}
    </div>
    <!--<input v-if="model" :type="props.type" v-model="model"/>-->
  </div>
</template>

<style scoped>
.valueunit-container {
  display: inline-flex;
  justify-content: flex-end;
  grid-gap: 0.15rem;
}
.valueunit-container > .value {
  text-align: right;
}
.negative {
  color: red;
}
</style>
