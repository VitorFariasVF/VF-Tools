(() => {
  const T = window.TOOLS || [];
  const $ = id => document.getElementById(id);
  const state = { q: "", cat: "", tag: "", status: "", sort: "name" };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const uniq = a => [...new Set(a)].sort((x, y) => x.localeCompare(y, "pt"));

  // estado ↔ URL hash
  const load = () => { try { Object.assign(state, Object.fromEntries(new URLSearchParams(location.hash.slice(1)))); } catch {} };
  const save = () => { const p = new URLSearchParams(); for (const [k, v] of Object.entries(state)) if (v && !(k === "sort" && v === "name")) p.set(k, v); history.replaceState(null, "", p.toString() ? "#" + p : location.pathname); };

  const chips = (el, items, key, allLabel) => {
    el.innerHTML = [["", allLabel], ...items.map(i => [i, i])].map(([v, l]) =>
      `<button class="chip" data-v="${esc(v)}" aria-pressed="${state[key] === v}">${esc(l)}</button>`).join("");
    el.onclick = e => { const b = e.target.closest(".chip"); if (!b) return; state[key] = state[key] === b.dataset.v ? "" : b.dataset.v; render(); };
  };

  function render() {
    chips($("cats"), uniq(T.map(t => t.category)), "cat", "Todas");
    chips($("tags"), uniq(T.flatMap(t => t.tags || [])), "tag", "Todas as tags");
    $("status").value = state.status; $("sort").value = state.sort; $("q").value = state.q;
    const q = state.q.toLowerCase();
    const list = T.filter(t =>
      (!state.cat || t.category === state.cat) &&
      (!state.tag || (t.tags || []).includes(state.tag)) &&
      (!state.status || t.status === state.status) &&
      (!q || [t.name, t.description, t.category, ...(t.tags || [])].join(" ").toLowerCase().includes(q))
    ).sort((a, b) => state.sort === "status" ? a.status.localeCompare(b.status) || a.name.localeCompare(b.name) : a.name.localeCompare(b.name, "pt"));
    $("grid").innerHTML = list.map(t => `
      <article class="card">
        <div class="meta"><span class="cat">${esc(t.category)}</span><span class="status ${esc(t.status)}">${esc(t.status)}</span></div>
        <h2>${esc(t.name)}</h2>
        <p>${esc(t.description)}</p>
        <div class="tags">${(t.tags || []).map(x => `<span>${esc(x)}</span>`).join("")}</div>
        <div class="actions">
          ${t.demo ? `<a class="btn primary" href="${esc(t.demo)}" target="_blank" rel="noopener">Abrir</a>` : ""}
          <a class="btn" href="https://github.com/${esc(t.repo)}" target="_blank" rel="noopener">GitHub</a>
        </div>
      </article>`).join("");
    $("count").textContent = `${list.length} de ${T.length} ferramentas`;
    $("empty").hidden = list.length > 0;
    save();
  }

  const statuses = uniq(T.map(t => t.status));
  $("status").insertAdjacentHTML("beforeend", statuses.map(s => `<option value="${esc(s)}">${esc(s)}</option>`).join(""));
  $("status").onchange = e => { state.status = e.target.value; render(); };
  $("sort").onchange = e => { state.sort = e.target.value; render(); };
  $("q").oninput = e => { state.q = e.target.value; render(); };
  $("clear").onclick = () => { Object.assign(state, { q: "", cat: "", tag: "", status: "" }); render(); };
  $("y").textContent = new Date().getFullYear();

  const root = document.documentElement;
  try { const s = localStorage.getItem("theme"); if (s) root.dataset.theme = s; } catch {}
  $("theme").onclick = () => {
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme:dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch {}
  };

  load(); render();
})();
