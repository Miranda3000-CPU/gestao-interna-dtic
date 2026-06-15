/**
 * api.js
 * Chamadas fetch à API REST do servidor Express.
 */
const API = (function () {
  const BASE = '/api';

  async function request(url, options = {}) {
    const resp = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const data = await resp.json();
    if (!resp.ok) {
      throw new Error(data.error || 'Erro na requisição');
    }
    return data;
  }

  return {
    // Civis
    getCivis: () => request(`${BASE}/civis`),
    addCivil: (civil) => request(`${BASE}/civis`, {
      method: 'POST',
      body: JSON.stringify(civil),
    }),
    delCivil: (id) => request(`${BASE}/civis/${id}`, { method: 'DELETE' }),

    // Militares
    getMilitares: () => request(`${BASE}/militares`),
    addMilitar: (militar) => request(`${BASE}/militares`, {
      method: 'POST',
      body: JSON.stringify(militar),
    }),
    delMilitar: (id) => request(`${BASE}/militares/${id}`, { method: 'DELETE' }),
  };
})();