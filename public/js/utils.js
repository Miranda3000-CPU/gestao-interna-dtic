/**
 * utils.js
 * Funções utilitárias: highlight_nome_guerra e helpers.
 */
const Utils = (function () {
  /**
   * Retorna HTML com o nome_guerra destacado em <b> dentro do nome completo.
   * Equivalente ao filtro Jinja2 highlight_nome_guerra do app.py
   */
  function highlightNomeGuerra(nome, nomeGuerra) {
    nome = (nome || '').trim();
    nomeGuerra = (nomeGuerra || '').trim();

    if (!nome) return '';
    if (!nomeGuerra) return escapeHTML(nome);

    // Tenta match exato (case-insensitive)
    const escapedNG = escapeRegex(nomeGuerra);
    const matchFull = nome.match(new RegExp(escapedNG, 'i'));
    if (matchFull) {
      const start = matchFull.index;
      const end = start + nomeGuerra.length;
      return (
        escapeHTML(nome.slice(0, start)) +
        '<b>' + escapeHTML(nome.slice(start, end)) + '</b>' +
        escapeHTML(nome.slice(end))
      );
    }

    // Tenta tokens de 2+ letras maiúsculas
    const tokens = nomeGuerra.toUpperCase().match(/[A-ZÀ-Ý0-9]+/g) || [];
    const uniq = [...new Set(tokens)].filter(t => t.length >= 2).sort((a, b) => b.length - a.length);
    if (uniq.length === 0) return escapeHTML(nome);

    const spans = [];
    for (const token of uniq) {
      const re = new RegExp('(?<!\\w)' + escapeRegex(token) + '(?!\\w)', 'gi');
      let m;
      while ((m = re.exec(nome)) !== null) {
        spans.push([m.index, m.index + token.length]);
      }
    }

    if (spans.length === 0) return escapeHTML(nome);

    // Ordena e merge
    spans.sort((a, b) => a[0] - b[0] || (b[1] - b[0]) - (a[1] - a[0]));
    const merged = [];
    for (const [s, e] of spans) {
      if (merged.length === 0 || s >= merged[merged.length - 1][1]) {
        merged.push([s, e]);
      }
    }

    let result = '';
    let last = 0;
    for (const [s, e] of merged) {
      result += escapeHTML(nome.slice(last, s));
      result += '<b>' + escapeHTML(nome.slice(s, e)) + '</b>';
      last = e;
    }
    result += escapeHTML(nome.slice(last));
    return result;
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /**
   * Parse int seguro, com fallback.
   */
  function safeInt(value, defaultValue, min, max) {
    const n = parseInt(value, 10);
    if (isNaN(n)) return defaultValue;
    if (min !== undefined && n < min) return defaultValue;
    if (max !== undefined && n > max) return defaultValue;
    return n;
  }

  return {
    highlightNomeGuerra,
    safeInt,
  };
})();