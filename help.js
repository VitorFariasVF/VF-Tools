/* Assistente "Doggy" (o cachorro): balão de boas-vindas + tour guiado com seta.
   Estado salvo via window.VFStore (localStorage vf-tools:v1 → help.seen). */
(() => {
  const S = window.VFStore; if (!S) return;
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = () => matchMedia("(prefers-reduced-motion:reduce)").matches;
  const markSeen = () => { const st = S.get(); st.help = { ...(st.help || {}), seen: true }; S.save(); };
  const seen = () => !!(S.get().help || {}).seen;

  const MASCOT = (pose = "oi") => `<span class="vi">${window.ViDog(pose)}</span>`;

  const DEFAULT_STEPS = [
    { sel: "#q", pose: "busca", text: "Busque pelo nome, tag ou descrição. Dica: aperte a tecla / para vir direto para cá." },
    { sel: "#cats", pose: "cats", text: "Filtre por categoria: Utilidades, Casual ou Profissional. O número mostra quantas ferramentas há em cada uma." },
    { sel: ".row .actions", pose: "acao", text: "Aqui você usa a ferramenta, vê o código ou acompanha o desenvolvimento no GitHub. O selo perto do nome diz se ela está disponível ou em construção." },
    { sel: ".row .fav", pose: "amor", text: "Toque na estrela para favoritar. Suas favoritas sobem na lista e ficam salvas só neste navegador." },
    { sel: "#theme", pose: "tema", text: "Alterne entre o tema escuro e o claro quando preferir." },
    { sel: "#langs", pose: "cats", text: "Mais abaixo estão todos os meus repositórios públicos. Toque numa linguagem para filtrar a lista." },
    { sel: "#foot-priv", pose: "fim", text: "Aqui você apaga o que guardei neste navegador ou revê este tutorial. Nada sai do seu aparelho. Bom uso!" }
  ];

  // Outras ferramentas definem window.VFTour = { what: "esta ferramenta", steps: [{ sel, pose, text }] }
  const TOUR = window.VFTour || {}, STEPS = TOUR.steps || DEFAULT_STEPS, WHAT = TOUR.what || "o site";

  /* ---------- Botão flutuante + balão ---------- */
  const wrap = document.createElement("div");
  wrap.className = "help";
  wrap.innerHTML = `
    <div class="help-bubble" id="bubble" role="status" hidden>
      <button class="bubble-x" aria-label="Fechar ajuda" data-act="later">×</button>
      <p><strong>Oi, eu sou o Doggy!</strong> Quer um tour rápido por ${WHAT}? Já conhece? É só dispensar.</p>
      <div class="bubble-actions"><button class="btn primary" data-act="start">Me mostre</button><button class="btn" data-act="later">Dispensar</button></div>
    </div>
    <button class="help-fab" id="fab" aria-label="Ajuda: tour guiado">${MASCOT("oi")}<span class="fab-label">Ajuda</span></button>`;
  document.body.appendChild(wrap);
  const bubble = $("#bubble", wrap), fab = $("#fab", wrap);

  const showBubble = () => { bubble.hidden = false; fab.classList.add("wave"); setTimeout(() => fab.classList.remove("wave"), 3600); };
  const hideBubble = () => { bubble.hidden = true; fab.classList.remove("wave"); };
  const begin = () => { stopCalling(); hideBubble(); markSeen(); startTour(); };
  bubble.onclick = e => { const b = e.target.closest("[data-act]"); if (!b) return; if (b.dataset.act === "start") begin(); else { stopCalling(); hideBubble(); markSeen(); } };
  fab.onclick = begin;
  const link = document.getElementById("help-open"); if (link) link.onclick = begin;
  if (!seen()) setTimeout(() => { if (!document.body.classList.contains("touring")) showBubble(); }, 4000);

  /* Chamando a atenção: o Doggy pula e late para o botão de ajuda até o visitante reagir (máx. 5 vezes) */
  const viEl = $(".vi", fab), setPose = p => { viEl.innerHTML = window.ViDog(p); };
  let calls = 0, callT = 0, calling = false;
  const stopCalling = () => { clearTimeout(callT); calling = false; fab.classList.remove("call"); setPose("oi"); };
  function callAttention() {
    if (seen() || document.body.classList.contains("touring") || reduce()) return;
    calling = true; fab.classList.add("call"); setPose("au");
    setTimeout(() => { fab.classList.remove("call"); setPose("oi"); }, 1900);
    if (++calls < 5) callT = setTimeout(callAttention, 7000);
  }
  if (!seen() && !reduce()) callT = setTimeout(callAttention, 2500);
  ["pointerenter", "focus"].forEach(ev => fab.addEventListener(ev, stopCalling, { once: true }));

  /* ---------- Tour ---------- */
  let steps = [], i = 0, ring, arrow, card, shield, raf = 0, inerted = [];
  const visible = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };

  function startTour() {
    S.clearFilters && S.clearFilters();          // garante que os alvos existam
    steps = STEPS.map(s => ({ ...s, el: $(s.sel) })).filter(s => s.el && visible(s.el));
    if (!steps.length) return;
    shield = document.createElement("div"); shield.className = "tour-shield";
    ring = document.createElement("div"); ring.className = "tour-ring";
    arrow = document.createElement("div"); arrow.className = "tour-arrow"; arrow.setAttribute("aria-hidden", "true");
    arrow.innerHTML = '<svg viewBox="0 0 36 48"><path d="M18 5L6 19M18 5l12 14M18 5v38" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    card = document.createElement("div"); card.className = "tour-card"; card.setAttribute("role", "dialog"); card.setAttribute("aria-modal", "true"); card.setAttribute("aria-labelledby", "tour-title"); card.tabIndex = -1;
    document.body.append(shield, ring, arrow, card);
    document.body.classList.add("touring");
    inerted = [...document.querySelectorAll("header.top, main, #repos, footer.foot, .skip")]; inerted.forEach(el => el.inert = true);
    document.addEventListener("keydown", onKey, true);
    addEventListener("resize", onResize); addEventListener("scroll", sched, { passive: true });
    go(0);
  }

  function ensureVisible() {
    const r = steps[i].el.getBoundingClientRect(), h = innerHeight, short = h < 500;
    const want = short ? h * .12 : h * .3;      // em telas baixas, o alvo vai para o topo e o balão fica embaixo
    if (r.top < (short ? 20 : 90) || r.bottom > (short ? h * .35 : h * .6)) scrollTo({ top: Math.max(0, r.top + scrollY - want), behavior: reduce() ? "auto" : "smooth" });
  }

  function go(n) {
    i = Math.max(0, Math.min(steps.length - 1, n));
    const s = steps[i], last = i === steps.length - 1;
    card.innerHTML = `
      <div class="tour-head"><span class="tour-av">${MASCOT(s.pose)}</span><strong id="tour-title">Doggy</strong><span class="tour-count" aria-live="polite">Passo ${i + 1} de ${steps.length}</span></div>
      <p class="tour-text">${s.text}</p>
      <div class="tour-dots" aria-hidden="true">${steps.map((_, k) => `<i class="${k === i ? "on" : ""}"></i>`).join("")}</div>
      <div class="tour-actions"><button class="link skip-t" data-t="skip" aria-label="Pular tutorial">Pular</button><span class="sp"></span>
        ${i === 0 ? "" : '<button class="btn ghost" data-t="prev">Voltar</button>'}<button class="btn primary" data-t="next">${last ? "Concluir" : "Próximo"}</button></div>`;
    card.onclick = e => { const b = e.target.closest("[data-t]"); if (!b) return; ({ skip: endTour, prev: () => go(i - 1), next: () => last ? endTour() : go(i + 1) })[b.dataset.t](); };
    ensureVisible(); place(); setTimeout(place, 450);
    $('[data-t="next"]', card).focus({ preventScroll: true });
  }

  const sched = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(place); };
  const onResize = () => { ensureVisible(); sched(); };

  function place() {
    if (!card) return;
    const r = steps[i].el.getBoundingClientRect(), pad = 6, vw = innerWidth, vh = innerHeight;
    Object.assign(ring.style, { left: r.left - pad + "px", top: r.top - pad + "px", width: r.width + pad * 2 + "px", height: r.height + pad * 2 + "px" });
    // balão: embaixo à direita; se cobrir o alvo, sobe; se ainda cobrir, vai para a esquerda
    const hit = () => { const c = card.getBoundingClientRect(); return c.top < r.bottom + 56 && c.bottom > r.top - 56 && c.left < r.right + 8 && c.right > r.left - 8; };
    delete card.dataset.side; card.dataset.pos = "bottom";
    if (hit()) card.dataset.pos = "top";
    if (hit()) { card.dataset.side = "left"; card.dataset.pos = "bottom"; if (hit()) card.dataset.pos = "top"; }
    const c = card.getBoundingClientRect();
    const spaceBelow = vh - r.bottom - (card.dataset.pos === "bottom" ? c.height + 24 : 0);
    const up = spaceBelow >= 64;   // seta abaixo do alvo apontando para cima; senão acima apontando para baixo
    arrow.classList.toggle("down", !up);
    arrow.style.left = Math.min(Math.max(r.left + r.width / 2, 24), vw - 24) - 18 + "px";
    arrow.style.top = (up ? r.bottom + pad + 4 : r.top - pad - 52) + "px";
  }

  function endTour() {
    cancelAnimationFrame(raf);
    [shield, ring, arrow, card].forEach(el => el && el.remove());
    document.body.classList.remove("touring");
    inerted.forEach(el => el.inert = false); inerted = [];
    document.removeEventListener("keydown", onKey, true);
    removeEventListener("resize", onResize); removeEventListener("scroll", sched);
    card = null; fab.focus();
  }

  function onKey(e) {
    if (!card) return;
    if (e.key === "Escape") { e.preventDefault(); endTour(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); i < steps.length - 1 ? go(i + 1) : endTour(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
    else if (e.key === "Tab") {
      const f = [...card.querySelectorAll("button:not([disabled])")]; if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (!card.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
})();
