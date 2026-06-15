/**
 * holidays.js
 * Cálculo de feriados brasileiros (port do app.py)
 * Expõe as funções no objeto global `Holidays`.
 */
const Holidays = (function () {
  function easterSunday(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  }

  function makeDate(year, month, day) {
    return new Date(year, month - 1, day);
  }

  function dateKey(d) {
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }

  /**
   * Retorna um Set com as chaves "YYYY-M-D" dos feriados do ano.
   */
  function getHolidays(year) {
    const pascoa = easterSunday(year);
    const feriados = [
      makeDate(year, 1, 1),
      makeDate(year, 4, 21),
      makeDate(year, 5, 1),
      makeDate(year, 9, 7),
      makeDate(year, 10, 12),
      makeDate(year, 11, 2),
      makeDate(year, 11, 15),
      makeDate(year, 11, 20),
      makeDate(year, 12, 25),
      // Móveis baseados na Páscoa
      addDays(pascoa, -47), // Carnaval
      addDays(pascoa, -2),  // Sexta-feira Santa
      addDays(pascoa, 60),  // Corpus Christi
    ];

    const set = new Set();
    for (const d of feriados) {
      set.add(dateKey(d));
    }
    return set;
  }

  function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  /**
   * Constrói array de dias para folha civil.
   * Retorna: [{ numero: Number, is_fim_de_semana: Boolean, is_feriado: Boolean, texto: String }]
   */
  function buildDiasCivis(year, month) {
    const numDias = new Date(year, month, 0).getDate(); // último dia do mês
    const feriados = getHolidays(year);
    const dias = [];

    for (let day = 1; day <= numDias; day++) {
      const dt = new Date(year, month - 1, day);
      const dataKey = dateKey(dt);
      const isFeriado = feriados.has(dataKey);
      const isFimDeSemana = dt.getDay() === 0 || dt.getDay() === 6;

      let texto = '';
      if (isFeriado) {
        texto = 'FERIADO';
      } else if (dt.getDay() === 6) {
        texto = 'SÁBADO';
      } else if (dt.getDay() === 0) {
        texto = 'DOMINGO';
      }

      dias.push({
        numero: day,
        is_fim_de_semana: isFimDeSemana,
        is_feriado: isFeriado,
        texto: texto,
      });
    }

    return dias;
  }

  /**
   * Constrói array de dias para folha militar.
   * Retorna: [{ numero: String (zero-padded), tipo: String, texto: String }]
   */
  function buildDiasMilitares(year, month) {
    const numDias = new Date(year, month, 0).getDate();
    const dias = [];

    for (let day = 1; day <= numDias; day++) {
      const dt = new Date(year, month - 1, day);
      let tipo = 'dia_util';
      let texto = '';

      if (dt.getDay() === 6) {
        tipo = 'sabado';
        texto = 'SÁBADO';
      } else if (dt.getDay() === 0) {
        tipo = 'domingo';
        texto = 'DOMINGO';
      }

      dias.push({
        numero: String(day).padStart(2, '0'),
        tipo: tipo,
        texto: texto,
      });
    }

    return dias;
  }

  /**
   * Retorna nome do mês em português (maiúsculo).
   */
  function monthName(month) {
    const names = [
      'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
      'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
    ];
    return names[month - 1] || '';
  }

  return {
    buildDiasCivis,
    buildDiasMilitares,
    monthName,
  };
})();