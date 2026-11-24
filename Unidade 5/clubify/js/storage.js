
/* Dados embutidos para uso local (file://), sem dependência de fetch. */
const CLUBIFY_SEED = {"modalidades":[{"id":1,"nome":"Natação","icone":"natacao.png","piscina":true,"local":"Bloco 10","turmas":[{"id":1,"dias":"Segunda e quarta","horario":"6h30–7h30","vagas":10,"professor":"Prof. Rafael"}]},{"id":2,"nome":"Nado Livre","icone":"piscina.png","piscina":true,"local":"Piscina","turmas":[{"id":2,"dias":"Segunda e quarta","horario":"13h–19h","vagas":10,"professor":"Prof. Rafael"}]}],"planos":[{"id":1,"categoria":"colaborador","nome":"Colaborador","valor":150},{"id":2,"categoria":"docente","nome":"Docente","valor":120}],"socios":[{"id":1,"tipo":"admin","nome":"Administrador do Clube","email":"admin@clubify.com","senha":"admin123","cpf":"","ativo":true},{"id":2,"tipo":"socio","nome":"Maria Souza Lima","email":"maria@exemplo.com","cpf":"000.000.000-00","celular":"(61) 90000-0000","dataNascimento":"1988-03-12","categoria":"docente","matricula":"20260002","ativo":true,"dataCadastro":"2026-08-10"},{"id":3,"tipo":"socio","nome":"João Pereira","email":"joao@exemplo.com","cpf":"111.111.111-11","celular":"(61) 91111-1111","dataNascimento":"1992-07-25","categoria":"colaborador","matricula":"20260003","ativo":true,"dataCadastro":"2026-08-10"},{"id":4,"tipo":"socio","nome":"Ana Carvalho","email":"ana@exemplo.com","cpf":"222.222.222-22","celular":"(61) 92222-2222","dataNascimento":"1985-11-02","categoria":"docente","matricula":"20260004","ativo":true,"dataCadastro":"2026-08-10"},{"id":5,"tipo":"socio","nome":"Carlos Mendes","email":"carlos@exemplo.com","cpf":"333.333.333-33","celular":"(61) 93333-3333","dataNascimento":"1991-01-30","categoria":"colaborador","matricula":"20260005","ativo":true,"dataCadastro":"2026-08-10"},{"id":6,"tipo":"socio","nome":"Beatriz Lopes","email":"beatriz@exemplo.com","cpf":"444.444.444-44","celular":"(61) 94444-4444","dataNascimento":"1990-05-18","categoria":"colaborador","matricula":"20260006","ativo":true,"dataCadastro":"2026-08-10"}],"documentos":[{"id":1,"socioId":2,"tipo":"atestado","nomeArquivo":"atestado-maria.pdf","status":"pendente"},{"id":2,"socioId":2,"tipo":"vinculo","nomeArquivo":"contracheque-maria.pdf","status":"aprovado"},{"id":3,"socioId":3,"tipo":"atestado","nomeArquivo":"atestado-joao.pdf","status":"aprovado"},{"id":4,"socioId":3,"tipo":"vinculo","nomeArquivo":"contracheque-joao.pdf","status":"aprovado"},{"id":5,"socioId":4,"tipo":"atestado","nomeArquivo":"atestado-ana.pdf","status":"aprovado"},{"id":6,"socioId":4,"tipo":"vinculo","nomeArquivo":"contracheque-ana.pdf","status":"aprovado"},{"id":7,"socioId":5,"tipo":"atestado","nomeArquivo":"atestado-carlos.pdf","status":"recusado"},{"id":8,"socioId":5,"tipo":"vinculo","nomeArquivo":"contracheque-carlos.pdf","status":"aprovado"},{"id":9,"socioId":6,"tipo":"atestado","nomeArquivo":"atestado-beatriz.pdf","status":"pendente"},{"id":10,"socioId":6,"tipo":"vinculo","nomeArquivo":"contracheque-beatriz.pdf","status":"aprovado"}],"inscricoes":[{"id":1,"socioId":2,"modalidadeId":1,"turmaId":1,"categoria":"docente","data":"2026-08-10","status":"pendente","periodo":"2º/2026"},{"id":2,"socioId":3,"modalidadeId":3,"turmaId":1,"categoria":"colaborador","data":"2026-08-10","status":"ativa","periodo":"2º/2026"},{"id":3,"socioId":4,"modalidadeId":2,"turmaId":2,"categoria":"docente","data":"2026-08-10","status":"ativa","periodo":"2º/2026"},{"id":4,"socioId":5,"modalidadeId":4,"turmaId":2,"categoria":"colaborador","data":"2026-08-10","status":"pendente","periodo":"2º/2026"},{"id":5,"socioId":6,"modalidadeId":3,"turmaId":1,"categoria":"colaborador","data":"2026-08-10","status":"pendente","periodo":"2º/2026"}],"mensalidades":[{"id":1,"inscricaoId":1,"socioId":2,"competencia":"Novembro/2026","valor":120,"vencimento":"2026-11-10","status":"pago","dataPagamento":"2026-11-05"},{"id":2,"inscricaoId":1,"socioId":2,"competencia":"Dezembro/2026","valor":120,"vencimento":"2026-12-10","status":"pendente","dataPagamento":null},{"id":3,"inscricaoId":2,"socioId":3,"competencia":"Novembro/2026","valor":120,"vencimento":"2026-11-10","status":"pendente","dataPagamento":null},{"id":4,"inscricaoId":2,"socioId":3,"competencia":"Dezembro/2026","valor":120,"vencimento":"2026-12-10","status":"pendente","dataPagamento":null},{"id":5,"inscricaoId":3,"socioId":4,"competencia":"Novembro/2026","valor":120,"vencimento":"2026-11-10","status":"pago","dataPagamento":"2026-11-05"},{"id":6,"inscricaoId":3,"socioId":4,"competencia":"Dezembro/2026","valor":120,"vencimento":"2026-12-10","status":"pendente","dataPagamento":null},{"id":7,"inscricaoId":4,"socioId":5,"competencia":"Novembro/2026","valor":120,"vencimento":"2026-11-10","status":"pendente","dataPagamento":null},{"id":8,"inscricaoId":4,"socioId":5,"competencia":"Dezembro/2026","valor":120,"vencimento":"2026-12-10","status":"pendente","dataPagamento":null},{"id":9,"inscricaoId":5,"socioId":6,"competencia":"Novembro/2026","valor":120,"vencimento":"2026-11-10","status":"pago","dataPagamento":"2026-11-05"},{"id":10,"inscricaoId":5,"socioId":6,"competencia":"Dezembro/2026","valor":120,"vencimento":"2026-12-10","status":"pendente","dataPagamento":null}],"avaliacoes":[{"socioId":2,"dificuldade":false,"apoio":false,"nivel":"basico","obs":"","data":"2026-08-10"},{"socioId":3,"dificuldade":false,"apoio":false,"nivel":"intermediario","obs":"","data":"2026-08-10"},{"socioId":4,"dificuldade":false,"apoio":false,"nivel":"avancado","obs":"","data":"2026-08-10"},{"socioId":6,"dificuldade":true,"apoio":true,"nivel":"basico","obs":"Dificuldade de equilíbrio; precisa de apoio na entrada da piscina.","data":"2026-08-10"}]};
/* =========================================================
   storage.js — dados do sistema e funções utilitárias
   - Dados iniciais: arquivos JSON da pasta /data (somente leitura)
   - Dados criados pelo usuário: localStorage do navegador
   ========================================================= */

const PERIODO = "2º/2026";
const CATEGORIAS = { colaborador: "Colaborador", docente: "Docente" };
// Texto do "saiba mais" (RF17): explica cada categoria antes da inscrição
const CATEGORIA_INFO = {
  colaborador: "Funcionários técnico-administrativos da instituição. É preciso enviar o comprovante de vínculo na inscrição.",
  docente: "Professores da instituição. É preciso enviar o comprovante de vínculo na inscrição."
};
// Dados da piscina (RF23). Dimensões e profundidade: confirmar com a stakeholder.
const PISCINA = { raias: 5, alunosPorRaia: 2, professoresPorTurma: 1, maxPorTurma: 10, dimensoes: "XX m × XX m", profundidade: "1,20 m na parte rasa e 1,80 m na parte funda" };
const NIVEIS = { nao_sabe: "Não sei nadar", basico: "Básico", intermediario: "Intermediário", avancado: "Avançado" };
const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

/* ---------- Acesso ao localStorage ---------- */
const DB = {
  prefixo: "clubify_modalidades_v2_",

  // Dados iniciais embutidos: funciona tanto em file:// quanto em servidor web.
  async init(raiz) {
    const dados = CLUBIFY_SEED;
    if (!DB.ler("iniciado")) {
      for (const chave of ["modalidades", "planos", "socios", "documentos", "inscricoes", "avaliacoes", "mensalidades"]) {
        DB.gravar(chave, dados[chave] || []);
      }
      DB.gravar("iniciado", true);
    }
    // Recupera instalações que ficaram sem dados após falha no fetch anterior.
    if (!Dados.modalidades().length) DB.gravar("modalidades", dados.modalidades);
    if (!Dados.planos().length) DB.gravar("planos", dados.planos);
  },

  ler(chave, padrao = null) {
    try {
      const valor = localStorage.getItem(DB.prefixo + chave);
      return valor === null ? padrao : JSON.parse(valor);
    } catch (e) { return padrao; }
  },

  gravar(chave, valor) {
    try { localStorage.setItem(DB.prefixo + chave, JSON.stringify(valor)); }
    catch (e) { console.error("Erro ao gravar no localStorage:", e); }
  },

  // Apaga tudo e volta aos dados de exemplo
  resetar() {
    try {
      Object.keys(localStorage).filter(k => k.startsWith(DB.prefixo)).forEach(k => localStorage.removeItem(k));
    } catch (e) { /* ignora */ }
  },

  proxId(lista) { return lista.length ? Math.max(...lista.map(i => i.id)) + 1 : 1; }
};

/* ---------- Acesso rápido às "tabelas" e regras de negócio ---------- */
const Dados = {
  socios: () => DB.ler("socios", []),
  modalidades: () => DB.ler("modalidades", []),
  planos: () => DB.ler("planos", []),
  inscricoes: () => DB.ler("inscricoes", []),
  mensalidades: () => DB.ler("mensalidades", []),
  documentos: () => DB.ler("documentos", []),
  avaliacoes: () => DB.ler("avaliacoes", []),
  avaliacao: socioId => Dados.avaliacoes().find(a => a.socioId === Number(socioId)) || null,
  // Custo mensal de manutenção (RF25) — valor de exemplo, editável pela administração
  custoManutencao: () => DB.ler("custo", 1800),
  salvar: (chave, lista) => DB.gravar(chave, lista),

  socio: id => Dados.socios().find(s => s.id === Number(id)),
  modalidade: id => Dados.modalidades().find(m => m.id === Number(id)),

  // Procura uma turma em qualquer modalidade
  turma(id) {
    for (const m of Dados.modalidades()) {
      const t = m.turmas.find(t => t.id === Number(id));
      if (t) return { modalidade: m, turma: t };
    }
    return null;
  },

  valorPlano: categoria => (Dados.planos().find(p => p.categoria === categoria) || { valor: 0 }).valor,

  vagasLivres(turma) {
    const usadas = Dados.inscricoes().filter(i => i.turmaId === turma.id && i.status !== "cancelada").length;
    return turma.vagas - usadas;
  },

  statusMensalidade(m) {
    if (m.status === "pago") return "pago";
    return m.vencimento < Util.hoje() ? "atrasada" : "pendente";
  },

  // Resume a situação dos documentos de um sócio
  statusDocs(socioId) {
    const docs = Dados.documentos().filter(d => d.socioId === socioId);
    if (!docs.length) return "naoenviado";
    if (docs.some(d => d.status === "recusado")) return "recusado";
    if (docs.some(d => d.status === "pendente")) return "emanalise";
    return "aprovado";
  },

  // Inscrição fica "ativa" quando os documentos exigidos estão aprovados (RF10 e RF15)
  reavaliarInscricoes(socioId) {
    const socio = Dados.socio(socioId);
    if (!socio) return;
    const docs = Dados.documentos().filter(d => d.socioId === socioId);
    const aprovado = tipo => docs.some(d => d.tipo === tipo && d.status === "aprovado");
    const ok = aprovado("atestado") && aprovado("vinculo");
    const lista = Dados.inscricoes();
    lista.forEach(i => {
      if (i.socioId === socioId && i.status !== "cancelada") i.status = ok ? "ativa" : "pendente";
    });
    Dados.salvar("inscricoes", lista);
  }
};

/* ---------- Funções utilitárias ---------- */
const Util = {
  esc(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  },
  digitos: t => String(t ?? "").replace(/\D/g, ""),

  mascaraCPF(valor) {
    const d = Util.digitos(valor).slice(0, 11);
    return d.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  },
  mascaraCelular(valor) {
    const d = Util.digitos(valor).slice(0, 11);
    if (d.length === 0) return "";
    if (d.length <= 2) return "(" + d;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  },
  emailValido: e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e),
  // Protótipo: valida apenas a quantidade de dígitos (não calcula o dígito verificador)
  cpfValido: c => Util.digitos(c).length === 11,
  celularValido: c => [10, 11].includes(Util.digitos(c).length),

  moeda: n => Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
  data(iso) {
    if (!iso) return "—";
    const [a, m, d] = String(iso).slice(0, 10).split("-");
    return `${d}/${m}/${a}`;
  },
  hoje() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  },

  badge(status) {
    const mapa = {
      pendente: ["b-p", "Pendente"], aprovado: ["b-a", "Aprovado"], recusado: ["b-r", "Recusado"],
      ativa: ["b-a", "Ativa"], pago: ["b-a", "Pago"], atrasada: ["b-r", "Atrasada"], cancelada: ["b-r", "Cancelada"],
      emanalise: ["b-p", "Em análise"], naoenviado: ["b-n", "Não enviados"], inativo: ["b-r", "Inativo"],
      preenchida: ["b-a", "Preenchida"], semavaliacao: ["b-p", "Pendente"]
    };
    const [classe, texto] = mapa[status] || ["b-n", status];
    return `<span class="badge ${classe}">${texto}</span>`;
  }
};
