/* Assistente "Vi": balão de boas-vindas + tour guiado com seta.
   Estado salvo em localStorage via window.VFStore (chave vf-tools:v1 → help.seen). */
(() => {
  const S = window.VFStore; if (!S) return;
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = () => matchMedia("(prefers-reduced-motion:reduce)").matches;
  const markSeen = () => { const st = S.get(); st.help = { ...(st.help || {}), seen: true }; S.save(); };
  const seen = () => !!(S.get().help || {}).seen;

  const MASCOT = `<svg viewBox="0 0 64 64" aria-hidden="true" class="vi">
    <circle cx="28" cy="38" r="21" fill="var(--accent)"/>
    <circle cx="21" cy="34" r="3" fill="var(--accent-ink)"/><circle cx="35" cy="34" r="3" fill="var(--accent-ink)"/>
    <path d="M20 44c3 4 13 4 16 0" fill="none" stroke="var(--accent-ink)" stroke-width="2.6" stroke-linecap="round"/>
    <g class="hand"><path d="M47 30c-1-6 0-12 3-14 2-1 3 1 3 3 1-2 4-2 4 1 0 4-1 9-4 13z" fill="var(--accent)" stroke="var(--bg)" stroke-width="2" stroke-linejoin="round"/></g></svg>`;

  const STEPS = [
    { sel: "#q", text: "Busque pelo nome, tag ou descrição. Dica: aperte a tecla / para vir direto para cá." },
    { sel: "#cats", text: "Filtre por categoria: Utilidades, Casual ou Profissional. O número mostra quantas ferramentas há em cada uma." },
    { sel: ".row .badge", text: "Este selo diz se a ferramenta já está pronta ou ainda em construção." },
    { sel: ".row .actions", text: "Aqui você abre a ferramenta, vê o código ou acompanha o desenvolvimento no GitHub." },
    { sel: ".row .fav", text: "Favorite com a estrela. Favoritas sobem na lista e ficam salvas só neste navegador." },
    { sel: "#continue", text: "Aqui aparecem as ferramentas que você abriu por último, para voltar rápido." },
    { sel: "#theme", text: "Alterne entre o tema escuro e o claro quando preferir." },
    { sel: "#foot-priv", text: "Pronto! Aqui você apaga o que o site guardou ou revê este tutorial. Também pode me chamar pelo botão de ajuda." }
  ];

  /* ---------- Botão flutuante + balão de boas-vindas ---------- */
  const wrap = document.createElement("div");
  wrap.className = "help";
  wrap.innerHTML = `
    <div class="help-bubble" id="bubble" role="region" aria-label="Ajuda" hidden>
      <button class="bubble-x" aria-label="Fechar ajuda" data-act="later">×</button>
      <p><strong>Oi, eu sou o Vi!</strong> Quer que eu te mostre como usar o site?</p>
      <div class="bubble-actions"><button class="btn primary" data-act="start">Me mostre</button><button class="btn" data-act="later">Agora não</button></div>
    </div>
    <button class="help-fab" id="fab" aria-label="Ajuda: tutorial guiado do site" title="Ajuda">${MASCOT}</button>`;
  document.body.appendChild(wrap);
  const bubble = $("#bubble", wrap), fab = $("#fab", wrap);

  const showBubble = () => { bubble.hidden = false; fab.classList.add("wave"); setTimeout(() => fab.classList.remove("wave"), 4200); };
  const hideBubble = () => { bubble.hidden = true; fab.classList.remove("wave"); };
  bubble.onclick = e => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    hideBubble(); markSeen();
    if (b.dataset.act === "start") startTour(); else fab.focus();
  };
  fab.onclick = () => { hideBubble(); markSeen(); startTour(); };
  const open2 = document.getElementById("help-open"); if (open2) open2.onclick = () => { hideBubble(); markSeen(); startTour(); };
  if (!seen()) setTimeout(() => { if (!document.body.classList.contains("touring")) showBubble(); }, 2200);

  /* ---------- Tour ---------- */
  let steps = [], i = 0, ring, arrow, card, shield, raf = 0;
  const visible = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };

  function startTour() {
    steps = STEPS.map(s => ({ ...s, el: $(s.sel) })).filter(s => s.el && visible(s.el));
    if (!steps.length) return;
    i = 0;
    shield = document.createElement("div"); shield.className = "tour-shield";
    ring = document.createElement("div"); ring.className = "tour-ring";
    arrow = document.createElement("div"); arrow.className = "tour-arrow"; arrow.setAttribute("aria-hidden", "true");
    arrow.innerHTML = '<svg viewBox="0 0 36 48"><path d="M18 5L6 19M18 5l12 14M18 5v38" fill="none" stroke="#f0b254" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    card = document.createElement("div"); card.className = "tour-card"; card.setAttribute("role", "dialog"); card.setAttribute("aria-modal", "true"); card.setAttribute("aria-labelledby", "tour-title"); card.tabIndex = -1;
    document.body.append(shield, ring, arrow, card);
    document.body.classList.add("touring");
    document.addEventListener("keydown", onKey, true);
    addEventListener("resize", sched); addEventListener("scroll", sched, { passive: true });
    go(0);
  }

  function go(n) {
    i = Math.max(0, Math.min(steps.length - 1, n));
    const s = steps[i], last = i === steps.length - 1;
    card.innerHTML = `
      <div class="tour-head"><span class="tour-av">${MASCOT}</span><strong id="tour-title">Vi</strong><span class="tour-count" aria-live="polite">Passo ${i + 1} de ${steps.length}</span></div>
      <p class="tour-text">${s.text}</p>
      <div class="tour-dots" aria-hidden="true">${steps.map((_, k) => `<i class="${k === i ? "on" : ""}"></i>`).join("")}</div>
      <div class="tour-actions"><button class="link" data-t="skip">Pular</button><span class="sp"></span>
        <button class="btn" data-t="prev" ${i === 0 ? "disabled" : ""}>Voltar</button><button class="btn primary" data-t="next">${last ? "Concluir" : "Próximo"}</button></div>`;
    card.onclick = e => { const b = e.target.closest("[data-t]"); if (!b) return; ({ skip: endTour, prev: () => go(i - 1), next: () => last ? endTour() : go(i + 1) })[b.dataset.t](); };
    // rola o alvo para uma altura confortável, longe do balão
    const r = s.el.getBoundingClientRect(), h = innerHeight;
    if (r.top < 90 || r.bottom > h * .6) scrollTo({ top: Math.max(0, r.top + scrollY - h * .3), behavior: reduce() ? "auto" : "smooth" });
    place(); setTimeout(place, 450);
    $('[data-t="next"]', card).focus({ preventScroll: true });
  }

  const sched = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(place); };
  function place() {
    if (!card) return;
    const s = steps[i], r = s.el.getBoundingClientRect(), pad = 6, vw = innerWidth, vh = innerHeight;
    Object.assign(ring.style, { left: r.left - pad + "px", top: r.top - pad + "px", width: r.width + pad * 2 + "px", height: r.height + pad * 2 + "px" });
    // balão fica embaixo; se cobrir o alvo, sobe
    card.dataset.pos = "bottom";
    let c = card.getBoundingClientRect();
    if (c.top < r.bottom + 56 && c.bottom > r.top - 56 && c.left < r.right && c.right > r.left) { card.dataset.pos = "top"; c = card.getBoundingClientRect(); }
    // seta: abaixo do alvo apontando para cima, ou acima apontando para baixo
    const spaceBelow = vh - r.bottom - (card.dataset.pos === "bottom" ? c.height + 24 : 0);
    const up = spaceBelow >= 64;   // seta fica abaixo do alvo apontando para cima; senão, acima apontando para baixo
    arrow.style.setProperty("--dir", up ? 1 : -1);
    arrow.classList.toggle("down", !up);
    const x = Math.min(Math.max(r.left + r.width / 2, 24), vw - 24);
    arrow.style.left = x - 18 + "px";
    arrow.style.top = (up ? r.bottom + pad + 4 : r.top - pad - 52) + "px";
  }

  function endTour() {
    cancelAnimationFrame(raf);
    [shield, ring, arrow, card].forEach(el => el && el.remove());
    document.body.classList.remove("touring");
    document.removeEventListener("keydown", onKey, true);
    removeEventListener("resize", sched); removeEventListener("scroll", sched);
    card = null; fab.focus();
  }

  function onKey(e) {
    if (!card) return;
    if (e.key === "Escape") { e.preventDefault(); endTour(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); i < steps.length - 1 ? go(i + 1) : endTour(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
    else if (e.key === "Tab") {   // mantém o foco dentro do balão
      const f = [...card.querySelectorAll("button:not([disabled])")]; if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (!card.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
})();
