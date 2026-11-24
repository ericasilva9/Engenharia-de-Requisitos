/* modalidades.js — tela "Modalidades e valores" (RF02, RF09 e RF17) */

iniciarPagina(() => {
  const modalidades = Dados.modalidades();

  // Cards das modalidades
  $("#lista-modalidades").innerHTML = modalidades.map(m => `
    <article class="card pad mod-card">
      <div class="ico">${iconeModalidade(m)}</div>
      <h3>${esc(m.nome)}</h3>
      <ul class="turmas">${m.turmas.map(t => `<li>${esc(t.dias)} · ${esc(t.horario)}</li>`).join("")}</ul>
      <p class="muted local">Local: ${esc(m.local)}</p>
      <a class="btn sm block" style="margin-top:14px" href="cadastro.html?modalidade=${m.id}">Inscrever-se</a>
    </article>`).join("");

  // Tabela de valores por categoria, com "saiba mais" (RF17)
  $("#tabela-planos").innerHTML = Dados.planos().map(p => `
    <tr>
      <td><b>${esc(p.nome)}</b>${saibaMais(`<b>${esc(p.nome)}</b><br>${esc(CATEGORIA_INFO[p.categoria] || "")}`)}</td>
      <td>Todas</td>
      <td><b>${Util.moeda(p.valor)}</b></td>
    </tr>`).join("");
});
