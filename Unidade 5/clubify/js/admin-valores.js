/* admin-valores.js — Valores por categoria e mensalidades (RF09, RF15, RF25) */

iniciarPagina(() => {
  function resumo() {
    const ativas = Dados.inscricoes().filter(i => i.status !== "cancelada");
    const arrec = ativas.reduce((soma, i) => soma + Dados.valorPlano(i.categoria), 0);
    const custo = Dados.custoManutencao();
    $("#st-arrec").textContent = Util.moeda(arrec);
    $("#st-custo").textContent = Util.moeda(custo);
    const saldo = arrec - custo;
    $("#st-saldo").textContent = Util.moeda(saldo);
    $("#st-saldo").style.color = saldo >= 0 ? "var(--green)" : "var(--red)";
  }

  function desenharCampos() {
    $("#campos-planos").innerHTML = Dados.planos().map(p =>
      `<div class="field"><label for="plano-${p.id}">${esc(p.nome)} — mensalidade (R$)</label><input type="number" min="0" step="1" id="plano-${p.id}" value="${p.valor}"></div>`).join("");
    $("#custo").value = Dados.custoManutencao();
  }

  $("#btn-salvar").addEventListener("click", () => {
    limparErros();
    const planos = Dados.planos();
    let ok = true;
    planos.forEach(p => {
      const campo = $("#plano-" + p.id);
      if (!(Number(campo.value) > 0)) { setErro(campo, "Informe um valor maior que zero."); ok = false; }
    });
    const custo = $("#custo");
    if (custo.value === "" || Number(custo.value) < 0) { setErro(custo, "Informe o custo."); ok = false; }
    if (!ok) return;
    planos.forEach(p => (p.valor = Number($("#plano-" + p.id).value)));
    Dados.salvar("planos", planos);
    DB.gravar("custo", Number(custo.value));
    mostrarToast("Valores salvos.");
    resumo();
  });

  function desenharMensalidades() {
    const filtro = $("#f-mens").value;
    const lista = Dados.mensalidades().map(m => ({ m, st: Dados.statusMensalidade(m) }))
      .filter(x => !filtro || x.st === filtro)
      .sort((a, b) => a.m.vencimento.localeCompare(b.m.vencimento));
    $("#tab-mens").innerHTML = lista.length ? lista.map(({ m, st }) => {
      const s = Dados.socio(m.socioId);
      return `<tr><td><a class="link-azul" href="socio-detalhe.html?id=${m.socioId}">${esc(s ? s.nome : "—")}</a></td>
        <td>${esc(m.competencia)}</td><td>${Util.moeda(m.valor)}</td><td>${Util.data(m.vencimento)}</td><td>${Util.badge(st)}</td>
        <td>${st !== "pago" ? `<button class="btn sm" data-pagar="${m.id}">Registrar pagamento</button>` : ""}</td></tr>`;
    }).join("") : `<tr><td class="vazio" colspan="6">Nenhuma mensalidade encontrada.</td></tr>`;
  }
  $("#f-mens").addEventListener("input", desenharMensalidades);
  $("#tab-mens").addEventListener("click", e => {
    const b = e.target.closest("[data-pagar]");
    if (!b) return;
    const lista = Dados.mensalidades();
    const m = lista.find(m => m.id === Number(b.dataset.pagar));
    m.status = "pago"; m.dataPagamento = Util.hoje();
    Dados.salvar("mensalidades", lista);
    mostrarToast("Pagamento registrado.");
    desenharMensalidades();
  });

  desenharCampos(); resumo(); desenharMensalidades();
}, "admin");
