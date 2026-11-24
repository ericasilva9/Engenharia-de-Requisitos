/* =========================================================
   main.js — navegação e funções comuns a todas as páginas
   ========================================================= */

const $ = (seletor, base = document) => base.querySelector(seletor);
const $$ = (seletor, base = document) => [...base.querySelectorAll(seletor)];
const esc = Util.esc;

// Caminho até a raiz do site (definido em <body data-root="...">)
const raiz = () => document.body.dataset.root || "";
const img = nome => `${raiz()}assets/img/${nome}`;
const icone = (nome, alt = "", classe = "icon") => `<img class="${classe}" src="${img(nome)}" alt="${alt}">`;

// Ícone da modalidade (ou a inicial do nome, se não houver imagem)
function iconeModalidade(m) {
  return m.icone ? icone(m.icone, m.nome, "") : esc(m.nome.charAt(0));
}

/* ---------- Início de cada página ---------- */
// perfil: "socio" ou "admin" (opcional) bloqueia o acesso de quem não tem permissão
async function iniciarPagina(callback, perfil = null) {
  window.__paginaIniciada = true;
  await DB.init(raiz());
  if (perfil && !Auth.exigir(perfil)) return;
  montarTopo();
  montarRodape();
  montarSidebar();
  $$(".js-periodo").forEach(el => (el.textContent = PERIODO));
  $$(".js-avisos-piscina").forEach(el => (el.innerHTML = avisosPiscina()));
  if (callback) callback();
}

/* Avisos da piscina (RF24): usados no edital e no cadastro */
function avisosPiscina() {
  const itens = [
    `Profundidade da piscina: ${PISCINA.profundidade}`,
    "Roupa de banho adequada é obrigatória",
    "Siga sempre a orientação do professor responsável",
    "Use somente o horário da sua turma"
  ];
  return `<div class="aviso info aviso-lista"><div><b>Avisos da piscina</b>${itens.map(t => `<div class="item">${icone("piscina.png", "")} ${t}</div>`).join("")}</div></div>`;
}

/* Formulário de avaliação física e acessibilidade (RF19, RF20, RF21) — usado no cadastro e no perfil */
function formAvaliacao(a = {}) {
  const sn = (nome, valor) => `<div class="radios">
    <label><input type="radio" name="${nome}" value="nao" ${valor === false ? "checked" : ""}> Não</label>
    <label><input type="radio" name="${nome}" value="sim" ${valor === true ? "checked" : ""}> Sim</label></div>`;
  return `
    <div class="pergunta field" data-q="dificuldade"><b>1. Você tem alguma dificuldade de locomoção, equilíbrio ou outra que afete a prática? *</b>${sn("av-dificuldade", a.dificuldade)}</div>
    <div class="pergunta field" data-q="apoio"><b>2. Precisa de apoio ou adaptação para praticar a modalidade? *</b>${sn("av-apoio", a.apoio)}</div>
    <div class="pergunta field" data-q="nivel"><b>3. Para natação: qual é o seu nível? *</b><div class="radios">
      ${Object.entries(NIVEIS).map(([k, v]) => `<label><input type="radio" name="av-nivel" value="${k}" ${a.nivel === k ? "checked" : ""}> ${v}</label>`).join("")}</div></div>
    <div class="pergunta"><label for="av-obs" style="font-size:14px;font-weight:500">Descreva o que precisaríamos saber (opcional)</label>
      <textarea id="av-obs" placeholder="Ex.: uso de cadeira de rodas, necessidade de acompanhante…">${esc(a.obs || "")}</textarea></div>
    <label class="chk"><input type="checkbox" id="av-decl" ${a.data ? "checked" : ""}><span>Declaro que as informações acima são verdadeiras *</span></label>
    <div class="err-msg" id="av-erro"></div>`;
}
// Lê e valida o formulário acima. Retorna o objeto da avaliação ou null (mostrando o erro).
function lerAvaliacao() {
  const v = nome => { const r = document.querySelector(`input[name="${nome}"]:checked`); return r ? r.value : null; };
  const dif = v("av-dificuldade"), apoio = v("av-apoio"), nivel = v("av-nivel");
  const erro = $("#av-erro");
  if (!dif || !apoio || !nivel) { erro.textContent = "Responda as 3 perguntas obrigatórias."; return null; }
  if (!$("#av-decl").checked) { erro.textContent = "Marque a declaração para continuar."; return null; }
  erro.textContent = "";
  return { dificuldade: dif === "sim", apoio: apoio === "sim", nivel, obs: $("#av-obs").value.trim(), data: Util.hoje() };
}
function salvarAvaliacao(socioId, dados) {
  const lista = Dados.avaliacoes().filter(a => a.socioId !== socioId);
  lista.push({ socioId, ...dados });
  Dados.salvar("avaliacoes", lista);
}

/* "Saiba mais" (RF17): ícone "i" com caixa de explicação da categoria */
function saibaMais(texto) {
  return `<span class="saiba" tabindex="0" role="button" aria-label="Saiba mais">i<span class="pop">${texto}</span></span>`;
}
const saibaCategorias = () => Object.keys(CATEGORIAS).map(c => `<b>${CATEGORIAS[c]}</b><br>${CATEGORIA_INFO[c]}`).join("<br><br>");

/* ---------- Cabeçalho, rodapé e menu lateral ---------- */
function montarTopo() {
  const topo = $("#topo");
  if (!topo) return;
  const r = raiz(), pagina = document.body.dataset.page, u = Auth.usuario();
  const links = [["Início", "index.html", "home"], ["Modalidades", "pages/modalidades.html", "modalidades"], ["Edital", "pages/edital.html", "edital"]];
  if (!u) links.push(["Inscrição", "pages/cadastro.html", "cadastro"]);
  if (u && u.tipo === "socio") links.push(["Nova inscrição", "pages/cadastro.html", "cadastro"], ["Meu painel", "pages/painel-socio.html", "painel"], ["Meu perfil", "pages/perfil.html", "perfil"]);
  if (u && u.tipo === "admin") links.push(["Administração", "pages/admin/socios.html", "admin"]);
  const menu = links.map(([t, href, id]) => `<a class="link ${pagina === id ? "on" : ""}" href="${r}${href}">${t}</a>`).join("");
  const direita = u
    ? `<button class="btn sec onnavy sm" id="btn-sair">Sair</button>`
    : `<a class="btn amber sm" href="${r}pages/login.html">Área do Sócio</a>`;
  topo.innerHTML = `<a class="logo" href="${r}index.html"><img src="${img("logo.png")}" alt="Clubify"></a><nav>${menu}${direita}</nav>`;
  const sair = $("#btn-sair");
  if (sair) sair.addEventListener("click", () => { Auth.sair(); location.href = r + "index.html"; });
}

function montarRodape() {
  const rodape = $("#rodape");
  if (!rodape) return;
  rodape.innerHTML = `
    <div><b>Clubify</b><small></small><small>Rua tan tan tan, 100 - Brasília, DF</small></div>
    <div><small>(61) 99999-9999 · contato: clubify@gmail.com</small>
    <small>© 2026 Clubify. Todos os direitos reservados.</small></div>`;
}

function montarSidebar() {
  const lateral = $("#sidebar");
  if (!lateral) return;
  const r = raiz(), pagina = document.body.dataset.page;
  lateral.innerHTML = `
    <a class="logo" href="${r}index.html"><img src="${img("logo.png")}" alt="Clubify"></a>
    <nav>
      <a class="${pagina === "admin-socios" ? "on" : ""}" href="${r}pages/admin/socios.html">Sócios</a>
      <a class="${pagina === "admin-modalidades" ? "on" : ""}" href="${r}pages/admin/modalidades.html">Modalidades e turmas</a>
      <a class="${pagina === "admin-valores" ? "on" : ""}" href="${r}pages/admin/valores.html">Valores e mensalidades</a>
    </nav>
    <div class="base">
      <a href="${r}index.html">Ver o site</a>
      <a href="#" id="btn-restaurar">Restaurar dados de exemplo</a>
      <a href="#" id="btn-sair">Sair</a>
    </div>`;
  $("#btn-sair").addEventListener("click", e => { e.preventDefault(); Auth.sair(); location.href = r + "index.html"; });
  $("#btn-restaurar").addEventListener("click", e => {
    e.preventDefault();
    if (confirm("Apagar tudo o que foi cadastrado e voltar aos dados de exemplo?")) {
      DB.resetar();
      location.href = r + "pages/login.html";
    }
  });
}

/* ---------- Aviso rápido (toast) ---------- */
function mostrarToast(mensagem, tipo = "") {
  let t = $("#toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
  t.textContent = mensagem;
  t.className = "show " + tipo;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => (t.className = ""), 3200);
}

/* ---------- Janelas (modal) ---------- */
function abrirModal(id) { $("#" + id).classList.add("aberto"); }
function fecharModal(id) { $("#" + id).classList.remove("aberto"); }
document.addEventListener("click", e => {
  if (e.target.matches("[data-fechar]") || e.target.classList.contains("modal-bg")) {
    const modal = e.target.closest(".modal-bg");
    if (modal) modal.classList.remove("aberto");
  }
});

/* ---------- Mensagens de erro em formulários ---------- */
function setErro(campo, mensagem) {
  const bloco = campo.closest(".field");
  if (!bloco) return;
  bloco.classList.toggle("erro", !!mensagem);
  let msg = $(".err-msg", bloco);
  if (!msg) { msg = document.createElement("div"); msg.className = "err-msg"; bloco.appendChild(msg); }
  msg.textContent = mensagem || "";
}
function limparErros(base = document) {
  $$(".field.erro", base).forEach(b => b.classList.remove("erro"));
  $$(".err-msg", base).forEach(m => (m.textContent = ""));
}

// Aplica máscara de CPF/celular nos campos marcados com data-mascara
document.addEventListener("input", e => {
  const tipo = e.target.dataset && e.target.dataset.mascara;
  if (tipo === "cpf") e.target.value = Util.mascaraCPF(e.target.value);
  if (tipo === "celular") e.target.value = Util.mascaraCelular(e.target.value);
});

// Páginas sem script próprio (Início e Edital) também precisam montar cabeçalho e rodapé
document.addEventListener("DOMContentLoaded", () => {
  if (!window.__paginaIniciada) iniciarPagina();
});
