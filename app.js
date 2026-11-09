(() => {
  const T = (window.TOOLS || []).map(t => ({ ...t, id: t.repo.split("/")[1].toLowerCase() }));
  const C = window.CATEGORIES;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const uniq = a => [...new Set(a)].sort((x, y) => x.localeCompare(y, "pt"));

  /* ---------- Web Storage (localStorage, com fallback em memória) ---------- */
  const KEY = "vf-tools:v1";
  const blank = () => ({ theme: "", favorites: [], recent: [], uses: {}, filters: { cat: "", tag: "", status: "", sort: "name" } });
  let store = blank();
  try { store = { ...blank(), ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch {}
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch {} };
  const byId = id => T.find(t => t.id === id);
  const track = id => {
    store.uses[id] = (store.uses[id] || 0) + 1;
    store.recent = [{ id, ts: Date.now() }, ...store.recent.filter(r => r.id !== id)].slice(0, 8);
    persist(); renderRecent();
  };
  const toggleFav = id => {
    const i = store.favorites.indexOf(id);
    i < 0 ? store.favorites.push(id) : store.favorites.splice(i, 1);
    persist(); render();
  };

  /* ---------- Estado de filtros (restaurado do storage) ---------- */
  const f = store.filters; let q = "";
  const chips = (el, items, key, all) => {
    el.innerHTML = [["", all], ...items].map(([val, label]) =>
      `<button class="chip" data-v="${esc(val)}" aria-pressed="${f[key] === val}">${esc(label)}</button>`).join("");
    el.onclick = e => { const b = e.target.closest(".chip"); if (!b) return; f[key] = f[key] === b.dataset.v ? "" : b.dataset.v; persist(); render(); };
  };

  function render() {
    const cats = Object.entries(C).map(([k, v]) => [k, `${v.icon} ${v.label}`]);
    chips($("cats"), cats, "cat", "Todas");
    chips($("tags"), uniq(T.flatMap(t => t.tags || [])).map(x => [x, x]), "tag", "Todas as tags");
    $("status").value = f.status; $("sort").value = f.sort; $("q").value = q;
    const n = q.toLowerCase();
    const rec = id => store.recent.findIndex(r => r.id === id);
    const list = T.filter(t =>
      (!f.cat || t.category === f.cat) && (!f.tag || (t.tags || []).includes(f.tag)) && (!f.status || t.status === f.status) &&
      (!n || [t.name, t.description, C[t.category].label, ...(t.tags || [])].join(" ").toLowerCase().includes(n))
    ).sort((a, b) => {
      const fa = store.favorites.includes(b.id) - store.favorites.includes(a.id);
      if (fa) return fa;
      if (f.sort === "used") return (store.uses[b.id] || 0) - (store.uses[a.id] || 0) || a.name.localeCompare(b.name, "pt");
      if (f.sort === "recent") return (rec(a.id) < 0 ? 99 : rec(a.id)) - (rec(b.id) < 0 ? 99 : rec(b.id));
      return a.name.localeCompare(b.name, "pt");
    });
    $("grid").innerHTML = list.map(t => {
      const fav = store.favorites.includes(t.id);
      return `<article class="card hidden-in" data-cat="${t.category}" data-id="${t.id}">
        <div class="meta"><span class="cat">${C[t.category].icon} ${esc(C[t.category].label)}</span><span class="status ${esc(t.status)}">${esc(t.status)}</span></div>
        <h3>${esc(t.name)}</h3><p>${esc(t.description)}</p>
        <div class="tags">${(t.tags || []).map(x => `<span>${esc(x)}</span>`).join("")}</div>
        <div class="actions">
          ${t.demo ? `<a class="btn primary" data-use href="${esc(t.demo)}" target="_blank" rel="noopener">Abrir</a>` : ""}
          <a class="btn" data-use href="https://github.com/${esc(t.repo)}" target="_blank" rel="noopener">GitHub</a>
          <button class="fav" aria-pressed="${fav}" aria-label="${fav ? "Remover dos" : "Adicionar aos"} favoritos">${fav ? "★" : "☆"}</button>
        </div></article>`;
    }).join("");
    $("count").textContent = `${list.length} de ${T.length} ferramentas`;
    $("empty").hidden = list.length > 0;
    observe(); renderRecent();
  }

  $("grid").addEventListener("click", e => {
    const card = e.target.closest(".card"); if (!card) return;
    if (e.target.closest(".fav")) toggleFav(card.dataset.id);
    else if (e.target.closest("[data-use]")) track(card.dataset.id);
  });

  function renderRecent() {
    const items = store.recent.map(r => byId(r.id)).filter(Boolean).slice(0, 6);
    $("continue").hidden = !items.length;
    $("recent").innerHTML = items.map(t => `<a class="mini" data-cat="${t.category}" data-id="${t.id}" href="${esc(t.demo || "https://github.com/" + t.repo)}" target="_blank" rel="noopener">
      <small>${C[t.category].icon} ${esc(C[t.category].label)}</small><h3>${esc(t.name)}</h3><small>${store.uses[t.id] || 0}× aberto</small></a>`).join("");
  }
  $("recent").addEventListener("click", e => { const a = e.target.closest(".mini"); if (a) track(a.dataset.id); });

  /* ---------- Animação de entrada dos cards ---------- */
  let io;
  function observe() {
    io && io.disconnect();
    io = new IntersectionObserver(es => es.forEach((en, i) => { if (en.isIntersecting) { setTimeout(() => en.target.classList.remove("hidden-in"), i * 60); io.unobserve(en.target); } }), { threshold: .1 });
    document.querySelectorAll(".card.hidden-in").forEach(c => io.observe(c));
  }

  /* ---------- Estatísticas animadas no hero ---------- */
  const stats = [[T.length, "ferramentas"], [Object.keys(C).length, "categorias"], [T.filter(t => t.status === "ativo").length, "ativas"]];
  $("stats").innerHTML = stats.map(([n, l]) => `<div class="stat"><b data-n="${n}">0</b><span>${l}</span></div>`).join("");
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  document.querySelectorAll("[data-n]").forEach(el => {
    const end = +el.dataset.n; if (reduce) return (el.textContent = end);
    const t0 = performance.now() + 500;
    (function tick(t) { const p = Math.min(Math.max((t - t0) / 900, 0), 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); })(t0);
  });

  /* ---------- Controles ---------- */
  $("status").insertAdjacentHTML("beforeend", uniq(T.map(t => t.status)).map(s => `<option value="${esc(s)}">${esc(s)}</option>`).join(""));
  $("status").onchange = e => { f.status = e.target.value; persist(); render(); };
  $("sort").onchange = e => { f.sort = e.target.value; persist(); render(); };
  $("q").oninput = e => { q = e.target.value; render(); };
  $("clear").onclick = () => { Object.assign(f, { cat: "", tag: "", status: "" }); q = ""; persist(); render(); };
  $("reset").onclick = () => { if (confirm("Apagar favoritos, histórico e preferências deste navegador?")) { try { localStorage.removeItem(KEY); } catch {} store = blank(); location.reload(); } };
  $("y").textContent = new Date().getFullYear();

  const root = document.documentElement;
  if (store.theme) root.dataset.theme = store.theme;
  $("theme").onclick = () => {
    const dark = (root.dataset.theme || "dark") === "dark";
    store.theme = root.dataset.theme = dark ? "light" : "dark"; persist();
  };

  render();
})();
