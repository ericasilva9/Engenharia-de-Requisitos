/* admin-detalhe.js — Detalhe do sócio: editar dados (RF13), validar documentos e registrar pagamento (RF15) */

iniciarPagina(() => {
  const id = Number(new URLSearchParams(location.search).get("id"));
  let socio = Dados.socio(id);
  if (!socio || socio.tipo !== "socio") { location.href = "socios.html"; return; }

  const NOMES = { atestado: "Atestado médico", vinculo: "Comprovante de vínculo" };

  function preencher() {
    $("#titulo").textContent = socio.nome;
    $("#nome").value = socio.nome;
    $("#cpf").value = socio.cpf;
    $("#celular").value = socio.celular;
    $("#email").value = socio.email;
    $("#nascimento").value = socio.dataNascimento;
    $("#categoria").value = socio.categoria;
  }

  /* ----- Dados pessoais ----- */
  $("#form-dados").addEventListener("submit", e => {
    e.preventDefault();
    limparErros();
    const c = { nome: $("#nome"), cpf: $("#cpf"), cel: $("#celular"), email: $("#email"), nasc: $("#nascimento"), cat: $("#categoria") };
    const outros = Dados.socios().filter(s => s.id !== socio.id);
    let ok = true;
    const erro = (campo, msg) => { setErro(campo, msg); ok = false; };
    if (c.nome.value.trim().split(/\s+/).length < 2) erro(c.nome, "Informe o nome completo.");
    if (!Util.cpfValido(c.cpf.value)) erro(c.cpf, "CPF deve ter 11 dígitos.");
    else if (outros.some(s => s.cpf && Util.digitos(s.cpf) === Util.digitos(c.cpf.value))) erro(c.cpf, "CPF já cadastrado.");
    if (!Util.celularValido(c.cel.value)) erro(c.cel, "Celular inválido.");
    if (!Util.emailValido(c.email.value.trim())) erro(c.email, "E-mail inválido.");
    else if (outros.some(s => s.email.toLowerCase() === c.email.value.trim().toLowerCase())) erro(c.email, "E-mail já cadastrado.");
    if (!c.nasc.value) erro(c.nasc, "Informe a data.");
    if (!ok) return;

    const socios = Dados.socios();
    const i = socios.findIndex(s => s.id === socio.id);
    socios[i] = { ...socios[i], nome: c.nome.value.trim(), cpf: c.cpf.value, celular: c.cel.value, email: c.email.value.trim(),
      dataNascimento: c.nasc.value, categoria: c.cat.value };
    Dados.salvar("socios", socios);
    socio = socios[i];
    Dados.reavaliarInscricoes(socio.id); // a categoria define quais documentos são exigidos
    mostrarToast("Dados salvos.");
    desenhar();
  });

  /* ----- Documentos: aprovar / recusar (RF15) ----- */
  function desenharDocs() {
    const docs = Dados.documentos().filter(d => d.socioId === socio.id);
    $("#lista-docs").innerHTML = docs.length ? docs.map(d => `
      <div class="doc-linha">
        <div class="nome">${icone("documento.png", "")}<div><b>${NOMES[d.tipo]}</b><div class="muted">${esc(d.nomeArquivo)}</div></div></div>
        <div style="display:flex;gap:8px;align-items:center">${Util.badge(d.status)}
          ${d.status === "pendente" ? `<button class="btn sm green" data-doc="${d.id}" data-acao="aprovado">Aprovar</button>
          <button class="btn sm danger" data-doc="${d.id}" data-acao="recusado">Recusar</button>` : ""}</div>
      </div>`).join("") : `<p class="muted">Nenhum documento enviado.</p>`;
  }
  $("#lista-docs").addEventListener("click", e => {
    const b = e.target.closest("[data-doc]");
    if (!b) return;
    const docs = Dados.documentos();
    docs.find(d => d.id === Number(b.dataset.doc)).status = b.dataset.acao;
    Dados.salvar("documentos", docs);
    Dados.reavaliarInscricoes(socio.id);
    mostrarToast(b.dataset.acao === "aprovado" ? "Documento aprovado." : "Documento recusado.");
    desenhar();
  });

  /* ----- Inscrições ----- */
  function desenharInscricoes() {
    const lista = Dados.inscricoes().filter(i => i.socioId === socio.id && i.status !== "cancelada");
    $("#tab-inscricoes").innerHTML = lista.length ? lista.map(i => {
      const info = Dados.turma(i.turmaId);
      return `<tr><td>${info ? esc(info.modalidade.nome) : "—"}</td><td>${info ? esc(info.turma.dias) + " · " + esc(info.turma.horario) : "—"}</td><td>${Util.badge(i.status)}</td></tr>`;
    }).join("") : `<tr><td class="vazio" colspan="3">Sem inscrições.</td></tr>`;
  }

  /* ----- Mensalidades: registrar pagamento (RF15) ----- */
  function desenharMensalidades() {
    const lista = Dados.mensalidades().filter(m => m.socioId === socio.id).sort((a, b) => a.vencimento.localeCompare(b.vencimento));
    $("#tab-mensalidades").innerHTML = lista.length ? lista.map(m => `
      <tr><td>${esc(m.competencia)}</td><td>${Util.moeda(m.valor)}</td><td>${Util.data(m.vencimento)}</td>
      <td>${Util.badge(Dados.statusMensalidade(m))}${m.dataPagamento ? ` <span class="muted">em ${Util.data(m.dataPagamento)}</span>` : ""}</td>
      <td>${m.status !== "pago" ? `<button class="btn sm" data-pagar="${m.id}">Registrar pagamento</button>` : ""}</td></tr>`).join("")
      : `<tr><td class="vazio" colspan="5">Sem mensalidades.</td></tr>`;
  }
  $("#tab-mensalidades").addEventListener("click", e => {
    const b = e.target.closest("[data-pagar]");
    if (!b) return;
    const lista = Dados.mensalidades();
    const m = lista.find(m => m.id === Number(b.dataset.pagar));
    m.status = "pago";
    m.dataPagamento = Util.hoje();
    Dados.salvar("mensalidades", lista);
    mostrarToast("Pagamento registrado.");
    desenhar();
  });

  /* ----- Avaliação física e acessibilidade (RF20) ----- */
  function desenharAvaliacao() {
    const a = Dados.avaliacao(socio.id);
    const sn = v => (v ? "Sim" : "Não");
    const linha = (x, y) => `<div class="linha"><span>${x}</span><b>${y}</b></div>`;
    $("#avaliacao").innerHTML = a
      ? linha("Dificuldade de locomoção ou equilíbrio", sn(a.dificuldade)) + linha("Precisa de apoio ou adaptação", sn(a.apoio)) +
        linha("Nível de natação", NIVEIS[a.nivel]) + linha("Observações", esc(a.obs) || "—") + linha("Preenchida em", Util.data(a.data))
      : `<p class="muted">O sócio ainda não preencheu a avaliação.</p>`;
  }

  function desenhar() { desenharAvaliacao(); desenharDocs(); desenharInscricoes(); desenharMensalidades(); $("#titulo").textContent = socio.nome; }
  preencher();
  desenhar();
}, "admin");
