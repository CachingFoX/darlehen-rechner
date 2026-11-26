export function textZeitspanne(monate: number) {
  let r: Array<string> = [];

  if (monate > 11) {
    r.push(Math.floor(monate / 12) + " Jahr" + (monate > 23 ? "e" : ""));
  }

  monate = monate % 12;
  if (monate > 0) {
    r.push(monate + " Monat" + (monate > 1 ? "e" : ""));
  }

  return r.join(" ");
}

const monatname_kurz = [
  "Jan",
  "Feb",
  "Mrz",
  "Apr",
  "Mai",
  "Jun",
  "Jul",
  "Aug",
  "Spt",
  "Okt",
  "Nov",
  "Dez",
];

const monatname_lang = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

export function textMonatKurz(month: number) {
  return monatname_kurz[month % 12];
}

export function textMonatLang(month: number) {
  return monatname_lang[month % 12];
}

export function textMonatKurzJahr(month: number) {
  return monatname_kurz[month % 12] + " " + String(Math.floor(month / 12));
}

export function textMonatLangJahr(month: number) {
  return monatname_lang[month % 12] + " " + String(Math.floor(month / 12));
}
