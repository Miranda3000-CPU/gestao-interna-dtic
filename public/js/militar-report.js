/**
 * militar-report.js
 * Renderiza a folha de serviço extraordinário militar na página folha_militar.html
 * Port do template Jinja2 folha_militar.html
 */
(async function () {
  const params = new URLSearchParams(window.location.search);
  const notaNum = params.get('nota_num') || '001';

  const militares = await API.getMilitares();

  const now = new Date();
  const ano = now.getFullYear();
  const mes = now.getMonth() + 1;
  const mesNome = Holidays.monthName(mes);
  const ultimoDia = new Date(ano, mes, 0).getDate();

  const periodo = `01 A ${String(ultimoDia).padStart(2, '0')} DE ${mesNome} DE ${ano}`;
  const nota = `${notaNum}/${ano}`;
  const dias = Holidays.buildDiasMilitares(ano, mes);

  const container = document.getElementById('content');
  let html = '';

  for (const m of militares) {
    html += renderMilitarPage(m, { nota, periodo, dias });
  }

  container.innerHTML = html;
})();

function renderMilitarPage(m, p) {
  const rows = p.dias.map(dia => {
    const isSabado = dia.tipo === 'sabado';
    const isDomingo = dia.tipo === 'domingo';

    let assinaturaCell = '';
    if (isSabado) {
      assinaturaCell = '<span class="weekend-text">SÁBADO</span>';
    } else if (isDomingo) {
      assinaturaCell = '<span class="weekend-text">DOMINGO</span>';
    } else {
      assinaturaCell = Utils.highlightNomeGuerra(m.nome, m.nome_guerra);
    }

    return `
      <tr>
        <td class="col-dia">${dia.numero}</td>
        <td class="col-ass">${assinaturaCell}</td>
        <td class="col-hora">17:00</td>
        <td class="col-visto"></td>
      </tr>`;
  }).join('');

  return `
    <div class="container page-break">
      <div class="header-box">
        <img src="img/header_militar.png" class="header-logo" alt="Logos">
        <div class="header-text">
          CORPO DE BOMBEIROS MILITAR DO PARÁ E<br>
          COORDENADORIA ESTADUAL DE DEFESA CIVIL<br>
          DIRETORIA DE TECNOLOGIA DA INFORMAÇÃO<br>
          E COMUNICAÇÃO
        </div>
      </div>

      <div class="title-box">
        REGISTRO DE SERVIÇO EXTRAORDINÁRIO / REFORÇO DO EXPEDIENTE<br>
        <span style="font-weight: normal;">NOTA DE SERVIÇO Nº ${p.nota}</span><br>
        PERÍODO DE ${p.periodo}
      </div>

      <div class="info-section">
        SEÇÃO: Diretoria de Tecnologia da Informação e Comunicação (DTIC)<br>
        NOME: ${Utils.highlightNomeGuerra(m.nome, m.nome_guerra)}
      </div>

      <table>
        <thead>
          <tr>
            <th class="col-dia">DIA</th>
            <th class="col-ass">ASSINATURA DO MILITAR</th>
            <th class="col-hora">HORÁRIO DE<br>SAÍDA</th>
            <th class="col-visto">VISTO DO OFICIAL SUPERIOR</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr>
            <td colspan="2" class="total-row" style="text-align: center; border-right: 1px solid #d9d9d9;">TOTAL DE EXTRAORDINÁRIAS</td>
            <td style="background-color: #d9d9d9; border: 1px solid black; border-left: 1px solid #d9d9d9;"></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <div class="footer-block">
        <div class="footer-left">
          <img src="img/dte_logo.png" class="footer-logo" alt="DTE">
          <div>
            <strong>Diretoria de Tecnologia da Informática e Comunicação - <span style="color:rgb(0, 0, 0);">DTIC</span></strong><br>
            Av. Júlio César, 3000. Fone: (91) 8899-6479<br>
            CEP:66447-000. Belém-PA<br>
            E-mail: <a href="mailto:suportemaccbm@gmail.com">suportemaccbm@gmail.com</a>
          </div>
        </div>

        <div class="footer-right">
          <div class="signature-text">
            ________________________________<br>
            <br>
            <br>
            ____ / ____ / ________
          </div>
        </div>
      </div>
    </div>`;
}