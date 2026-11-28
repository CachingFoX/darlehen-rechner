<script setup lang="ts">
import { ref, computed } from "vue";

import { useBaseKreditStore, useRealKreditStore } from "../stores/kredit.ts";
import { useDarlehenStore } from "../stores/darlehen.ts";

const plaene = [useBaseKreditStore(), useRealKreditStore()];
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

function downloadDarlehenDaten() {
  let data = {
    Version: 1,
    Darlehen: storeDarlehen.$state,
    Verlaeufe: [plaene[0].$state, plaene[1].$state],
  };
  downloadJSON(data);
}

function importiere(data) {
  // Hier ggf. validieren, bevor der State überschrieben wird
  if (typeof data !== "object" || data === null) {
    throw new Error("Ungültiges JSON-Format");
  }
  if (!("version" in data) && !("Version" in data)) {
    throw new Error(
      "Ungültiges JSON-Format: Missing member 'Version' or 'version'",
    );
  }
  if (data.Version != 1) {
    throw new Error(
      "Ungültiges JSON-Format: Unknown/Unsupported version " + data.Version,
    );
  }

  storeDarlehen.$patch(data.Darlehen);
  plaene[0].reset();
  plaene[0].$patch(data.Verlaeufe[0]);
  plaene[1].reset();
  plaene[1].$patch(data.Verlaeufe[1]);
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
    <button class="button" @click="downloadDarlehenDaten">Download</button>
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
</style>
