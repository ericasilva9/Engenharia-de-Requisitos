/* admin-modalidades.js — Gestão de modalidades e turmas (RF14, RF22, RF23) */

iniciarPagina(() => {
  let editando = null; // { modalidadeId, turmaId } quando está editando

  // Informações da piscina (RF23)
  $("#info-piscina").innerHTML = `
    <div><span class="muted">Piscina · raias</span><b>${PISCINA.raias}</b></div>
    <div><span class="muted">Alunos por raia</span><b>${PISCINA.alunosPorRaia}</b></div>
    <div><span class="muted">Professor por turma</span><b>${PISCINA.professoresPorTurma}</b></div>
    <div><span class="muted">Máx. de alunos por turma</span><b>${PISCINA.maxPorTurma}</b></div>
    <div><span class="muted">Dimensões e profundidade</span><b class="s">${PISCINA.dimensoes} · ${PISCINA.profundidade}</b></div>`;

  function desenhar() {
    const linhas = [];
    Dados.modalidades().forEach(m => m.turmas.forEach(t => linhas.push({ m, t })));
    $("#tab-turmas").innerHTML = linhas.length ? linhas.map(({ m, t }) => {
      const livres = Dados.vagasLivres(t);
      return `<tr>
        <td><b>${esc(m.nome)}</b></td>
        <td>${esc(t.dias)}${t.horario ? " · " + esc(t.horario) : ""}</td>
        <td>${m.piscina ? icone("piscina.png", "") : ""} ${esc(m.local)}</td>
        <td>${esc(t.professor || "—")}</td>
        <td>${t.vagas - livres} / ${t.vagas}</td>
        <td><div class="acoes">
          <button class="icon-btn" title="Editar" data-editar="${t.id}">${icone("editar.png", "Editar")}</button>
          <button class="icon-btn" title="Excluir turma" data-excluir="${t.id}">${icone("proibido.png", "Excluir")}</button>
        </div></td></tr>`;
    }).join("") : `<tr><td class="vazio" colspan="6">Nenhuma modalidade cadastrada.</td></tr>`;
    $("#lista-nomes").innerHTML = Dados.modalidades().map(m => `<option value="${esc(m.nome)}">`).join("");
  }

  /* ----- Abrir a janela ----- */
  function abrir(info) {
    $("#form-turma").reset();
    limparErros();
    editando = info;
    $("#modal-titulo").textContent = info ? "Editar turma" : "Nova turma";
    $("#t-nome").disabled = !!info;
    if (info) {
      const { modalidade: m, turma: t } = Dados.turma(info.turmaId);
      $("#t-nome").value = m.nome;
      $("#t-dias").value = t.horario ? `${t.dias} · ${t.horario}` : t.dias;
      $("#t-local").value = m.local;
      $("#t-vagas").value = t.vagas;
      $("#t-prof").value = t.professor || "";
    }
    abrirModal("modal-turma");
  }
  $("#btn-nova").addEventListener("click", () => abrir(null));

  $("#tab-turmas").addEventListener("click", e => {
    const ed = e.target.closest("[data-editar]"), ex = e.target.closest("[data-excluir]");
    if (ed) abrir({ turmaId: Number(ed.dataset.editar) });
    if (ex) excluirTurma(Number(ex.dataset.excluir));
  });

  /* ----- Excluir turma ----- */
  function excluirTurma(turmaId) {
    const ocupadas = Dados.inscricoes().filter(i => i.turmaId === turmaId && i.status !== "cancelada").length;
    if (ocupadas) { mostrarToast("Há inscrições nessa turma. Não é possível excluir.", "erro"); return; }
    if (!confirm("Excluir esta turma?")) return;
    const lista = Dados.modalidades();
    lista.forEach(m => (m.turmas = m.turmas.filter(t => t.id !== turmaId)));
    Dados.salvar("modalidades", lista.filter(m => m.turmas.length)); // modalidade sem turmas some da lista
    mostrarToast("Turma excluída.");
    desenhar();
  }

  /* ----- Salvar ----- */
  $("#form-turma").addEventListener("submit", e => {
    e.preventDefault();
    limparErros();
    const nome = $("#t-nome"), dias = $("#t-dias"), local = $("#t-local"), vagas = $("#t-vagas"), prof = $("#t-prof");
    let ok = true;
    const erro = (campo, msg) => { setErro(campo, msg); ok = false; };
    if (nome.value.trim().length < 3) erro(nome, "Informe o nome da modalidade.");
    if (!dias.value.trim()) erro(dias, "Informe dias e horários.");
    if (!local.value.trim()) erro(local, "Informe o local.");
    if (!prof.value.trim()) erro(prof, "Informe o professor responsável.");
    if (!(Number(vagas.value) >= 1)) erro(vagas, "Informe o número de vagas.");
    else if (Number(vagas.value) > PISCINA.maxPorTurma) erro(vagas, `Máximo de ${PISCINA.maxPorTurma} vagas por turma (1 professor).`);
    if (editando) {
      const ocupadas = Dados.inscricoes().filter(i => i.turmaId === editando.turmaId && i.status !== "cancelada").length;
      if (Number(vagas.value) < ocupadas) erro(vagas, `Já existem ${ocupadas} inscrições nessa turma.`);
    }
    if (!ok) return;

    // "Seg e qua · 11h–12h" → dias + horário
    const [parteDias, ...resto] = dias.value.split("·");
    const turmaDados = { dias: parteDias.trim(), horario: resto.join("·").trim(), vagas: Number(vagas.value), professor: prof.value.trim() };
    const ehPiscina = /piscina/i.test(local.value);

    const lista = Dados.modalidades();
    if (editando) {
      const m = lista.find(m => m.turmas.some(t => t.id === editando.turmaId));
      Object.assign(m.turmas.find(t => t.id === editando.turmaId), turmaDados);
      Object.assign(m, { local: local.value.trim(), piscina: ehPiscina });
    } else {
      const todasTurmas = lista.flatMap(m => m.turmas);
      const novaTurma = { id: DB.proxId(todasTurmas), ...turmaDados };
      let m = lista.find(m => m.nome.toLowerCase() === nome.value.trim().toLowerCase());
      if (m) {
        m.turmas.push(novaTurma);
        Object.assign(m, { local: local.value.trim(), piscina: ehPiscina });
      } else {
        lista.push({ id: DB.proxId(lista), nome: nome.value.trim(), icone: ehPiscina ? "natacao.png" : null, piscina: ehPiscina,
          local: local.value.trim(), turmas: [novaTurma] });
      }
    }
    Dados.salvar("modalidades", lista);
    fecharModal("modal-turma");
    mostrarToast("Turma salva.");
    desenhar();
  });

  desenhar();
}, "admin");
