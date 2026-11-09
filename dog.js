/* Doggy — a foto real do cachorro em círculo, com adesivos por pose.
   window.ViDog(pose)   poses: oi · au · busca · cats · acao · amor · tema · fim
   A foto fica em assets/doggy.jpg (em outras ferramentas, defina window.VF_BASE com a URL do site) (recorte 192×192 do rosto). Olhos em (37,25) e (66,25) no espaço do SVG. */
(() => {
  const RED = "#d94a5b", Y = "#f0b254", K = "#2a1b12", EL = [37, 25], ER = [66, 25];
  let uid = 0;   // ids únicos por instância: defs dentro de um SVG com display:none não funcionam em alguns navegadores
  const heart = (x, y, s, c = RED) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 5c-7-4.5-7-10.5-3-10.5 1.8 0 3 1.1 3 2.3 0-1.2 1.2-2.3 3-2.3 4 0 4 6-3 10.5z" fill="${c}"/>`;
  const badge = (x, y, inner) => `<g transform="translate(${x} ${y})"><circle r="11" fill="${Y}" stroke="#fff" stroke-width="2.5"/>${inner}</g>`;
  const paw = `<g fill="${K}"><ellipse cx="0" cy="3" rx="4.2" ry="3.4"/><circle cx="-5" cy="-1.5" r="1.8"/><circle cx="-1.8" cy="-5" r="1.8"/><circle cx="1.8" cy="-5" r="1.8"/><circle cx="5" cy="-1.5" r="1.8"/></g>`;
  const props = {
    oi:    `<g class="wave" style="transform-origin:86px 84px">${badge(86, 84, paw)}</g>`,
    au:    `<path d="M92 30q7 7 0 14M99 25q12 12 0 24" fill="none" stroke="${Y}" stroke-width="3.2" stroke-linecap="round"/><path d="M4 32q-5 5 0 10" fill="none" stroke="${Y}" stroke-width="3" stroke-linecap="round"/>` + badge(84, 84, `<text y="3.5" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="9" fill="${K}">AU!</text>`),
    busca: `<circle cx="${ER[0]}" cy="${ER[1] + 3}" r="14" fill="#fff" fill-opacity=".22" stroke="${K}" stroke-width="3.6"/><path d="M${ER[0] + 10} ${ER[1] + 13}l12 14" stroke="${K}" stroke-width="5.5" stroke-linecap="round"/><path d="M${ER[0] - 8} ${ER[1] - 3}q4-6 10-6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`,
    cats:  `<g class="bob"><circle cx="92" cy="16" r="6.5" fill="#7dd3c0" stroke="#fff" stroke-width="2"/><circle cx="100" cy="36" r="6.5" fill="#f4a3a3" stroke="#fff" stroke-width="2"/><circle cx="84" cy="32" r="6.5" fill="#a9b8ff" stroke="#fff" stroke-width="2"/></g>`,
    acao:  badge(86, 84, `<path d="M-5 0h10M1 -5l5 5-5 5" fill="none" stroke="${K}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`),
    amor:  `<g class="bob">${heart(EL[0], EL[1] - 2, 1.3)}${heart(ER[0], ER[1] - 2, 1.3)}${heart(92, 18, 1.4)}${heart(8, 14, 1, "#e87a8a")}</g>`,
    tema:  `<g><rect x="${EL[0] - 11}" y="${EL[1] - 6.5}" width="22" height="13" rx="5.5" fill="#1b1b1b" stroke="#fff" stroke-width=".8"/><rect x="${ER[0] - 11}" y="${ER[1] - 6.5}" width="22" height="13" rx="5.5" fill="#1b1b1b" stroke="#fff" stroke-width=".8"/><path d="M${EL[0] + 11} ${EL[1]}h${ER[0] - EL[0] - 22}" stroke="#1b1b1b" stroke-width="2.4"/><path d="M${EL[0] - 7} ${EL[1] - 2.5}l5-2M${ER[0] - 7} ${ER[1] - 2.5}l5-2" stroke="#fff" stroke-opacity=".55" stroke-width="1.8" stroke-linecap="round"/></g><g class="bob"><circle cx="92" cy="16" r="7.5" fill="${Y}"/><path d="M92 2v4M92 26v4M78 16h4M102 16h4M82 6l3 3M99 23l3 3M102 6l-3 3M85 23l-3 3" stroke="${Y}" stroke-width="2.4" stroke-linecap="round"/></g>`,
    fim:   `<path d="M38 12L52-14L66 12Z" fill="#a9b8ff" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><circle cx="52" cy="-15" r="4" fill="${Y}"/><path d="M42 6l24-2M45-2l17-1" stroke="#fff" stroke-width="1.6" opacity=".7"/><g class="bob"><circle cx="12" cy="16" r="3" fill="#7dd3c0"/><circle cx="92" cy="14" r="3" fill="#f4a3a3"/><rect x="94" y="40" width="6" height="6" rx="1" fill="${Y}" transform="rotate(20 97 43)"/><path d="M8 40l2 4 4 .6-3 3 .8 4.2-3.8-2-3.8 2 .8-4.2-3-3 4-.6z" fill="${Y}"/></g>`
  };
  window.ViDog = (pose = "oi") => {
    const id = ++uid;
    return `<svg class="dog" viewBox="-8 -8 116 116" data-pose="${pose}" aria-hidden="true" focusable="false">
      <defs><clipPath id="pc${id}"><circle cx="50" cy="50" r="46"/></clipPath><filter id="ps${id}" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="2" stdDeviation="2.2" flood-opacity=".4"/></filter></defs>
      <g filter="url(#ps${id})"><circle cx="50" cy="50" r="49.5" fill="#fff"/></g>
      <image href="${(window.VF_BASE || "")}assets/doggy.jpg" x="4" y="4" width="92" height="92" clip-path="url(#pc${id})" preserveAspectRatio="xMidYMid slice"/>${props[pose] || props.oi}</svg>`;
  };
})();
