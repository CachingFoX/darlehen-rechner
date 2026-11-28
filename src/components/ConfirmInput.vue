<script setup lang="ts">
import { ref, watch } from "vue";
import ValueCurrency from "./ValueCurrency.vue";

// Stellt automatisch den Prop `modelValue` und das Event `update:modelValue` bereit
const model = defineModel<string | number>({
  type: [String, Number],
  default: "",
});

// Optional: Zusätzliche Props für mehr Flexibilität
defineProps({
  placeholder: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "number",
  },
  unit: {
    type: String,
    default: "",
  },
});

// Lokaler Zwischenspeicher
const draftValue = ref(model.value);

const editMode = ref(false);

// Synchronisiert den Zwischenspeicher, falls sich das v-model von außen ändert
watch(model, (newVal) => {
  draftValue.value = newVal;
});

// Wert übernehmen
const confirm = () => {
  model.value = draftValue.value;
  editMode.value = false;
};

// Wert verwerfen und zurücksetzen
const cancel = () => {
  draftValue.value = model.value;
  editMode.value = false;
};

const edit = () => {
  editMode.value = true;
};
</script>

<template>
  <div class="confirm-input">
    <div v-show="!editMode">
      <slot></slot>
    </div>
    <button type="button" @click="edit" v-show="!editMode">Edit</button>
    <input
      v-show="editMode"
      v-model="draftValue"
      :type="type"
      :placeholder="placeholder"
      @keyup.enter="confirm"
      @keyup.esc="cancel"
    />
    <div v-show="editMode">{{ unit }}</div>
    <button type="button" @click="confirm" v-show="editMode">Okay</button>
    <button type="button" @click="cancel" v-show="editMode">Abbrechen</button>
  </div>
</template>

<style scoped>
.confirm-input {
  display: inline-flex;
  gap: 0.5rem;
}
</style>
