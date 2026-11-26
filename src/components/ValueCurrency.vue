<script setup lang="ts">
import { defineProps, useAttrs } from "vue";
import ValueUnit from "./ValueUnit.vue";

const attrs = useAttrs();

const props = defineProps({
  value: { type: Number, default: 0 },
  unit: { type: String, default: "€" },
  decimals: { type: Number, default: 2 },
});
</script>

<template>
  <ValueUnit
    v-bind="attrs"
    :value="props.value"
    :unit="props.unit"
    :decimals="props.decimals"
  />
</template>

<style scoped></style>
