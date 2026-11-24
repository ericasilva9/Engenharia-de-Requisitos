/* painel.js — Painel do sócio (RF11) */

iniciarPagina(() => {
  const u = Auth.usuario();
  $("#saudacao").textContent = `Olá, ${u.nome.split(" ")[0]}!`;

  const inscricoes = Dados.inscricoes().filter(i => i.socioId === u.id && i.status !== "cancelada");
  const mensalidades = Dados.mensalidades().filter(m => m.socioId === u.id);

  // Cartões de resumo
  $("#st-ativas").textContent = inscricoes.filter(i => i.status === "ativa").length;

  const proxima = mensalidades.filter(m => m.status !== "pago").sort((a, b) => a.vencimento.localeCompare(b.vencimento))[0];
  $("#st-prox").innerHTML = proxima
    ? `<span style="font-size:20px">${Util.data(proxima.vencimento).slice(0, 5)} · ${Util.moeda(proxima.valor)}</span>`
    : `<span style="font-size:20px">Em dia</span>`;
  $("#st-docs").innerHTML = Util.badge(Dados.statusDocs(u.id));

  // Tabela de inscrições
  $("#tab-inscricoes").innerHTML = inscricoes.length ? inscricoes.map(i => {
    const info = Dados.turma(i.turmaId);
    return `<tr>
      <td>${info ? esc(info.modalidade.nome) : "—"}</td>
      <td>${info ? esc(info.turma.dias) + " · " + esc(info.turma.horario) : "—"}</td>
      <td>${Util.moeda(Dados.valorPlano(i.categoria))}</td>
      <td>${Util.badge(i.status)}</td></tr>`;
  }).join("") : `<tr><td class="vazio" colspan="4">Você ainda não tem inscrições. Clique em "+ Nova inscrição".</td></tr>`;

  // Tabela de mensalidades
  $("#tab-mensalidades").innerHTML = mensalidades.length ? mensalidades
    .sort((a, b) => a.vencimento.localeCompare(b.vencimento))
    .map(m => `<tr><td>${esc(m.competencia)}</td><td>${Util.moeda(m.valor)}</td><td>${Util.data(m.vencimento)}</td><td>${Util.badge(Dados.statusMensalidade(m))}</td></tr>`).join("")
    : `<tr><td class="vazio" colspan="4">Nenhuma mensalidade gerada ainda.</td></tr>`;
}, "socio");
