/* Vi, o cachorro — ilustração SVG com poses e estilos.
   window.ViDog(pose, style)   poses: oi · au · busca · cats · acao · amor · tema · fim
   estilos: "a" clássico · "b" minimalista · "c" adesivo (kawaii). Padrão: window.ViStyle || "a". */
(() => {
  const Y = "#f0b254", R = "#d94a5b", P = "#ef8f9a", M = "#6b1f2a";
  const PAL = {
    a: { B: "#b8702a", D: "#8a4b17", W: "#fff6ea", K: "#2a1b12" },
    b: { B: "#c98a4b", D: "#9a5f2c", W: "#fff3df", K: "#33261b" },
    c: { B: "#c47a30", D: "#8a4b17", W: "#fffaf0", K: "#2a1b12" }
  };
  // olhos e boca são desenhados nas coordenadas do estilo A e depois transformados por estilo
  const eyes = (k, K) => ({
    open:  `<circle cx="38" cy="38" r="3.8" fill="${K}"/><circle cx="62" cy="38" r="3.8" fill="${K}"/><circle cx="39.3" cy="36.6" r="1.2" fill="#fff"/><circle cx="63.3" cy="36.6" r="1.2" fill="#fff"/>`,
    left:  `<circle cx="35.5" cy="36" r="3.8" fill="${K}"/><circle cx="59.5" cy="36" r="3.8" fill="${K}"/><circle cx="36.6" cy="34.7" r="1.2" fill="#fff"/><circle cx="60.6" cy="34.7" r="1.2" fill="#fff"/>`,
    right: `<circle cx="40.5" cy="39" r="3.8" fill="${K}"/><circle cx="64.5" cy="39" r="3.8" fill="${K}"/><circle cx="41.6" cy="37.7" r="1.2" fill="#fff"/><circle cx="65.6" cy="37.7" r="1.2" fill="#fff"/>`,
    happy: `<path d="M32.5 40q5.5-8 11 0M56.5 40q5.5-8 11 0" fill="none" stroke="${K}" stroke-width="2.8" stroke-linecap="round"/>`,
    heart: `<path id="h" d="M38 43c-7-4.5-7-10.5-3-10.5 1.8 0 3 1.1 3 2.3 0-1.2 1.2-2.3 3-2.3 4 0 4 6-3 10.5z" fill="${R}"/><use href="#h" x="24"/>`,
    shades:`<rect x="30" y="32" width="17" height="11" rx="4.5" fill="#1b1b1b"/><rect x="53" y="32" width="17" height="11" rx="4.5" fill="#1b1b1b"/><path d="M47 36h6" stroke="#1b1b1b" stroke-width="2.2"/><path d="M34 35l4-1.5M57 35l4-1.5" stroke="#fff" stroke-opacity=".5" stroke-width="1.6" stroke-linecap="round"/>`
  })[k];
  const mouth = (k, K) => ({
    smile: `<path d="M42.5 57q7.5 6.5 15 0" fill="none" stroke="${K}" stroke-width="2.3" stroke-linecap="round"/>`,
    tongue:`<path d="M42 56q8 13 16 0z" fill="${M}"/><path d="M46.5 60q3.5 9 7 0z" fill="${P}"/>`,
    bark:  `<ellipse cx="50" cy="61" rx="6.5" ry="7.5" fill="${M}"/><ellipse cx="50" cy="65.5" rx="3.6" ry="2.6" fill="${P}"/>`
  })[k];
  const arm = (d, px, py, rot, c, outline) => (outline ? `<path d="${d}" fill="none" stroke="${c.K}" stroke-width="15" stroke-linecap="round"/>` : "") +
    `<path d="${d}" fill="none" stroke="${c.B}" stroke-width="10" stroke-linecap="round"/><ellipse cx="${px}" cy="${py}" rx="6.5" ry="8" fill="${c.W}" stroke="${outline ? c.K : c.D}" stroke-width="${outline ? 2.6 : 1.6}" transform="rotate(${rot} ${px} ${py})"/><path d="M${px - 2.2} ${py - 3}v4M${px + 2.2} ${py - 3}v4" stroke="${c.D}" stroke-width="1.2" stroke-linecap="round"/>`;
  const extra = (pose, c, o) => ({
    oi:    `<g class="wave">${arm("M76 88C86 84 88 72 87 60", 87, 53, 8, c, o)}</g>`,
    au:    `<path d="M82 30q7 7 0 14M89 25q12 12 0 24" fill="none" stroke="${Y}" stroke-width="3.2" stroke-linecap="round"/><path d="M14 34q-5 5 0 10" fill="none" stroke="${Y}" stroke-width="3" stroke-linecap="round"/>`,
    busca: arm("M74 90C68 84 68 76 71 69", 71, 66, -10, c, o) + `<circle cx="84" cy="52" r="11" fill="#fff" fill-opacity=".28" stroke="${c.K}" stroke-width="3.2"/><path d="M76.5 60L71 66" stroke="${c.K}" stroke-width="4.5" stroke-linecap="round"/><path d="M78 47q3-4 7-4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`,
    cats:  `<g class="bob"><circle cx="88" cy="22" r="6" fill="#7dd3c0"/><circle cx="96" cy="40" r="6" fill="#f4a3a3"/><circle cx="80" cy="38" r="6" fill="#a9b8ff"/></g>`,
    acao:  arm("M76 88C88 86 94 80 97 74", 98, 70, -40, c, o),
    amor:  `<g class="bob"><path d="M86 32c-9-6-9-14-4-14 2.3 0 4 1.5 4 3.2 0-1.7 1.7-3.2 4-3.2 5 0 5 8-4 14z" fill="${R}"/><path d="M14 22c-6-4-6-10-2.6-10 1.7 0 2.6 1 2.6 2.2 0-1.2.9-2.2 2.6-2.2 3.4 0 3.4 6-2.6 10z" fill="${R}" opacity=".8"/></g>`,
    tema:  `<g class="bob"><circle cx="88" cy="22" r="7" fill="${Y}"/><path d="M88 8v4M88 32v4M74 22h4M98 22h4M78 12l3 3M95 29l3 3M98 12l-3 3M81 29l-3 3" stroke="${Y}" stroke-width="2.4" stroke-linecap="round"/></g>`,
    fim:   arm("M24 88C14 84 12 72 13 60", 13, 53, -8, c, o) + arm("M76 88C86 84 88 72 87 60", 87, 53, 8, c, o) + `<g class="bob"><circle cx="20" cy="12" r="3" fill="#7dd3c0"/><circle cx="50" cy="4" r="3" fill="#f4a3a3"/><circle cx="82" cy="10" r="3" fill="#a9b8ff"/><rect x="92" y="22" width="6" height="6" rx="1" fill="${Y}" transform="rotate(20 95 25)"/><rect x="2" y="26" width="6" height="6" rx="1" fill="#7dd3c0" transform="rotate(-20 5 29)"/><path d="M34 8l2 4 4 .6-3 3 .8 4.2-3.8-2-3.8 2 .8-4.2-3-3 4-.6z" fill="${Y}"/></g>`
  })[pose];
  const POSES = { oi: ["open", "tongue"], au: ["open", "bark"], busca: ["left", "smile"], cats: ["open", "smile"], acao: ["right", "tongue"], amor: ["heart", "tongue"], tema: ["shades", "smile"], fim: ["happy", "tongue"] };

  // cabeça/corpo por estilo
  const HEAD = {
    a: c => `<defs><clipPath id="vc"><circle cx="50" cy="50" r="50"/></clipPath></defs><circle class="tile" cx="50" cy="50" r="50"/>
      <g clip-path="url(#vc)"><path d="M14 104C16 82 32 73 50 73s34 9 36 31z" fill="${c.W}"/><path d="M14 104c1-12 5-20 12-26l8 26zM86 104c-1-12-5-20-12-26l-8 26z" fill="${c.B}"/></g>
      <path d="M25 22C9 24 5 54 17 64c10-2 14-20 13-42z" fill="${c.D}"/><path d="M75 22c16 2 20 32 8 42-10-2-14-20-13-42z" fill="${c.D}"/>
      <ellipse cx="50" cy="42" rx="27.5" ry="25.5" fill="${c.B}"/>
      <path d="M50 17c-5 9-7 21-11.5 34 3 12.5 20 12.5 23 0C57 38 55 26 50 17z" fill="${c.W}"/>
      <ellipse cx="50" cy="49" rx="5.8" ry="4.2" fill="${c.K}"/><ellipse cx="48.2" cy="47.6" rx="1.6" ry="1" fill="#fff" fill-opacity=".5"/><path d="M50 53v3.5" stroke="${c.K}" stroke-width="2" stroke-linecap="round"/>`,
    // B: minimalista — formas chapadas, sem contorno, sem fundo
    b: c => `<path d="M18 104c0-20 14-30 32-30s32 10 32 30z" fill="${c.W}"/>
      <path d="M27 20c-11 0-14 24-8 36 8-2 14-14 14-30 0-4-2-6-6-6z" fill="${c.D}"/><path d="M73 20c11 0 14 24 8 36-8-2-14-14-14-30 0-4 2-6 6-6z" fill="${c.D}"/>
      <circle cx="50" cy="44" r="27" fill="${c.B}"/>
      <rect x="45" y="19" width="10" height="26" rx="5" fill="${c.W}"/><circle cx="50" cy="54" r="12.5" fill="${c.W}"/>
      <ellipse cx="50" cy="49.5" rx="4.8" ry="3.4" fill="${c.K}"/>`,
    // C: adesivo — cabeça enorme, contorno grosso, bochechas
    c: c => `<path d="M16 106c0-18 14-27 34-27s34 9 34 27z" fill="${c.W}" stroke="${c.K}" stroke-width="3.6" stroke-linejoin="round"/>
      <path d="M22 24C6 26 2 58 16 70c11-4 17-24 15-46z" fill="${c.D}" stroke="${c.K}" stroke-width="3.6" stroke-linejoin="round"/><path d="M78 24c16 2 20 34 6 46-11-4-17-24-15-46z" fill="${c.D}" stroke="${c.K}" stroke-width="3.6" stroke-linejoin="round"/>
      <ellipse cx="50" cy="48" rx="35" ry="31" fill="${c.B}" stroke="${c.K}" stroke-width="3.6"/>
      <path d="M50 18c-5 10-8 24-13 38 4 14 22 14 26 0-5-14-8-28-13-38z" fill="${c.W}"/>
      <ellipse cx="25" cy="58" rx="6.5" ry="4.2" fill="${P}" opacity=".75"/><ellipse cx="75" cy="58" rx="6.5" ry="4.2" fill="${P}" opacity=".75"/>
      <ellipse cx="50" cy="55" rx="6.6" ry="4.7" fill="${c.K}"/><ellipse cx="48" cy="53.4" rx="2" ry="1.2" fill="#fff" fill-opacity=".6"/>`
  };
  // transformações dos olhos/boca por estilo (uniformes, a partir das coordenadas de A)
  const T = {
    a: { e: "", m: "" },
    b: { e: "translate(50 41) scale(.82) translate(-50 -38)", m: "translate(50 59.5) scale(.85) translate(-50 -57)" },
    c: { e: "translate(50 46) scale(1.42) translate(-50 -38)", m: "translate(50 64) scale(1.1) translate(-50 -57)" }
  };
  window.ViDog = (pose = "oi", style) => {
    style = style || window.ViStyle || "a";
    const c = PAL[style] || PAL.a, [e, m] = POSES[pose] || POSES.oi, t = T[style] || T.a;
    const vb = style === "a" ? "-8 -8 116 116" : "-8 -8 116 116";
    return `<svg class="dog" viewBox="${vb}" data-pose="${pose}" data-style="${style}" aria-hidden="true" focusable="false">
      ${(HEAD[style] || HEAD.a)(c)}
      <g transform="${t.e}">${eyes(e, c.K)}</g><g transform="${t.m}">${mouth(m, c.K)}</g>${extra(pose, c, style === "c") || extra("oi", c, style === "c")}</svg>`;
  };
})();
