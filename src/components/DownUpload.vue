<script setup lang="ts">
import { ref, computed } from "vue";

import { useBaseKreditStore, useRealKreditStore } from "../stores/kredit.ts";
import { useDarlehenStore } from "../stores/darlehen.ts";

const plaene = [useBaseKreditStore(), useRealKreditStore()];
const darlehen = useDarlehenStore();

const storeDarlehen = useDarlehenStore();

const fileInput = ref<HTMLInputElement | null>(null);

function downloadJSON(data: object, filename = "darlehen.json") {
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
    Verlaeufe: [plaene[0]?.$state, plaene[1]?.$state],
  };

  downloadJSON(data);
}

interface VerlaufData {
  id?: string;
  name?: string;
  tilgungsplan?: Record<number, number>;
  sondertilgungsplan?: Record<number, number>;
  zinstageplan?: Record<number, number>;
}

interface DarlehenData {
  Version?: number;
  Darlehen?: object;
  Verlaeufe?: VerlaufData[];
}

function importiere(data: DarlehenData) {
  // Hier ggf. validieren, bevor der State überschrieben wird
  if (typeof data !== "object" || data === null) {
    throw new Error("Ungültiges JSON-Format");
  }
  if (!("Version" in data)) {
    throw new Error(
      "Ungültiges JSON-Format: Missing member 'Version' or 'version'",
    );
  }
  if (data.Version != 1) {
    throw new Error(
      "Ungültiges JSON-Format: Unknown/Unsupported version " + data.Version,
    );
  }

  if (data.Darlehen) {
    // TODO reset
    storeDarlehen.$patch(data.Darlehen);
  }

  const ersterVerlauf = data.Verlaeufe?.[0];
  if (plaene[0] && ersterVerlauf) {
    plaene[0].reset();
    plaene[0].$patch(ersterVerlauf);
  }

  const zweiterVerlauf = data.Verlaeufe?.[0];
  if (plaene[1] && zweiterVerlauf) {
    plaene[1].reset();
    plaene[1].$patch(zweiterVerlauf);
  }
}

function uploadDarlehenDaten() {
  fileInput.value?.click();
}

async function onFileChange(event: Event) {
  // fehler.value = "";
  if (event == null) {
    return;
  }

  const target = event.target as HTMLInputElement | null;
  const file = target?.files?.[0];

  if (!file) return; // Bricht ab, falls keine Datei gewählt wurde

  try {
    const text = await file.text();
    const json = JSON.parse(text) as DarlehenData;
    importiere(json);
  } catch (e) {
    let fehler =
      e instanceof SyntaxError
        ? "Die Datei enthält kein gültiges JSON."
        : e instanceof Error
          ? e.message
          : String(e);
    console.error(fehler);
  } finally {
    (event.target as HTMLInputElement).value = "";
  }
}
</script>

<template>
  <div style="margin-bottom: 1em; display: flex; gap: 1em">
    <button class="button" @click="downloadDarlehenDaten">Download</button>
    <button class="button" type="button" @click="uploadDarlehenDaten">
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
