/* login.js — tela de login (RF06) */

iniciarPagina(() => {
  // Se já estiver logado, vai direto para a área correta
  const logado = Auth.usuario();
  if (logado) { irParaArea(logado); return; }

  const aviso = new URLSearchParams(location.search).get("aviso");
  const caixa = $("#msg-aviso");
  if (aviso === "login") { caixa.textContent = "Faça login para acessar essa página."; caixa.classList.remove("hidden"); }
  if (aviso === "permissao") { caixa.textContent = "Seu usuário não tem permissão para acessar essa página."; caixa.classList.remove("hidden"); }

  $("#form-login").addEventListener("submit", e => {
    e.preventDefault();
    const email = $("#email"), senha = $("#senha"), erro = $("#msg-erro");
    limparErros();
    erro.classList.add("hidden");
    let ok = true;
    if (!Util.emailValido(email.value.trim())) { setErro(email, "Informe um e-mail válido."); ok = false; }
    if (!senha.value.trim()) { setErro(senha, "Informe a senha ou o CPF."); ok = false; }
    if (!ok) return;

    const resultado = Auth.login(email.value, senha.value);
    if (resultado.erro) { erro.textContent = resultado.erro; erro.classList.remove("hidden"); return; }
    irParaArea(resultado.usuario);
  });
});

function irParaArea(usuario) {
  location.href = raiz() + (usuario.tipo === "admin" ? "pages/admin/socios.html" : "pages/painel-socio.html");
}
