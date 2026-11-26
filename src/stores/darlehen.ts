import { defineStore } from "pinia";
import { ref, computed } from "vue";

/*
  Dieser Pinia Store enthält alle Grunddaten zu einem Annuitätendarlehen.
*/
export const useDarlehenStore = defineStore(
  "Darlehen",
  () => {
    const Darlehenssumme = ref(50000);
    const Zinssatz = ref(0.05);
    const Beginn = ref(2020 * 12);
    const Laufzeit = ref(10 * 12);
    const Tilgungssatz = ref(0.01);

    return { Darlehenssumme, Zinssatz, Beginn, Laufzeit, Tilgungssatz };
  },
  {
    persist: true,
  },
);
