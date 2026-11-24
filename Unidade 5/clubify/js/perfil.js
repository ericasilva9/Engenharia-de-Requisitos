/* perfil.js — Meu perfil: dados (RF12), acessibilidade (RF21) e documentos (RF10) */

iniciarPagina(() => {
  let u = Auth.usuario();

  function preencher() {
    $("#nome").value = u.nome;
    $("#cpf").value = u.cpf;
    $("#email").value = u.email;
    $("#celular").value = u.celular;
    $("#nascimento").value = u.dataNascimento;
    $("#categoria").value = CATEGORIAS[u.categoria];
  }

  // ----- Salvar dados -----
  $("#form-perfil").addEventListener("submit", e => {
    e.preventDefault();
    limparErros();
    const nome = $("#nome"), email = $("#email"), celular = $("#celular"), nasc = $("#nascimento");
    let ok = true;
    if (nome.value.trim().split(/\s+/).length < 2) { setErro(nome, "Informe o nome completo."); ok = false; }
    if (!Util.emailValido(email.value.trim())) { setErro(email, "Informe um e-mail válido."); ok = false; }
    else if (Dados.socios().some(s => s.id !== u.id && s.email.toLowerCase() === email.value.trim().toLowerCase())) { setErro(email, "Esse e-mail já está em uso."); ok = false; }
    if (!Util.celularValido(celular.value)) { setErro(celular, "Informe um celular com DDD."); ok = false; }
    if (!nasc.value) { setErro(nasc, "Informe a data de nascimento."); ok = false; }
    if (!ok) return;

    const socios = Dados.socios();
    const i = socios.findIndex(s => s.id === u.id);
    socios[i] = { ...socios[i], nome: nome.value.trim(), email: email.value.trim(), celular: celular.value, dataNascimento: nasc.value };
    Dados.salvar("socios", socios);
    u = socios[i];
    mostrarToast("Dados salvos com sucesso!");
  });

  // ----- Documentos -----
  const NOMES = { atestado: "Atestado médico", vinculo: "Comprovante de vínculo" };

  function desenharDocs() {
    const tipos = ["atestado", "vinculo"];
    const docs = Dados.documentos().filter(d => d.socioId === u.id);
    $("#lista-docs").innerHTML = tipos.map(tipo => {
      const d = docs.find(d => d.tipo === tipo);
      return `<div class="doc-linha">
        <div class="nome">${icone("documento.png", "")}<div><b>${NOMES[tipo]}</b><div class="muted">${d ? esc(d.nomeArquivo) : "Nenhum arquivo enviado"}</div></div></div>
        <div style="display:flex;gap:8px;align-items:center">${d ? Util.badge(d.status) : Util.badge("naoenviado")}
          <label class="btn sec sm" for="up-${tipo}">${d ? "Enviar novo" : "Enviar"}</label>
          <input type="file" id="up-${tipo}" data-tipo="${tipo}" accept=".pdf,.jpg,.jpeg,.png" hidden></div></div>`;
    }).join("");

    $$('input[type="file"]').forEach(input => input.addEventListener("change", () => {
      const arq = input.files[0];
      if (!arq) return;
      if (!/\.(pdf|jpe?g|png)$/i.test(arq.name)) { mostrarToast("Formato inválido. Envie PDF, JPG ou PNG.", "erro"); return; }
      if (arq.size > 5 * 1024 * 1024) { mostrarToast("O arquivo deve ter no máximo 5 MB.", "erro"); return; }
      const lista = Dados.documentos();
      const i = lista.findIndex(d => d.socioId === u.id && d.tipo === input.dataset.tipo);
      const novo = { id: i >= 0 ? lista[i].id : DB.proxId(lista), socioId: u.id, tipo: input.dataset.tipo, nomeArquivo: arq.name, status: "pendente" };
      if (i >= 0) lista[i] = novo; else lista.push(novo);
      Dados.salvar("documentos", lista);
      Dados.reavaliarInscricoes(u.id);
      mostrarToast("Arquivo enviado. Aguarde a análise da administração.");
      desenharDocs();
    }));
  }

  /* ----- Abas ----- */
  $("#abas").addEventListener("click", e => {
    const b = e.target.closest("[data-aba]");
    if (!b) return;
    $$("#abas button").forEach(x => x.classList.toggle("on", x === b));
    $$(".aba").forEach(x => x.classList.toggle("hidden", x.dataset.painel !== b.dataset.aba));
  });

  /* ----- Acessibilidade (RF21) ----- */
  const sn = v => (v ? "Sim" : "Não");
  function desenharAvaliacao() {
    const a = Dados.avaliacao(u.id);
    $("#status-aval").innerHTML = Util.badge(a ? "preenchida" : "semavaliacao");
    const linha = (x, y) => `<div class="linha"><span>${x}</span><b>${y}</b></div>`;
    $("#resumo-aval").innerHTML = a
      ? linha("Dificuldade de locomoção ou equilíbrio", sn(a.dificuldade)) + linha("Precisa de apoio ou adaptação", sn(a.apoio)) +
        linha("Nível de natação", NIVEIS[a.nivel]) + linha("Observações", esc(a.obs) || "—") + linha("Preenchida em", Util.data(a.data))
      : `<p class="muted">Você ainda não preencheu a avaliação física.</p>`;
    $("#atualizar-aval").textContent = a ? "Atualizar avaliação" : "Preencher avaliação";
  }
  $("#atualizar-aval").addEventListener("click", () => {
    $("#campos-aval").innerHTML = formAvaliacao(Dados.avaliacao(u.id) || {});
    $("#form-aval").classList.remove("hidden");
    $("#resumo-aval").classList.add("hidden"); $("#acoes-aval").classList.add("hidden");
  });
  function fecharForm() {
    $("#form-aval").classList.add("hidden");
    $("#resumo-aval").classList.remove("hidden"); $("#acoes-aval").classList.remove("hidden");
  }
  $("#cancelar-aval").addEventListener("click", fecharForm);
  $("#form-aval").addEventListener("submit", e => {
    e.preventDefault();
    const dados = lerAvaliacao();
    if (!dados) return;
    salvarAvaliacao(u.id, dados);
    mostrarToast("Avaliação atualizada.");
    fecharForm(); desenharAvaliacao();
  });

  preencher();
  desenharAvaliacao();
  desenharDocs();
}, "socio");
