(() => {
  // `disabled: true` em data/tools.js tira a ferramenta da vitrine (sem apagar), para reativar depois
  const T = (window.TOOLS || []).filter(t => !t.disabled).map(t => ({ ...t, id: t.repo.split("/")[1].toLowerCase() }));
  const C = window.CATEGORIES;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const uniq = a => [...new Set(a)].sort((x, y) => x.localeCompare(y, "pt"));
  const GROUP_AT = 12;   // acima disso: agrupa por categoria e libera "Mais filtros"
  const ICON = {
    utilidades: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
    casual: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1"/><circle cx="15.5" cy="15.5" r="1"/><circle cx="12" cy="12" r="1"/>',
    profissional: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>'
  };
  const svg = p => `<svg viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
  const STAR = svg('<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.2 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z"/>');
  const SL = { ativo: "Disponível", andamento: "Em construção", beta: "Beta", arquivado: "Arquivado" };
  const live = t => t.status === "ativo" || t.status === "beta";

  /* ---------- Web Storage (chave vf-tools:v1) ---------- */
  const KEY = "vf-tools:v1";
  const blank = () => ({ theme: "", favorites: [], recent: [], uses: {}, help: { seen: false }, filters: { cat: "", tag: "", status: "" } });
  let store = blank();
  try { store = { ...blank(), ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch {}
  store.filters = { ...blank().filters, ...store.filters };
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch {} };
  window.VFStore = { get: () => store, save: () => persist(), clearFilters: () => { Object.assign(store.filters, { cat: "", tag: "", status: "" }); q = ""; persist(); render(); } };
  const f = store.filters; let q = "";
  const byId = id => T.find(t => t.id === id);

  // filtros também na URL (#cat=casual&q=dnd) para compartilhar
  try { const p = new URLSearchParams(location.hash.slice(1)); for (const k of ["cat", "tag", "status"]) if (p.has(k)) f[k] = p.get(k); if (p.has("q")) q = p.get("q"); } catch {}
  const syncUrl = () => { const p = new URLSearchParams(); if (q) p.set("q", q); for (const k of ["cat", "tag", "status"]) if (f[k]) p.set(k, f[k]); history.replaceState(null, "", p.toString() ? "#" + p : location.pathname + location.search); };

  const track = id => { store.uses[id] = (store.uses[id] || 0) + 1; store.recent = [{ id, ts: Date.now() }, ...store.recent.filter(r => r.id !== id)].slice(0, 6); persist(); renderRecent(); };
  const toggleFav = id => { const i = store.favorites.indexOf(id); i < 0 ? store.favorites.push(id) : store.favorites.splice(i, 1); persist(); render(); };

  /* ---------- Render ---------- */
  const chipHtml = (key, val, label, n) => `<button class="chip" data-k="${key}" data-v="${esc(val)}" aria-pressed="${f[key] === val}">${esc(label)}${n != null ? ` <small>${n}</small>` : ""}</button>`;
  const rowHtml = t => {
    const fav = store.favorites.includes(t.id), gh = "https://github.com/" + t.repo;
    return `<article class="row" data-cat="${t.category}" data-id="${t.id}">
      <div class="meta"><span class="cat">${svg(ICON[t.category])}${esc(C[t.category].label)}</span><span class="badge ${live(t) ? "ok" : "wip"}">${esc(SL[t.status] || t.status)}</span></div>
      <h3>${esc(t.name)}</h3><p>${esc(t.description)}</p>
      <div class="tags">${(t.tags || []).map(x => `<span>${esc(x)}</span>`).join("")}</div>
      <div class="actions">
        ${live(t) && t.pages ? `<a class="btn primary" data-use href="${esc(t.pages)}">Usar agora</a><a class="btn" data-use href="${gh}" target="_blank" rel="noopener">Ver código</a>` : `<a class="btn" data-use href="${gh}" target="_blank" rel="noopener">Acompanhar no GitHub</a>`}
        <button class="fav" aria-pressed="${fav}" aria-label="${fav ? "Remover " + esc(t.name) + " dos favoritos" : "Adicionar " + esc(t.name) + " aos favoritos"}">${STAR}</button>
      </div></article>`;
  };

  function render() {
    const active = document.activeElement, keep = active && (active.dataset.k ? `[data-k="${active.dataset.k}"][data-v="${active.dataset.v}"]` : active.classList.contains("fav") && active.closest(".row, .favcard") ? `[data-id="${active.closest(".row, .favcard").dataset.id}"] .fav` : "");
    const present = Object.keys(C).filter(k => T.some(t => t.category === k));
    const favN = store.favorites.filter(id => byId(id)).length;
    if (f.cat === "__fav" && !favN) f.cat = "";
    $("cats").innerHTML = chipHtml("cat", "", "Todas", T.length) + present.map(k => chipHtml("cat", k, C[k].label, T.filter(t => t.category === k).length)).join("") + (favN ? chipHtml("cat", "__fav", "★ Favoritos", favN) : "");
    const big = T.length > GROUP_AT; $("adv").hidden = !big;
    if (big) {
      $("tags").innerHTML = chipHtml("tag", "", "Todas as tags") + uniq(T.flatMap(t => t.tags || [])).map(x => chipHtml("tag", x, x)).join("");
      $("status").innerHTML = '<option value="">Todos</option>' + uniq(T.map(t => t.status)).map(s => `<option value="${s}">${esc(SL[s] || s)}</option>`).join("");
      $("status").value = f.status;
    }
    $("q").value = q;
    const n = q.toLowerCase();
    const list = T.filter(t =>
      (!f.cat || (f.cat === "__fav" ? store.favorites.includes(t.id) : t.category === f.cat)) &&
      (!f.tag || (t.tags || []).includes(f.tag)) && (!f.status || t.status === f.status) &&
      (!n || [t.name, t.description, C[t.category].label, ...(t.tags || [])].join(" ").toLowerCase().includes(n))
    ).sort((a, b) => (live(b) - live(a)) || (store.favorites.includes(b.id) - store.favorites.includes(a.id)) || a.name.localeCompare(b.name, "pt"));
    if (big && !f.cat) {
      $("list").innerHTML = present.map(k => { const g = list.filter(t => t.category === k); return g.length ? `<h2 class="group">${esc(C[k].label)} — ${esc(C[k].desc)}</h2>` + g.map(rowHtml).join("") : ""; }).join("");
    } else $("list").innerHTML = list.map(rowHtml).join("");
    $("count").textContent = list.length === T.length ? `${T.length} ferramentas` : `${list.length} de ${T.length} ferramentas`;
    $("empty").hidden = list.length > 0;
    syncUrl(); renderFavs(); renderRecent();
    if (keep) { const el = document.querySelector(keep); el && el.focus({ preventScroll: true }); }
  }

  // "Suas favoritas": as ferramentas marcadas com ★, na ordem em que foram favoritadas
  function renderFavs() {
    const items = store.favorites.map(byId).filter(Boolean);
    $("favs").hidden = !items.length;
    $("favcount").textContent = items.length ? `${items.length} ${items.length === 1 ? "ferramenta" : "ferramentas"}` : "";
    $("favgrid").innerHTML = items.map(t => {
      const gh = "https://github.com/" + t.repo;
      return `<article class="favcard" data-cat="${t.category}" data-id="${t.id}">
        <div class="meta"><span class="cat">${svg(ICON[t.category])}${esc(C[t.category].label)}</span><span class="badge ${live(t) ? "ok" : "wip"}">${esc(SL[t.status] || t.status)}</span></div>
        <h3>${esc(t.name)}</h3>
        <div class="actions">
          ${live(t) && t.pages ? `<a class="btn primary" data-use href="${esc(t.pages)}">Usar agora</a>` : `<a class="btn" data-use href="${gh}" target="_blank" rel="noopener">Acompanhar no GitHub</a>`}
          <button class="fav" aria-pressed="true" aria-label="Remover ${esc(t.name)} dos favoritos">${STAR}</button>
        </div></article>`;
    }).join("");
  }

  function renderRecent() {
    const items = store.recent.map(r => byId(r.id)).filter(Boolean);
    $("continue").hidden = !items.length;
    $("recent").innerHTML = items.map(t => `<a data-id="${t.id}" href="${esc(live(t) && t.pages ? t.pages : "https://github.com/" + t.repo)}"${live(t) && t.pages ? "" : ' target="_blank" rel="noopener"'}>${esc(t.name)}</a>`).join("");
  }

  /* ---------- Eventos ---------- */
  $("cats").onclick = $("tags").onclick = e => { const b = e.target.closest(".chip"); if (!b) return; const { k, v } = b.dataset; f[k] = f[k] === v ? "" : v; persist(); render(); };
  $("list").addEventListener("click", e => {
    const row = e.target.closest(".row"); if (!row) return;
    if (e.target.closest(".fav")) toggleFav(row.dataset.id); else if (e.target.closest("[data-use]")) track(row.dataset.id);
  });
  $("favgrid").addEventListener("click", e => {
    const card = e.target.closest(".favcard"); if (!card) return;
    if (e.target.closest(".fav")) { const name = byId(card.dataset.id).name; toggleFav(card.dataset.id); toast(`${name} removida dos favoritos.`); }
    else if (e.target.closest("[data-use]")) track(card.dataset.id);
  });
  $("recent").addEventListener("click", e => { const a = e.target.closest("a"); if (a) track(a.dataset.id); });
  $("status").onchange = e => { f.status = e.target.value; persist(); render(); };
  $("q").oninput = e => { q = e.target.value; render(); };
  $("clear").onclick = () => { Object.assign(f, { cat: "", tag: "", status: "" }); q = ""; persist(); render(); };
  document.addEventListener("keydown", e => { if (e.key === "/" && !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); $("q").focus(); } });
  const toast = m => { const t = $("toast"); t.textContent = m; t.classList.add("on"); setTimeout(() => t.classList.remove("on"), 2500); };
  $("reset").onclick = () => {
    if (!confirm("Isso remove favoritos, histórico e tema deste navegador. Não dá para desfazer. Continuar?")) return;
    try { localStorage.removeItem(KEY); } catch {}
    store = blank(); Object.assign(f, store.filters); q = ""; document.documentElement.dataset.theme = "dark"; setMeta("dark"); render(); toast("Dados apagados.");
  };

  /* ---------- Tema (escuro por padrão) ---------- */
  const root = document.documentElement;
  const setMeta = th => { const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = th === "light" ? "#f7f1e7" : "#14110f"; };
  setMeta(root.dataset.theme || "dark");
  $("theme").onclick = () => { const next = (root.dataset.theme || "dark") === "dark" ? "light" : "dark"; store.theme = root.dataset.theme = next; setMeta(next); persist(); };

  /* ---------- Hero ---------- */
  const ready = T.filter(live).length, wip = T.filter(t => t.status === "andamento").length;
  $("stat").innerHTML = `<b>${ready}</b> ${ready === 1 ? "pronta" : "prontas"}` + (wip ? ` · <b>${wip}</b> em construção` : "");
  $("y").textContent = new Date().getFullYear();

  render();
})();
