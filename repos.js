/* Repositórios públicos: lista editorial com linguagens e filtro.
   Dados ao vivo da API pública do GitHub (cache de 1 h no navegador); se falhar, usa data/repos.js. */
(() => {
  const USER = "VitorFariasVF", CACHE = "vf-tools:repos:v1", TTL = 3600e3, SHOW = 12;
  const LC = { JavaScript: "#f1e05a", TypeScript: "#3178c6", HTML: "#e34c26", CSS: "#563d7c", Python: "#2fa398", Java: "#b07219", SCSS: "#c6538c", Shell: "#89e051", PHP: "#4f5d95", "C#": "#178600", Vue: "#41b883" };
  const NONE = "__none", $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const color = l => LC[l] || "#8a7e6c";
  const snap = window.REPOS_SNAPSHOT || { at: "", items: [] };
  let items = snap.items, source = "snapshot", state = { lang: "", sort: "recent", all: false };

  const ago = iso => {
    const d = Math.round((Date.now() - new Date(iso + "T12:00:00").getTime()) / 864e5), rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
    if (d < 1) return "hoje"; if (d < 30) return rtf.format(-d, "day"); if (d < 365) return rtf.format(-Math.round(d / 30), "month"); return rtf.format(-Math.round(d / 365), "year");
  };
  const map = r => ({ n: r.name, d: r.description || "", l: r.language || "", s: r.stargazers_count || 0, u: (r.pushed_at || "").slice(0, 10), h: r.homepage || "", f: !!r.fork });
  const safeUrl = u => /^https?:\/\//i.test(u) ? u : "";

  function render() {
    const total = items.length, counts = {};
    items.forEach(r => { const k = r.l || NONE; counts[k] = (counts[k] || 0) + 1; });
    const langs = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    const real = langs.filter(([k]) => k !== NONE).length;
    $("repos-meta").textContent = `${total} repositórios · ${real} linguagens`;
    $("langbar").innerHTML = langs.map(([k, n]) => `<i style="--lc:${color(k === NONE ? "" : k)};flex:${n}"></i>`).join("");
    const chip = (v, label, n, c) => `<button class="chip" data-v="${esc(v)}" aria-pressed="${state.lang === v}">${c ? `<span class="dot" style="--lc:${c}"></span>` : ""}${esc(label)} <small>${n}</small></button>`;
    $("langs").innerHTML = chip("", "Todas", total) + langs.map(([k, n]) => chip(k, k === NONE ? "Sem linguagem" : k, n, color(k === NONE ? "" : k))).join("");
    let list = items.filter(r => !state.lang || (state.lang === NONE ? !r.l : r.l === state.lang));
    list = [...list].sort((a, b) => state.sort === "name" ? a.n.localeCompare(b.n, "pt") : state.sort === "stars" ? b.s - a.s || b.u.localeCompare(a.u) : b.u.localeCompare(a.u));
    const shown = state.all ? list : list.slice(0, SHOW);
    $("repo-list").innerHTML = shown.map(r => `<article class="row" style="--c:${color(r.l)}">
      <div class="meta"><span class="cat">${r.l ? `<span class="dot" style="--lc:${color(r.l)}"></span>${esc(r.l)}` : "Sem linguagem"}</span>${r.f ? '<span class="badge">fork</span>' : ""}</div>
      <h3><a href="https://github.com/${USER}/${encodeURIComponent(r.n)}" target="_blank" rel="noopener">${esc(r.n)}</a></h3>
      <p>${r.d ? esc(r.d) : '<span class="muted">Sem descrição.</span>'}</p>
      <div class="tags">${r.s ? `<span>${r.s} ★</span>` : ""}<span>atualizado ${ago(r.u)}</span></div>
      <div class="actions">${safeUrl(r.h) ? `<a class="btn primary" href="${esc(r.h)}" target="_blank" rel="noopener">Abrir site</a>` : ""}<a class="btn" href="https://github.com/${USER}/${encodeURIComponent(r.n)}" target="_blank" rel="noopener">GitHub</a></div></article>`).join("");
    const more = $("repo-more"); more.hidden = list.length <= SHOW;
    more.textContent = state.all ? "Mostrar menos" : `Ver todos os ${list.length} repositórios`;
    $("repos-src").textContent = source === "live" ? "Dados ao vivo do GitHub." : `Dados de ${snap.at.split("-").reverse().join("/")} (o GitHub não respondeu agora).`;
  }

  $("langs").onclick = e => { const b = e.target.closest(".chip"); if (!b) return; state.lang = state.lang === b.dataset.v ? "" : b.dataset.v; state.all = false; render(); const nb = document.querySelector(`#langs [data-v="${state.lang}"]`); nb && nb.focus({ preventScroll: true }); };
  $("rsort").onchange = e => { state.sort = e.target.value; render(); };
  $("repo-more").onclick = () => { state.all = !state.all; render(); };

  // dados ao vivo, com cache de 1 h e plano B no retrato
  async function load() {
    try { const c = JSON.parse(localStorage.getItem(CACHE) || "null"); if (c && Date.now() - c.t < TTL && c.items.length) { items = c.items; source = "live"; render(); return; } } catch {}
    try {
      const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&type=owner&sort=pushed`, { headers: { Accept: "application/vnd.github+json" } });
      if (!res.ok) throw new Error(res.status);
      const live = (await res.json()).filter(r => r.name !== USER).map(map);
      if (!live.length) throw new Error("vazio");
      items = live; source = "live"; render();
      try { localStorage.setItem(CACHE, JSON.stringify({ t: Date.now(), items: live })); } catch {}
    } catch { /* mantém o retrato */ }
  }
  render(); load();
})();
