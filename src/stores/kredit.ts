import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  __tilgungsplan,
  __sondertilgungsplan,
  __zinstageplan,
  __tilgungsplan_planed,
} from "./config";
import { useDarlehenStore } from "./darlehen";

export function useBaseKreditStore() {
  return defineKreditStore("Plan", __tilgungsplan_planed, {}, __zinstageplan)();
}
export function useRealKreditStore() {
  return defineKreditStore(
    "Aktuell",
    __tilgungsplan,
    __sondertilgungsplan,
    __zinstageplan,
  )();
}

export function defineKreditStore(
  storeName: string,
  initialTilgungsplan: Record<number, number> = {},
  initialSondertilgungsplan: Record<number, number> = {},
  initialZinstageplan: Record<number, number> = {},
) {
  const storeDarlehen = useDarlehenStore();

  return defineStore(storeName, () => {
    const id = ref(storeName);

    const tilgungsplan = ref(initialTilgungsplan);
    const sondertilgungsplan = ref(initialSondertilgungsplan);
    const zinstageplan = ref(initialZinstageplan);

    function __ts(monat_index: number): number {
      do {
        if (monat_index in tilgungsplan.value) {
          return tilgungsplan.value[monat_index] ?? storeDarlehen.Tilgungssatz;
        }
        monat_index--;
      } while (monat_index > 0);
      return storeDarlehen.Tilgungssatz;
    }

    const compact = computed(() => {
      return monate.value.filter((item) => {
        return (
          item.monat_relative == 0 ||
          item.monat_absolute % 12 == 0 ||
          item.monat_absolute % 12 == 11 ||
          item.monat_relative == monate.value.length - 1 ||
          item.monat_relative == storeDarlehen.Laufzeit ||
          item.sondertilgung > 0
        );
      });
    });

    const monate = computed(() => {
      let d: number = storeDarlehen.Darlehenssumme * 100;
      let result = [];

      let index: number = 0;
      let zt: number = 0;

      let FirstZinsrate = storeDarlehen.Darlehenssumme * storeDarlehen.Zinssatz;

      while (d > 0) {
        let _tage = zinstageplan.value[index] ?? 30;
        let _tilgungssatz = __ts(index);
        let _tilungsrate = storeDarlehen.Darlehenssumme * _tilgungssatz;
        let _sondertilgung = sondertilgungsplan.value[index] ?? 0;
        let _zinsrate = Math.round(
          (((d * storeDarlehen.Zinssatz) / 12) * _tage) / 30,
        );
        let rate = Math.round(
          ((_tilungsrate + (FirstZinsrate * _tage) / 30) / 12) * 100,
        );
        let real_rate = Math.min(d + _zinsrate, rate);
        d = d - real_rate + _zinsrate - _sondertilgung * 100;
        zt = zt + _zinsrate;
        result.push({
          monat_absolute: storeDarlehen.Beginn + index,
          monat_relative: index,
          darlehen: d / 100,
          rate: real_rate / 100,
          tilgung: _tilgungssatz,
          zins: _zinsrate / 100,
          zins_total: zt / 100,
          sondertilgung: _sondertilgung,
        });

        index++;
      }
      return result;
    });

    const zinsen_total = computed(() => {
      const lastRate = monate.value[monate.value.length - 1];
      return lastRate?.zins_total ?? 0;
    });

    return {
      id,
      monate,
      zinsen_total,
      tilgungsplan,
      sondertilgungsplan,
      compact,
    };
  });
}
