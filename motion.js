/* VF Tools — motion.js: fade-out ao sair da página e troca de tela com fade-out/fade-in.
   A abertura (cortina + barra) é só CSS (motion.css). Respeita prefers-reduced-motion. */
(function () {
  "use strict";
  var root = document.documentElement, LEAVE = 250;
  var still = function () { return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; };

  /* Sair da página: fade-out e então navega. Links normais, mesma aba. */
  function go(url) {
    if (still()) { location.href = url; return; }
    root.classList.add("vf-leaving");
    setTimeout(function () { location.href = url; }, LEAVE);
    setTimeout(function () { root.classList.remove("vf-leaving"); }, 1500); /* navegação cancelada (download, mailto...) */
  }
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
    var h = a.getAttribute("href");
    if (!h || h.charAt(0) === "#" || /^(javascript|mailto|tel|blob|data):/i.test(h)) return;
    var u; try { u = new URL(a.href, location.href); } catch (_) { return; }
    if (u.href.split("#")[0] === location.href.split("#")[0]) return;
    e.preventDefault(); go(u.href);
  });
  /* Voltar pelo histórico (cache de página): tira a cortina de saída */
  addEventListener("pageshow", function (e) { if (e.persisted) root.classList.remove("vf-leaving"); });

  /* Trocar de tela dentro da ferramenta: VFMotion.swap(telaQueSai, telaQueEntra, depois?)
     A que sai faz fade-out (0,25 s), depois é escondida e a que entra aparece com fade-in (CSS). */
  function swap(out, inn, done) {
    var fin = function () { if (out) { out.classList.remove("vf-out"); out.hidden = true; } if (inn) inn.hidden = false; if (done) done(); };
    if (!out || out.hidden || still()) { fin(); return; }
    out.classList.add("vf-out");
    setTimeout(fin, LEAVE);
  }
  window.VFMotion = { go: go, swap: swap };
})();
