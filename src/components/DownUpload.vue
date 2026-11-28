<script setup lang="ts">
import { ref, computed } from "vue";

import { useBaseKreditStore, useRealKreditStore } from "../stores/kredit.ts";
import { useDarlehenStore } from "../stores/darlehen.ts";

const plaene = [useBaseKreditStore(), useRealKreditStore()];
const plan_index = ref(0);
const plan = computed(() => plaene[plan_index.value]);
const darlehen = useDarlehenStore();

const storeDarlehen = useDarlehenStore();

function downloadJSON(data, filename = "darlehen.json") {
  const json = JSON.stringify(data, null, 2); // null, 2 = hübsch formatiert
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  // Aufräumen
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function fox1() {
  downloadJSON(storeDarlehen.$state);
}

function importiere(json) {
  // Hier ggf. validieren, bevor der State überschrieben wird
  if (typeof json !== "object" || json === null) {
    throw new Error("Ungültiges JSON-Format");
  }
  storeDarlehen.$patch(json);
}

const fileInput = ref(null);

async function onFileChange(event) {
  // fehler.value = "";
  const file = event.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const json = JSON.parse(text);
    importiere(json);
  } catch (e) {
    let fehler =
      e instanceof SyntaxError
        ? "Die Datei enthält kein gültiges JSON."
        : e.message;
    console.error(fehler);
  } finally {
    event.target.value = ""; // erlaubt erneutes Hochladen derselben Datei
  }
}
</script>

<template>
  <div style="margin-bottom: 1em; display: flex; gap: 1em">
    <button class="button" @click="fox1">Download</button>
    <button class="button" type="button" @click="fileInput.click()">
      Uplaod
    </button>
    <input
      ref="fileInput"
      type="file"
      accept=".json,application/json"
      @change="onFileChange"
      hidden
    />
  </div>
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
