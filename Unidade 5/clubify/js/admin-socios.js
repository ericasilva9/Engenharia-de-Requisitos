/* admin-socios.js — Gestão de sócios (RF13): listar, buscar, filtrar, inativar e cadastrar */

iniciarPagina(() => {
  const POR_PAGINA = 5;
  let pagina = 1;

  // Situação resumida das mensalidades de um sócio
  function statusMensal(socioId) {
    const lista = Dados.mensalidades().filter(m => m.socioId === socioId).map(Dados.statusMensalidade);
    if (!lista.length) return "—";
    if (lista.includes("atrasada")) return Util.badge("atrasada");
    if (lista.includes("pendente")) return Util.badge("pendente");
    return Util.badge("pago");
  }

  function filtrar() {
    const busca = $("#busca").value.trim().toLowerCase();
    const cat = $("#f-categoria").value, status = $("#f-status").value;
    return Dados.socios().filter(s => s.tipo === "socio").filter(s => {
      if (busca && !(s.nome.toLowerCase().includes(busca) || (Util.digitos(busca) && Util.digitos(s.cpf).includes(Util.digitos(busca))))) return false;
      if (cat && s.categoria !== cat) return false;
      if (status === "ativo" && s.ativo === false) return false;
      if (status === "inativo" && s.ativo !== false) return false;
      return true;
    });
  }

  function desenhar() {
    const lista = filtrar();
    const totalPaginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
    if (pagina > totalPaginas) pagina = totalPaginas;
    const visiveis = lista.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

    $("#tab-socios").innerHTML = visiveis.length ? visiveis.map(s => {
      const modalidades = Dados.inscricoes().filter(i => i.socioId === s.id && i.status !== "cancelada")
        .map(i => (Dados.modalidade(i.modalidadeId) || {}).nome).filter(Boolean).join(", ") || "—";
      const inativo = s.ativo === false;
      return `<tr>
        <td><b>${esc(s.nome)}</b> ${inativo ? Util.badge("inativo") : ""}</td>
        <td>${esc(s.cpf)}</td>
        <td>${esc(CATEGORIAS[s.categoria])}</td>
        <td>${esc(modalidades)}</td>
        <td>${Util.badge(Dados.statusDocs(s.id))}</td>
        <td>${Util.badge(Dados.avaliacao(s.id) ? "preenchida" : "semavaliacao")}</td>
        <td>${statusMensal(s.id)}</td>
        <td><div class="acoes">
          <a class="icon-btn" title="Visualizar" href="socio-detalhe.html?id=${s.id}">${icone("visualizar.png", "Visualizar")}</a>
          <a class="icon-btn" title="Editar" href="socio-detalhe.html?id=${s.id}">${icone("editar.png", "Editar")}</a>
          ${inativo
            ? `<button class="btn sm sec" data-reativar="${s.id}">Reativar</button>`
            : `<button class="icon-btn" title="Inativar" data-inativar="${s.id}">${icone("proibido.png", "Inativar")}</button>`}
        </div></td></tr>`;
    }).join("") : `<tr><td class="vazio" colspan="8">Nenhum sócio encontrado.</td></tr>`;

    // Paginação
    const ini = lista.length ? (pagina - 1) * POR_PAGINA + 1 : 0;
    $("#pag-info").textContent = `Mostrando ${ini}–${Math.min(pagina * POR_PAGINA, lista.length)} de ${lista.length} sócios`;
    let botoes = `<button data-pag="${pagina - 1}" ${pagina === 1 ? "disabled" : ""}>‹</button>`;
    for (let p = 1; p <= totalPaginas; p++) botoes += `<button data-pag="${p}" class="${p === pagina ? "on" : ""}">${p}</button>`;
    botoes += `<button data-pag="${pagina + 1}" ${pagina === totalPaginas ? "disabled" : ""}>›</button>`;
    $("#pag-botoes").innerHTML = botoes;
  }

  // Eventos de filtro e paginação
  ["busca", "f-categoria", "f-status"].forEach(id => $("#" + id).addEventListener("input", () => { pagina = 1; desenhar(); }));
  $("#pag-botoes").addEventListener("click", e => {
    const b = e.target.closest("button[data-pag]");
    if (b && !b.disabled) { pagina = Number(b.dataset.pag); desenhar(); }
  });

  // Inativar / reativar
  $("#tab-socios").addEventListener("click", e => {
    const ina = e.target.closest("[data-inativar]"), rea = e.target.closest("[data-reativar]");
    const alvo = ina || rea;
    if (!alvo) return;
    const id = Number(alvo.dataset.inativar || alvo.dataset.reativar);
    if (ina && !confirm("Inativar este sócio? Ele não conseguirá mais acessar o sistema.")) return;
    const socios = Dados.socios();
    const s = socios.find(s => s.id === id);
    s.ativo = !!rea;
    Dados.salvar("socios", socios);
    mostrarToast(rea ? "Sócio reativado." : "Sócio inativado.");
    desenhar();
  });

  // Novo sócio (janela)
  $("#btn-novo").addEventListener("click", () => { $("#form-socio").reset(); limparErros(); abrirModal("modal-socio"); });
  $("#form-socio").addEventListener("submit", e => {
    e.preventDefault();
    limparErros();
    const c = { nome: $("#n-nome"), cpf: $("#n-cpf"), cel: $("#n-celular"), email: $("#n-email"), nasc: $("#n-nasc"), cat: $("#n-categoria") };
    const socios = Dados.socios();
    let ok = true;
    const erro = (campo, msg) => { setErro(campo, msg); ok = false; };
    if (c.nome.value.trim().split(/\s+/).length < 2) erro(c.nome, "Informe o nome completo.");
    if (!Util.cpfValido(c.cpf.value)) erro(c.cpf, "CPF deve ter 11 dígitos.");
    else if (socios.some(s => s.cpf && Util.digitos(s.cpf) === Util.digitos(c.cpf.value))) erro(c.cpf, "CPF já cadastrado.");
    if (!Util.celularValido(c.cel.value)) erro(c.cel, "Celular inválido.");
    if (!Util.emailValido(c.email.value.trim())) erro(c.email, "E-mail inválido.");
    else if (socios.some(s => s.email.toLowerCase() === c.email.value.trim().toLowerCase())) erro(c.email, "E-mail já cadastrado.");
    if (!c.nasc.value) erro(c.nasc, "Informe a data.");
    if (!c.cat.value) erro(c.cat, "Selecione a categoria.");
    if (!ok) return;

    const id = DB.proxId(socios);
    socios.push({ id, tipo: "socio", nome: c.nome.value.trim(), email: c.email.value.trim(), cpf: c.cpf.value, celular: c.cel.value,
      dataNascimento: c.nasc.value, categoria: c.cat.value, matricula: String(new Date().getFullYear()) + String(id).padStart(4, "0"),
      ativo: true, dataCadastro: Util.hoje() });
    Dados.salvar("socios", socios);
    fecharModal("modal-socio");
    mostrarToast("Sócio cadastrado.");
    desenhar();
  });

  desenhar();
}, "admin");
