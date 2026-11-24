/* =========================================================
   cadastro.js — cadastro e inscrição em 5 etapas (RF04, RF07 a RF10, RF18 a RF20)
   Etapas: 1 Dados pessoais · 2 Modalidade · 3 Avaliação física · 4 Documentos · 5 Confirmação
   Sócio já logado (nova inscrição) começa na etapa 2.
   ========================================================= */

iniciarPagina(() => {
  const params = new URLSearchParams(location.search);
  const usuario = Auth.usuario();
  if (usuario && usuario.tipo === "admin") { location.href = raiz() + "pages/admin/socios.html"; return; }

  const TITULOS = ["Dados pessoais", "Escolha da modalidade", "Avaliação física e acessibilidade", "Envio de documentos", "Quase lá! Confira sua inscrição"];
  const NOMES_ETAPAS = ["Dados pessoais", "Modalidade", "Avaliação física", "Documentos", "Confirmação"];
  const TOTAL = TITULOS.length;
  $("#saiba-cat").innerHTML = saibaMais(saibaCategorias());
  const primeiraEtapa = usuario ? 2 : 1;

  const estado = {
    etapa: primeiraEtapa,
    categoria: usuario ? usuario.categoria : "",
    dados: {},
    turmaId: null,
    modalidadeId: null,
    avaliacao: null,
    arquivos: { atestado: null, vinculo: null }
  };

  /* ---------- Controle das etapas ---------- */
  function desenharStepper() {
    $("#stepper").innerHTML = TITULOS.map((_, i) => {
      const n = i + 1;
      const classe = n < estado.etapa ? "done" : n === estado.etapa ? "on" : "";
      return `<div class="step ${classe}"><b>${n < estado.etapa ? "✓" : n}</b>${NOMES_ETAPAS[i]}</div>`;
    }).join("");
  }

  function mostrarEtapa(n) {
    estado.etapa = n;
    $$(".etapa").forEach(s => s.classList.toggle("hidden", Number(s.dataset.etapa) !== n));
    $("#titulo-etapa").textContent = TITULOS[n - 1];
    $("#btn-voltar").classList.toggle("hidden", n === primeiraEtapa);
    $("#btn-avancar").textContent = n === TOTAL ? "Confirmar inscrição" : "Avançar";
    if (n === 2) desenharOpcoes();
    if (n === 3) $("#form-avaliacao").innerHTML = formAvaliacao(estado.avaliacao || (usuario && Dados.avaliacao(usuario.id)) || {});
    if (n === 4) desenharDocumentos();
    if (n === 5) desenharResumoFinal();
    desenharStepper();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  $("#btn-voltar").addEventListener("click", () => { if (estado.etapa > primeiraEtapa) mostrarEtapa(estado.etapa - 1); });
  $("#btn-avancar").addEventListener("click", () => {
    if (!validarEtapa(estado.etapa)) return;
    if (estado.etapa === TOTAL) confirmarInscricao();
    else mostrarEtapa(estado.etapa + 1);
  });

  function validarEtapa(n) {
    if (n === 1) return validarDados();
    if (n === 2) return validarModalidade();
    if (n === 3) { const a = lerAvaliacao(); if (!a) return false; estado.avaliacao = a; return true; }
    if (n === 4) return validarDocumentos();
    return true;
  }

  /* ---------- Etapa 1: dados pessoais ---------- */
  function validarDados() {
    const campos = {
      nome: $("#nome"), cpf: $("#cpf"), email: $("#email"), celular: $("#celular"),
      nascimento: $("#nascimento"), categoria: $("#categoria"), aceite: $("#aceite")
    };
    limparErros($('[data-etapa="1"]'));
    let ok = true;
    const erro = (campo, msg) => { setErro(campo, msg); ok = false; };
    const socios = Dados.socios();

    if (campos.nome.value.trim().split(/\s+/).length < 2) erro(campos.nome, "Informe o nome completo.");
    if (!Util.cpfValido(campos.cpf.value)) erro(campos.cpf, "CPF deve ter 11 dígitos.");
    else if (socios.some(s => s.cpf && Util.digitos(s.cpf) === Util.digitos(campos.cpf.value))) erro(campos.cpf, "Já existe um cadastro com esse CPF.");
    if (!Util.emailValido(campos.email.value.trim())) erro(campos.email, "Informe um e-mail válido.");
    else if (socios.some(s => s.email.toLowerCase() === campos.email.value.trim().toLowerCase())) erro(campos.email, "Esse e-mail já está cadastrado.");
    if (!Util.celularValido(campos.celular.value)) erro(campos.celular, "Informe um celular com DDD.");
    if (!campos.nascimento.value) erro(campos.nascimento, "Informe a data de nascimento.");
    else if (campos.nascimento.value > Util.hoje()) erro(campos.nascimento, "A data não pode estar no futuro.");
    if (!campos.categoria.value) erro(campos.categoria, "Selecione a categoria.");
    if (!campos.aceite.checked) erro(campos.aceite, "É necessário aceitar a política de privacidade.");
    if (!ok) return false;

    estado.dados = {
      nome: campos.nome.value.trim(), cpf: campos.cpf.value, email: campos.email.value.trim(),
      celular: campos.celular.value, dataNascimento: campos.nascimento.value,
      categoria: campos.categoria.value, novidades: $("#novidades").checked
    };
    // Se a categoria mudou, a escolha anterior pode deixar de valer
    if (estado.categoria !== campos.categoria.value) { estado.turmaId = null; estado.modalidadeId = null; }
    estado.categoria = campos.categoria.value;
    return true;
  }

  /* ---------- Etapa 2: modalidade e turma (RF07, RF08, RF09) ---------- */
  function minhasModalidades() {
    if (!usuario) return [];
    return Dados.inscricoes().filter(i => i.socioId === usuario.id && i.status !== "cancelada").map(i => i.modalidadeId);
  }

  function desenharOpcoes() {
    const jaInscrito = minhasModalidades();
    const preSelecionada = Number(params.get("modalidade")) || null;

    // Se veio da tela de modalidades, já marca a primeira turma com vaga
    if (preSelecionada && !estado.turmaId) {
      const m = Dados.modalidade(preSelecionada);
      if (m && !jaInscrito.includes(m.id)) {
        const t = m.turmas.find(t => Dados.vagasLivres(t) > 0);
        if (t) { estado.turmaId = t.id; estado.modalidadeId = m.id; }
      }
    }

    $("#lista-opcoes").innerHTML = Dados.modalidades().map(m => {
      const repetida = jaInscrito.includes(m.id);
      const bloqueada = repetida;
      const aviso = repetida ? "Você já possui inscrição nesta modalidade" : "";
      return `
        <div class="opcao ${estado.modalidadeId === m.id ? "sel" : ""} ${bloqueada ? "bloq" : ""}">
          <div class="topo">
            <div class="ico">${iconeModalidade(m)}</div>
            <div><b>${esc(m.nome)}</b>
              <div class="muted local">${m.piscina ? icone("piscina.png", "") : ""} ${esc(m.local)}</div></div>
          </div>
          ${aviso ? `<div class="err-msg" style="display:flex;gap:6px;align-items:center;margin:0 0 6px">${icone("proibido.png", "")} ${aviso}</div>` : ""}
          ${m.turmas.map(t => {
            const livres = Dados.vagasLivres(t);
            const off = bloqueada || livres <= 0;
            return `<label class="turma-op ${off ? "off" : ""}">
              <input type="radio" name="turma" value="${t.id}" data-mod="${m.id}" ${off ? "disabled" : ""} ${estado.turmaId === t.id ? "checked" : ""}>
              ${esc(t.dias)} · ${esc(t.horario)} · ${esc(t.professor || "")} <small>${livres > 0 ? livres + " de " + t.vagas + " vagas livres" : "Turma lotada (0 de " + t.vagas + ")"}</small></label>`;
          }).join("")}
        </div>`;
    }).join("");

    $$('input[name="turma"]').forEach(r => r.addEventListener("change", () => {
      estado.turmaId = Number(r.value);
      estado.modalidadeId = Number(r.dataset.mod);
      $("#erro-etapa2").textContent = "";
      desenharOpcoes();
    }));
    desenharResumo();
  }

  function desenharResumo() {
    const sel = estado.turmaId ? Dados.turma(estado.turmaId) : null;
    $("#resumo").innerHTML = `
      <h3>Resumo</h3><span class="ul"></span>
      <p class="muted">Categoria ${saibaMais(saibaCategorias())}</p><p style="margin-bottom:10px"><b>${esc(CATEGORIAS[estado.categoria] || "—")}</b></p>
      <p class="muted">Modalidade</p><p style="margin-bottom:10px"><b>${sel ? esc(sel.modalidade.nome) + "<br><span class='muted'>" + esc(sel.turma.dias) + " · " + esc(sel.turma.horario) + "</span>" : "Selecione uma turma"}</b></p>
      <p class="muted">Mensalidade</p><p class="v">${Util.moeda(Dados.valorPlano(estado.categoria))}</p>`;
  }

  function validarModalidade() {
    if (!estado.turmaId) { $("#erro-etapa2").textContent = "Selecione uma modalidade e uma turma para continuar."; return false; }
    return true;
  }

  /* ---------- Etapa 3: documentos (RF10) ---------- */
  const DOCS = [
    { tipo: "atestado", titulo: "Atestado médico *", desc: "PDF, JPG ou PNG · até 5 MB" },
    { tipo: "vinculo", titulo: "Comprovante de vínculo *", desc: "Colaborador ou docente da instituição" }
  ];

  function docExistente(tipo) {
    if (!usuario) return null;
    const d = Dados.documentos().find(d => d.socioId === usuario.id && d.tipo === tipo);
    return d && d.status !== "recusado" ? d : null; // documento recusado precisa ser reenviado
  }
  function docObrigatorio() { return true; }

  function desenharDocumentos() {
    $("#lista-docs").innerHTML = DOCS.filter(d => docObrigatorio(d.tipo)).map(d => {
      const existente = docExistente(d.tipo), novo = estado.arquivos[d.tipo];
      const situacao = novo
        ? `${esc(novo)} ${Util.badge("pendente")}`
        : existente ? `Já enviado: ${esc(existente.nomeArquivo)} ${Util.badge(existente.status)}` : "Nenhum arquivo selecionado";
      return `
        <div class="upload">
          ${icone("documento.png", "", "icon lg")}
          <div class="corpo"><b>${d.titulo}</b><div class="muted">${d.desc}</div><div class="muted" style="margin-top:4px">${situacao}</div></div>
          <input type="file" id="file-${d.tipo}" accept=".pdf,.jpg,.jpeg,.png" hidden>
          <label class="btn sec sm" for="file-${d.tipo}">${existente || novo ? "Trocar arquivo" : "Selecionar arquivo"}</label>
        </div>`;
    }).join("");

    DOCS.forEach(d => {
      const input = $("#file-" + d.tipo);
      if (!input) return;
      input.addEventListener("change", () => {
        const arq = input.files[0];
        if (!arq) return;
        if (!/\.(pdf|jpe?g|png)$/i.test(arq.name)) { $("#erro-etapa4doc").textContent = "Formato inválido. Envie PDF, JPG ou PNG."; return; }
        if (arq.size > 5 * 1024 * 1024) { $("#erro-etapa4doc").textContent = "O arquivo deve ter no máximo 5 MB."; return; }
        $("#erro-etapa4doc").textContent = "";
        estado.arquivos[d.tipo] = arq.name; // protótipo: guarda só o nome do arquivo
        desenharDocumentos();
      });
    });
  }

  function validarDocumentos() {
    const faltando = DOCS.filter(d => docObrigatorio(d.tipo) && !estado.arquivos[d.tipo] && !docExistente(d.tipo));
    if (faltando.length) {
      $("#erro-etapa4doc").textContent = "Envie: " + faltando.map(d => d.titulo.replace(" *", "")).join(" e ") + ".";
      return false;
    }
    $("#erro-etapa4doc").textContent = "";
    return true;
  }

  /* ---------- Etapa 4: confirmação ---------- */
  function desenharResumoFinal() {
    const d = usuario || estado.dados;
    const sel = Dados.turma(estado.turmaId);
    const linha = (a, b) => `<div class="linha"><span>${a}</span><b>${b}</b></div>`;
    const docs = DOCS.filter(x => docObrigatorio(x.tipo)).map(x =>
      estado.arquivos[x.tipo] ? esc(estado.arquivos[x.tipo]) : docExistente(x.tipo) ? esc(docExistente(x.tipo).nomeArquivo) + " (já enviado)" : "—").join("<br>");
    $("#resumo-final").innerHTML =
      linha("Nome", esc(d.nome)) + linha("CPF", esc(d.cpf)) + linha("E-mail", esc(d.email)) +
      linha("Categoria", esc(CATEGORIAS[estado.categoria])) +
      linha("Modalidade", `${esc(sel.modalidade.nome)}<br><span class="muted">${esc(sel.turma.dias)} · ${esc(sel.turma.horario)}</span>`) +
      linha("Mensalidade", Util.moeda(Dados.valorPlano(estado.categoria))) +
      linha("Avaliação física", Util.badge("preenchida")) +
      linha("Documentos", docs + `<br>${Util.badge("pendente")}`);
  }

  function confirmarInscricao() {
    const erro = $("#erro-etapa5");
    erro.textContent = "";
    if (!$("#ciente-piscina").checked) { erro.textContent = "Marque que leu os avisos da piscina para confirmar."; return; }
    const sel = Dados.turma(estado.turmaId);
    if (!sel || Dados.vagasLivres(sel.turma) <= 0) { erro.textContent = "Essa turma não tem mais vagas. Volte e escolha outra."; return; }

    // 1) Sócio (somente no cadastro novo)
    let socio = usuario;
    if (!socio) {
      const socios = Dados.socios();
      const d = estado.dados;
      if (socios.some(s => s.email.toLowerCase() === d.email.toLowerCase() || (s.cpf && Util.digitos(s.cpf) === Util.digitos(d.cpf)))) {
        erro.textContent = "E-mail ou CPF já cadastrado."; return;
      }
      const id = DB.proxId(socios);
      socio = { id, tipo: "socio", nome: d.nome, email: d.email, cpf: d.cpf, celular: d.celular, dataNascimento: d.dataNascimento,
        categoria: d.categoria, matricula: String(new Date().getFullYear()) + String(id).padStart(4, "0"),
        ativo: true, dataCadastro: Util.hoje(), aceiteNovidades: d.novidades };
      socios.push(socio);
      Dados.salvar("socios", socios);
      Auth.entrar(socio);
    }

    // 2) Avaliação física e acessibilidade
    salvarAvaliacao(socio.id, estado.avaliacao);

    // 3) Documentos (guarda só nome do arquivo e status "pendente")
    const docs = Dados.documentos();
    DOCS.forEach(x => {
      const nome = estado.arquivos[x.tipo];
      if (!nome) return;
      const antigo = docs.findIndex(d => d.socioId === socio.id && d.tipo === x.tipo);
      const novo = { id: DB.proxId(docs), socioId: socio.id, tipo: x.tipo, nomeArquivo: nome, status: "pendente" };
      if (antigo >= 0) docs[antigo] = { ...novo, id: docs[antigo].id }; else docs.push(novo);
    });
    Dados.salvar("documentos", docs);

    // 4) Inscrição
    const inscricoes = Dados.inscricoes();
    const inscricao = { id: DB.proxId(inscricoes), socioId: socio.id, modalidadeId: estado.modalidadeId, turmaId: estado.turmaId,
      categoria: estado.categoria, data: Util.hoje(), status: "pendente", periodo: PERIODO };
    inscricoes.push(inscricao);
    Dados.salvar("inscricoes", inscricoes);

    // 5) Primeira mensalidade: mês atual, vencimento dia 10 do mês seguinte
    const hoje = new Date();
    const venc = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 10);
    const mensalidades = Dados.mensalidades();
    mensalidades.push({ id: DB.proxId(mensalidades), inscricaoId: inscricao.id, socioId: socio.id,
      competencia: `${MESES[hoje.getMonth()]}/${hoje.getFullYear()}`, valor: Dados.valorPlano(estado.categoria),
      vencimento: `${venc.getFullYear()}-${String(venc.getMonth() + 1).padStart(2, "0")}-10`, status: "pendente", dataPagamento: null });
    Dados.salvar("mensalidades", mensalidades);

    // Se os documentos já estavam aprovados, a inscrição já nasce ativa
    Dados.reavaliarInscricoes(socio.id);

    $("#cartao").classList.add("hidden");
    $("#stepper").classList.add("hidden");
    $("#sucesso").classList.remove("hidden");
    montarTopo(); // atualiza o menu (agora logado)
    window.scrollTo({ top: 0 });
  }

  /* ---------- Início ---------- */
  mostrarEtapa(primeiraEtapa);
});
