/* Doggy, o cachorro — ilustração SVG (estilo "adesivo") com 8 poses.
   window.ViDog(pose)   poses: oi · au · busca · cats · acao · amor · tema · fim
   Cores do contorno vêm de CSS: --vi-ol (cor) e --vi-olw (espessura), para funcionar nos dois temas. */
(() => {
  const B = "#c47a30", D = "#8a4b17", W = "#fffaf0", K = "#2a1b12";
  const Y = "#f0b254", R = "#d94a5b", P = "#ef8f9a", M = "#6b1f2a";
  // olhos e boca desenhados em coordenadas-base e escalados para a cabeça grande
  const eyes = k => ({
    open:  `<circle cx="38" cy="38" r="3.8" fill="${K}"/><circle cx="62" cy="38" r="3.8" fill="${K}"/><circle cx="39.2" cy="36.7" r="1" fill="#fff"/><circle cx="63.2" cy="36.7" r="1" fill="#fff"/>`,
    left:  `<circle cx="35.5" cy="36" r="3.8" fill="${K}"/><circle cx="59.5" cy="36" r="3.8" fill="${K}"/><circle cx="36.5" cy="34.8" r="1" fill="#fff"/><circle cx="60.5" cy="34.8" r="1" fill="#fff"/>`,
    right: `<circle cx="40.5" cy="39" r="3.8" fill="${K}"/><circle cx="64.5" cy="39" r="3.8" fill="${K}"/><circle cx="41.5" cy="37.8" r="1" fill="#fff"/><circle cx="65.5" cy="37.8" r="1" fill="#fff"/>`,
    happy: `<path d="M32.5 40q5.5-8 11 0M56.5 40q5.5-8 11 0" fill="none" stroke="${K}" stroke-width="2.8" stroke-linecap="round"/>`,
    heart: `<path id="h" d="M38 43c-7-4.5-7-10.5-3-10.5 1.8 0 3 1.1 3 2.3 0-1.2 1.2-2.3 3-2.3 4 0 4 6-3 10.5z" fill="${R}"/><use href="#h" x="24"/>`,
    shades:`<rect x="30" y="32" width="17" height="11" rx="4.5" fill="#1b1b1b"/><rect x="53" y="32" width="17" height="11" rx="4.5" fill="#1b1b1b"/><path d="M47 36h6" stroke="#1b1b1b" stroke-width="2.2"/><path d="M34 35l4-1.5M57 35l4-1.5" stroke="#fff" stroke-opacity=".5" stroke-width="1.6" stroke-linecap="round"/>`
  })[k];
  const mouth = k => ({
    smile: `<path d="M42.5 57q7.5 6.5 15 0" fill="none" stroke="${K}" stroke-width="2.3" stroke-linecap="round"/>`,
    tongue:`<path d="M42 56q8 13 16 0z" fill="${M}"/><path d="M46.5 60q3.5 9 7 0z" fill="${P}"/>`,
    bark:  `<ellipse cx="50" cy="61" rx="6.5" ry="7.5" fill="${M}"/><ellipse cx="50" cy="65.5" rx="3.6" ry="2.6" fill="${P}"/>`
  })[k];
  const arm = (d, px, py, rot) => `<path class="olp" d="${d}" fill="none" stroke-width="15" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="${B}" stroke-width="10" stroke-linecap="round"/><ellipse class="ol" cx="${px}" cy="${py}" rx="6.5" ry="8" fill="${W}" stroke-width="2.4" transform="rotate(${rot} ${px} ${py})"/><path d="M${px - 2.2} ${py - 3}v4M${px + 2.2} ${py - 3}v4" stroke="${D}" stroke-width="1.2" stroke-linecap="round"/>`;
  const extra = pose => ({
    oi:    `<g class="wave">${arm("M76 88C86 84 88 72 87 60", 87, 53, 8)}</g>`,
    au:    `<path d="M82 30q7 7 0 14M89 25q12 12 0 24" fill="none" stroke="${Y}" stroke-width="3.2" stroke-linecap="round"/><path d="M14 34q-5 5 0 10" fill="none" stroke="${Y}" stroke-width="3" stroke-linecap="round"/>`,
    busca: arm("M74 90C68 84 68 76 71 69", 71, 66, -10) + `<circle cx="84" cy="52" r="11" fill="#fff" fill-opacity=".28" stroke="${K}" stroke-width="3.2"/><path d="M76.5 60L71 66" stroke="${K}" stroke-width="4.5" stroke-linecap="round"/><path d="M78 47q3-4 7-4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`,
    cats:  `<g class="bob"><circle cx="88" cy="22" r="6" fill="#7dd3c0"/><circle cx="96" cy="40" r="6" fill="#f4a3a3"/><circle cx="80" cy="38" r="6" fill="#a9b8ff"/></g>`,
    acao:  arm("M76 88C88 86 94 80 97 74", 98, 70, -40),
    amor:  `<g class="bob"><path d="M86 32c-9-6-9-14-4-14 2.3 0 4 1.5 4 3.2 0-1.7 1.7-3.2 4-3.2 5 0 5 8-4 14z" fill="${R}"/><path d="M14 22c-6-4-6-10-2.6-10 1.7 0 2.6 1 2.6 2.2 0-1.2.9-2.2 2.6-2.2 3.4 0 3.4 6-2.6 10z" fill="${R}" opacity=".8"/></g>`,
    tema:  `<g class="bob"><circle cx="88" cy="22" r="7" fill="${Y}"/><path d="M88 8v4M88 32v4M74 22h4M98 22h4M78 12l3 3M95 29l3 3M98 12l-3 3M81 29l-3 3" stroke="${Y}" stroke-width="2.4" stroke-linecap="round"/></g>`,
    fim:   arm("M24 88C14 84 12 72 13 60", 13, 53, -8) + arm("M76 88C86 84 88 72 87 60", 87, 53, 8) + `<g class="bob"><circle cx="20" cy="12" r="3" fill="#7dd3c0"/><circle cx="50" cy="4" r="3" fill="#f4a3a3"/><circle cx="82" cy="10" r="3" fill="#a9b8ff"/><rect x="92" y="22" width="6" height="6" rx="1" fill="${Y}" transform="rotate(20 95 25)"/><rect x="2" y="26" width="6" height="6" rx="1" fill="#7dd3c0" transform="rotate(-20 5 29)"/><path d="M34 8l2 4 4 .6-3 3 .8 4.2-3.8-2-3.8 2 .8-4.2-3-3 4-.6z" fill="${Y}"/></g>`
  })[pose];
  const POSES = { oi: ["open", "tongue"], au: ["open", "bark"], busca: ["left", "smile"], cats: ["open", "smile"], acao: ["right", "tongue"], amor: ["heart", "tongue"], tema: ["shades", "smile"], fim: ["happy", "tongue"] };

  window.ViDog = (pose = "oi") => {
    const [e, m] = POSES[pose] || POSES.oi;
    return `<svg class="dog" viewBox="-8 -8 116 116" data-pose="${pose}" aria-hidden="true" focusable="false">
      <path class="ol" d="M16 106c0-18 14-27 34-27s34 9 34 27z" fill="${W}" stroke-linejoin="round"/>
      <path class="ol" d="M22 24C6 26 2 58 16 70c11-4 17-24 15-46z" fill="${D}" stroke-linejoin="round"/><path class="ol" d="M78 24c16 2 20 34 6 46-11-4-17-24-15-46z" fill="${D}" stroke-linejoin="round"/>
      <ellipse class="ol" cx="50" cy="48" rx="35" ry="31" fill="${B}"/>
      <path d="M50 18c-5 10-8 24-13 38 4 14 22 14 26 0-5-14-8-28-13-38z" fill="${W}"/>
      <ellipse cx="26" cy="59" rx="5.2" ry="3.4" fill="${P}" opacity=".4"/><ellipse cx="74" cy="59" rx="5.2" ry="3.4" fill="${P}" opacity=".4"/>
      <ellipse cx="50" cy="55" rx="6.6" ry="4.7" fill="${K}"/><ellipse cx="48" cy="53.4" rx="2" ry="1.2" fill="#fff" fill-opacity=".5"/>
      <g transform="translate(50 46) scale(1.3) translate(-50 -38)">${eyes(e)}</g><g transform="translate(50 64) scale(1.1) translate(-50 -57)">${mouth(m)}</g>${extra(pose) || extra("oi")}</svg>`;
  };
})();
