/**
 * civil-report.js
 * Renderiza a folha de frequência civil na página folha_civil.html
 * Port do template Jinja2 folha_civil.html
 */
(async function () {
  const params = new URLSearchParams(window.location.search);

  const comandante = params.get('comandante') || 'LUIZ ALFREDO SILVA GALIZA DOS SANTOS – TCEL QOBM';
  const nomeGuerraComandante = params.get('nome_guerra_comandante') || 'LUIZ ALFREDO';
  const mes = Utils.safeInt(params.get('mes'), new Date().getMonth() + 1, 1, 12);
  const ano = Utils.safeInt(params.get('ano'), new Date().getFullYear(), 1900, 2100);
  const mesNome = Holidays.monthName(mes);

  const voluntarios = await API.getCivis();
  const dias = Holidays.buildDiasCivis(ano, mes);

  const container = document.getElementById('content');
  let html = '';

  const padrao = {
    comandante,
    nomeGuerraComandante,
    mesNome,
    ano,
    dias,
  };

  for (const vc of voluntarios) {
    html += renderCivilPage(vc, padrao);
  }

  container.innerHTML = html;
})();

function renderCivilPage(vc, p) {
  const turno = (vc.turno || '').toLowerCase().trim();
  const horarioEntrada = turno === 'tarde' ? '12:00' : '09:00';
  const horarioSaida = turno === 'tarde' ? '18:00' : '15:00';
  const cargaHoraria = turno === 'tarde' ? '12:00 ÀS 18:00' : '09:00 ÀS 15:00';

  const rows = p.dias.map(dia => {
    if (dia.is_fim_de_semana || dia.is_feriado) {
      return `
        <tr>
          <td class="col-dia">${dia.numero}</td>
          <td class="weekend-text">${dia.texto}</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>`;
    } else {
      return `
        <tr>
          <td class="col-dia">${dia.numero}</td>
          <td></td>
          <td class="center bold">${horarioEntrada}</td>
          <td class="center bold">${horarioSaida}</td>
          <td></td>
        </tr>`;
    }
  }).join('');

  return `
    <div class="container page-break">
      <div class="header-box">
        <img src="img/brasao.jpg" class="header-logo" alt="Brasão">
        <div class="header-text">
          ESTADO DO PARÁ<br>
          CORPO DE BOMBEIROS MILITAR<br>
          COMANDO GERAL<br>
          DIRETORIA DE PESSOAL
        </div>
      </div>

      <div class="title-box">
        REGISTRO DE FREQUÊNCIA<br>
        <span style="text-decoration: none; font-size: 11px;">MÊS: <span class="uppercase">${p.mesNome}</span> : ${p.ano}</span>
      </div>

      <table style="border: none; margin-bottom: 5px;">
        <tr style="border: none;">
          <td style="border: none; padding: 2px;">
            <strong>UBM:</strong> QCG &nbsp;&nbsp;&nbsp; <strong>SEÇÃO:</strong> DTIC
          </td>
          <td style="border: none; text-align: right; padding: 2px;">
            <strong>HORÁRIO:</strong> ${cargaHoraria}
          </td>
        </tr>
        <tr style="border: none;">
          <td style="border: none; padding: 2px;" colspan="2">
            <strong>VOLUNTÁRIO CIVIL:</strong>
            ${Utils.highlightNomeGuerra(vc.nome, vc.nome_guerra)}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <strong>FUNÇÃO:</strong> ${vc.funcao.toUpperCase()}
          </td>
        </tr>
        <tr style="border: none;">
          <td style="border: none; padding: 2px; font-size: 10px;" colspan="2">
            <strong>CARGA HORÁRIA SEMANAL DE 30 HORAS, CONFORME PORTARIA Nº 90 DE 18 DE FEVEREIRO DE 2009</strong>
          </td>
        </tr>
      </table>

      <table>
        <thead>
          <tr>
            <th class="col-dia">DIA</th>
            <th style="width: 45%;">ASSINATURA</th>
            <th style="width: 15%;">ENTRADA</th>
            <th style="width: 15%;">SAÍDA</th>
            <th style="width: 20%;">VISTO RESPONSÁVEL</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr>
            <td colspan="5" class="total-row">
              TOTAL DE HORAS TRABALHADAS
            </td>
          </tr>
        </tbody>
      </table>

      <div style="font-weight: bold; margin-top: 5px; font-size: 10px;">
        FALTAS: _______________ ATRASOS: _______________
      </div>

      <div class="signature-block">
        <div class="signature-line"></div>
        ASSINATURA DO CMTE
      </div>
    </div>

    <div class="container page-break">
      <div class="header-box">
        <img src="img/brasao.jpg" class="header-logo" alt="Brasão">
        <div class="header-text">
          ESTADO DO PARÁ<br>
          CORPO DE BOMBEIROS MILITAR<br>
          COMANDO GERAL<br>
          DIRETORIA DE PESSOAL
        </div>
      </div>

      <div style="border: 1px solid black; padding: 5px; margin-bottom: 5px; font-size: 11px;">
        <strong>UBM:</strong> QCG &nbsp;&nbsp;&nbsp;&nbsp; <strong>SEÇÃO:</strong> DTIC<br>
        <strong>COMANDANTE:</strong>
        ${Utils.highlightNomeGuerra(p.comandante, p.nomeGuerraComandante)}<br>
        <strong>RESPONSÁVEL PELO PROJETO:</strong>
      </div>

      <div style="border: 1px solid black; padding: 5px; margin-bottom: 5px; font-size: 10px;">
        <div class="center bold" style="margin-bottom: 5px;">ASPECTOS GERAIS A SEREM OBSERVADOS MENSALMENTE</div>
        A – PONTUALIDADE<br>
        B – ASSIDUIDADE<br>
        C – CUMPRIMENTO INTEGRAL DE CARGA HORÁRIA DIÁRIA<br>
        D – HIGIENE E APRESENTAÇÃO PESSOAL<br>
        E – QUALIDADE DO(S) SERVIÇO(S) PRESTADO(S)<br>
        F – ADAPTAÇÃO AS NORMAS DA INSTITUIÇÃO<br>
        G – COMUNICABILIDADE (FLUÊNCIA VERBAL, ATENCIOSIDADE, LINGUAGEM ADEQUADA.)<br>
        H – SOCIABILIDADE (RELACIONAMENTO INTERPESSOAL, INTEGRAÇÃO GRUPAL, ADAPTAÇÃO AO AMBIENTE)<br>
        I – DINAMISMO (MOTIVAÇÃO, INTERESSE, INICIATIVA, CRIATIVIDADE)
      </div>

      <div style="border: 1px solid black; padding: 5px; border-bottom: none; font-size: 11px;">
        <strong>AVALIAÇÃO DO MÊS:</strong> <span class="uppercase">${p.mesNome}</span> : ${p.ano}
      </div>

      <table class="eval-table">
        <thead>
          <tr>
            <th colspan="2" style="width: 30%;">CLASSIFICAÇÃO</th>
            <th colspan="9">ASPECTOS</th>
          </tr>
          <tr>
            <th colspan="2">NÍVEL(IS)</th>
            <th class="check-col">A</th>
            <th class="check-col">B</th>
            <th class="check-col">C</th>
            <th class="check-col">D</th>
            <th class="check-col">E</th>
            <th class="check-col">F</th>
            <th class="check-col">G</th>
            <th class="check-col">H</th>
            <th class="check-col">I</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="2" class="center">EXCELENTE</td>
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr>
            <td colspan="2" class="center">BOM</td>
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr>
            <td colspan="2" class="center">REGULAR</td>
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr>
            <td colspan="2" class="center">INSATISFATÓRIO</td>
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
          </tr>
        </tbody>
      </table>

      <div style="border: 1px solid black; border-top: none; height: 100px; padding: 5px; font-size: 11px;">
        <strong>OBSERVAÇÕES COMPLEMENTARES:</strong>
      </div>

      <div class="double-signature">
        <div class="sig-item">
          <div style="border-top: 1px solid black; width: 100%; margin-bottom: 5px;"></div>
          ASSINATURA DO COMANDANTE
        </div>
        <div class="sig-item">
          <div style="border-top: 1px solid black; width: 100%; margin-bottom: 5px;"></div>
          ASSINATURA DO RESPONSÁVEL
        </div>
      </div>

      <div style="margin-top: 30px; font-size: 8px; color: #555;">
        Corpo de Bombeiros Militar do Pará<br>
        Avenida Júlio César, nº 3000 - Fone: (91) 4006-8354<br>
        Belém-PA
      </div>
    </div>`;
}