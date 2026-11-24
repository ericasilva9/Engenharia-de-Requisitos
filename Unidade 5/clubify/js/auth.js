/* =========================================================
   auth.js — login SIMULADO (apenas para demonstração)
   Não há segurança real: tudo roda no navegador.
   ========================================================= */

const Auth = {
  // RF06: acesso com e-mail e (senha OU CPF)
  login(email, senhaOuCpf) {
    const mail = String(email).trim().toLowerCase();
    const cred = String(senhaOuCpf).trim();
    const usuario = Dados.socios().find(s => {
      if (s.email.toLowerCase() !== mail) return false;
      const senhaOk = s.senha && s.senha === cred;
      const cpfOk = s.cpf && Util.digitos(cred).length === 11 && Util.digitos(s.cpf) === Util.digitos(cred);
      return senhaOk || cpfOk;
    });
    if (!usuario) return { erro: "E-mail ou senha/CPF incorretos." };
    if (usuario.ativo === false) return { erro: "Cadastro inativo. Procure a administração do clube." };
    DB.gravar("sessao", { id: usuario.id });
    return { usuario };
  },

  usuario() {
    const sessao = DB.ler("sessao");
    return sessao ? Dados.socio(sessao.id) || null : null;
  },

  entrar(usuario) { DB.gravar("sessao", { id: usuario.id }); },
  sair() { DB.gravar("sessao", null); },

  // Bloqueia páginas restritas: tipo = "socio" ou "admin"
  exigir(tipo) {
    const u = Auth.usuario();
    if (!u || u.tipo !== tipo) {
      location.href = raiz() + "pages/login.html?aviso=" + (u ? "permissao" : "login");
      return false;
    }
    return true;
  }
};
