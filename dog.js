/* Vi, o cachorro — ilustração em SVG com poses (window.ViDog(pose)).
   Poses: oi · au · busca · cats · acao · amor · tema · fim */
(() => {
  const B = "#b8702a", D = "#8a4b17", W = "#fff6ea", K = "#2a1b12", P = "#ef8f9a", R = "#d94a5b", M = "#6b1f2a", Y = "#f0b254";
  const eyes = {
    open:  `<circle cx="38" cy="38" r="3.8" fill="${K}"/><circle cx="62" cy="38" r="3.8" fill="${K}"/><circle cx="39.3" cy="36.6" r="1.2" fill="#fff"/><circle cx="63.3" cy="36.6" r="1.2" fill="#fff"/>`,
    left:  `<circle cx="35.5" cy="36" r="3.8" fill="${K}"/><circle cx="59.5" cy="36" r="3.8" fill="${K}"/><circle cx="36.6" cy="34.7" r="1.2" fill="#fff"/><circle cx="60.6" cy="34.7" r="1.2" fill="#fff"/>`,
    right: `<circle cx="40.5" cy="39" r="3.8" fill="${K}"/><circle cx="64.5" cy="39" r="3.8" fill="${K}"/><circle cx="41.6" cy="37.7" r="1.2" fill="#fff"/><circle cx="65.6" cy="37.7" r="1.2" fill="#fff"/>`,
    happy: `<path d="M32.5 40q5.5-8 11 0M56.5 40q5.5-8 11 0" fill="none" stroke="${K}" stroke-width="2.8" stroke-linecap="round"/>`,
    heart: `<path id="h" d="M38 43c-7-4.5-7-10.5-3-10.5 1.8 0 3 1.1 3 2.3 0-1.2 1.2-2.3 3-2.3 4 0 4 6-3 10.5z" fill="${R}"/><use href="#h" x="24"/>`,
    shades:`<rect x="30" y="32" width="17" height="11" rx="4.5" fill="#1b1b1b"/><rect x="53" y="32" width="17" height="11" rx="4.5" fill="#1b1b1b"/><path d="M47 36h6" stroke="#1b1b1b" stroke-width="2.2"/><path d="M34 35l4-1.5M57 35l4-1.5" stroke="#fff" stroke-opacity=".5" stroke-width="1.6" stroke-linecap="round"/>`
  };
  const mouth = {
    smile: `<path d="M42.5 57q7.5 6.5 15 0" fill="none" stroke="${K}" stroke-width="2.3" stroke-linecap="round"/>`,
    tongue:`<path d="M42 56q8 13 16 0z" fill="${M}"/><path d="M46.5 60q3.5 9 7 0z" fill="${P}"/>`,
    bark:  `<ellipse cx="50" cy="61" rx="6.5" ry="7.5" fill="${M}"/><ellipse cx="50" cy="65.5" rx="3.6" ry="2.6" fill="${P}"/>`
  };
  const arm = (d, px, py, rot = 0) => `<path d="${d}" fill="none" stroke="${B}" stroke-width="10" stroke-linecap="round"/><ellipse cx="${px}" cy="${py}" rx="6.5" ry="8" fill="${W}" stroke="${D}" stroke-width="1.6" transform="rotate(${rot} ${px} ${py})"/><path d="M${px - 2.2} ${py - 3}v4M${px + 2.2} ${py - 3}v4" stroke="${D}" stroke-width="1.2" stroke-linecap="round"/>`;
  const extra = {
    oi:    `<g class="wave">${arm("M76 88C86 84 88 72 87 60", 87, 53, 8)}</g>`,
    au:    `<path d="M82 30q7 7 0 14M89 25q12 12 0 24" fill="none" stroke="${Y}" stroke-width="3.2" stroke-linecap="round"/><path d="M14 34q-5 5 0 10" fill="none" stroke="${Y}" stroke-width="3" stroke-linecap="round"/>`,
    busca: arm("M74 90C68 84 68 76 71 69", 71, 66, -10) + `<circle cx="84" cy="52" r="11" fill="#fff" fill-opacity=".28" stroke="${K}" stroke-width="3.2"/><path d="M76.5 60L71 66" stroke="${K}" stroke-width="4.5" stroke-linecap="round"/><path d="M78 47q3-4 7-4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`,
    cats:  `<g class="bob"><circle cx="88" cy="22" r="6" fill="#7dd3c0"/><circle cx="96" cy="40" r="6" fill="#f4a3a3"/><circle cx="80" cy="38" r="6" fill="#a9b8ff"/></g>`,
    acao:  arm("M76 88C88 86 94 80 97 74", 98, 70, -40) + `<path d="M93 56l10-4M93 50l10-8" stroke="${Y}" stroke-width="0" />`,
    amor:  `<g class="bob"><path d="M86 32c-9-6-9-14-4-14 2.3 0 4 1.5 4 3.2 0-1.7 1.7-3.2 4-3.2 5 0 5 8-4 14z" fill="${R}"/><path d="M14 22c-6-4-6-10-2.6-10 1.7 0 2.6 1 2.6 2.2 0-1.200.9-2.200 2.600-2.200 3.400 0 3.400 6-2.600 10z" fill="${R}" opacity=".8"/></g>`,
    tema:  `<g class="bob"><circle cx="88" cy="22" r="7" fill="${Y}"/><path d="M88 8v4M88 32v4M74 22h4M98 22h4M78 12l3 3M95 29l3 3M98 12l-3 3M81 29l-3 3" stroke="${Y}" stroke-width="2.4" stroke-linecap="round"/></g>`,
    fim:   arm("M24 88C14 84 12 72 13 60", 13, 53, -8) + arm("M76 88C86 84 88 72 87 60", 87, 53, 8) + `<g class="bob"><circle cx="20" cy="12" r="3" fill="#7dd3c0"/><circle cx="50" cy="4" r="3" fill="#f4a3a3"/><circle cx="82" cy="10" r="3" fill="#a9b8ff"/><rect x="92" y="22" width="6" height="6" rx="1" fill="${Y}" transform="rotate(20 95 25)"/><rect x="2" y="26" width="6" height="6" rx="1" fill="#7dd3c0" transform="rotate(-20 5 29)"/><path d="M34 8l2 4 4 .6-3 3 .8 4.200-3.800-2-3.800 2 .8-4.200-3-3 4-.6z" fill="${Y}"/></g>`
  };
  const POSES = {
    oi:    ["open", "tongue"], au: ["open", "bark"], busca: ["left", "smile"], cats: ["open", "smile"],
    acao:  ["right", "tongue"], amor: ["heart", "tongue"], tema: ["shades", "smile"], fim: ["happy", "tongue"]
  };
  window.ViDog = (pose = "oi") => {
    const [e, m] = POSES[pose] || POSES.oi;
    return `<svg class="dog" viewBox="-8 -8 116 116" data-pose="${pose}" aria-hidden="true" focusable="false">
      <defs><clipPath id="vc"><circle cx="50" cy="50" r="50"/></clipPath></defs>
      <circle class="tile" cx="50" cy="50" r="50"/>
      <g clip-path="url(#vc)"><path d="M14 104C16 82 32 73 50 73s34 9 36 31z" fill="${W}"/><path d="M14 104c1-12 5-20 12-26l8 26zM86 104c-1-12-5-20-12-26l-8 26z" fill="${B}"/></g>
      <path d="M25 22C9 24 5 54 17 64c10-2 14-20 13-42z" fill="${D}"/><path d="M75 22c16 2 20 32 8 42-10-2-14-20-13-42z" fill="${D}"/>
      <ellipse cx="50" cy="42" rx="27.5" ry="25.5" fill="${B}"/>
      <path d="M50 17c-5 9-7 21-11.500 34 3 12.500 20 12.500 23 0C57 38 55 26 50 17z" fill="${W}"/>
      <ellipse cx="50" cy="49" rx="5.800" ry="4.200" fill="${K}"/><ellipse cx="48.200" cy="47.600" rx="1.600" ry="1" fill="#fff" fill-opacity=".5"/><path d="M50 53v3.500" stroke="${K}" stroke-width="2" stroke-linecap="round"/>
      ${eyes[e]}${mouth[m]}${extra[pose] || extra.oi}</svg>`;
  };
})();
