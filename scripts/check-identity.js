#!/usr/bin/env node
/* Verificador de identidade visual — VF Tools.
   Uso:  node scripts/check-identity.js caminho/index.html [outra.html ...]
   Lê o HTML (e os .css/.js locais referenciados) e aponta o que foge do padrão (DESIGN.md).
   Saída: ✓ ok · ✗ erro (bloqueia, código 1) · ! aviso. Sem dependências. */
const fs = require("fs"), path = require("path");
const files = process.argv.slice(2);
if (!files.length) { console.error("Uso: node scripts/check-identity.js <index.html> [...]"); process.exit(2); }
let errors = 0, warns = 0;
const out = (kind, msg) => { console.log(`  ${kind === "ok" ? "✓" : kind === "err" ? "✗" : "!"} ${msg}`); if (kind === "err") errors++; if (kind === "warn") warns++; };

for (const f of files) {
  console.log(`\n${f}`);
  const html = fs.readFileSync(f, "utf8"), dir = path.dirname(f);
  // junta CSS/JS locais (exceto os arquivos oficiais do site) para procurar cores soltas
  const local = [...html.matchAll(/(?:href|src)="([^"]+\.(?:css|js))"/g)].map(m => m[1])
    .filter(u => !/^https?:/.test(u) && !/(tokens|components|doggy|dog|help|tool)\.(css|js)$/.test(u))
    .map(u => path.join(dir, u)).filter(p => fs.existsSync(p));
  const own = html + "\n" + local.map(p => fs.readFileSync(p, "utf8")).join("\n");
  const ownNoComments = own.replace(/<!--[\s\S]*?-->/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
  const check = (cond, okMsg, errMsg, level = "err") => cond ? out("ok", okMsg) : out(level, errMsg);

  check(/<html[^>]*\blang="pt-BR"/.test(html), "idioma pt-BR", "falta <html lang=\"pt-BR\">");
  check(/name="viewport"/.test(html), "meta viewport", "falta <meta name=\"viewport\">");
  check(/tokens\.css/.test(html), "usa tokens.css", "não carrega tokens.css (cores, espaços e raios vêm de lá)");
  check(/components\.css/.test(html), "usa components.css", "não carrega components.css", "warn");
  check(/data-theme="dark"/.test(html), "escuro por padrão (data-theme=\"dark\")", "o <html> precisa de data-theme=\"dark\" (escuro é o padrão)");
  check(/id="theme"/.test(html), "botão de tema (#theme)", "falta o botão de tema com id=\"theme\"");
  check(/motion\.css/.test(html) && /motion\.js/.test(html), "movimento padrão (motion.css + motion.js)", "falta motion.css/motion.js (transições de 0,5 s do padrão)", "warn");
  check(/class="skip"/.test(html), "skip link", "falta o link \"Ir para o conteúdo\" (class=\"skip\")");
  check(/<main[\s>]/.test(html), "landmark <main>", "falta <main>");
  check(/<h1[\s>]/.test(html), "tem <h1>", "falta <h1>");
  check(/rel="icon"/.test(html), "favicon", "falta <link rel=\"icon\">", "warn");
  check(/data-tool="[^"]+"/.test(html), "data-tool definido", "falta data-tool=\"meu-id\" no <html>", "warn");
  check(/vf-tools:[a-z0-9-]+:v1/.test(own) || /tool\.js/.test(html), "armazenamento com chave vf-tools:<id>:v1", "use localStorage só pela chave vf-tools:<id>:v1 (veja template/tool.js)", "warn");
  check(/Limpar meus dados/i.test(html), "botão \"Limpar meus dados\"", "falta o botão \"Limpar meus dados\" no rodapé", "warn");

  // cores soltas (hex/rgb/hsl) fora dos tokens
  const colors = [...ownNoComments.matchAll(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/g)].map(m => m[0])
    .filter(c => !/^#[0-9a-fA-F]{3,8}$/.test(c) || /^#[0-9a-fA-F]{3}$|^#[0-9a-fA-F]{6}$|^#[0-9a-fA-F]{8}$/.test(c))
    .filter(c => !/^rgba?\(\s*0\s*,\s*0\s*,\s*0/.test(c));   // sombras pretas são permitidas
  const meta = [...html.matchAll(/<meta[^>]*theme-color[^>]*>/g)].length;   // theme-color é a exceção
  const real = colors.filter(c => !/^#(14110f|f7f1e7)$/i.test(c));
  check(real.length === 0, "sem cores soltas (só tokens)", `${real.length} cor(es) fora dos tokens: ${[...new Set(real)].slice(0, 5).join(", ")} — use var(--...)`, "warn");
  const px = [...ownNoComments.matchAll(/(?:margin|padding|gap)\s*:\s*[^;}]*\d+px/g)].length;
  check(px === 0, "espaçamentos pelos tokens", `${px} espaçamento(s) em px fixo — prefira var(--s1..--s8)`, "warn");
  const emoji = [...own.matchAll(/[\u{1F300}-\u{1FAFF}]/gu)].length;
  check(emoji === 0, "sem emojis (use SVG)", `${emoji} emoji(s) — o padrão usa ícones SVG`, "warn");
  const prim = [...html.matchAll(/class="[^"]*\bbtn\b[^"]*\bprimary\b[^"]*"/g)].length;
  check(prim <= 1, "no máximo um botão primário", `${prim} botões primários — use só um por tela`, "warn");
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].filter(m => !/\balt=/.test(m[0])).length;
  check(imgs === 0, "imagens com alt", `${imgs} <img> sem alt`);
  const inputs = [...html.matchAll(/<(?:input|select|textarea)\b[^>]*>/g)].map(m => m[0]).filter(t => !/type="(hidden|submit|button)"/.test(t));
  const wrapped = [...html.matchAll(/<label\b[^>]*>[\s\S]*?<\/label>/g)].map(m => m[0]).join("\n");   // campo dentro de <label> também é válido
  const unlabeled = inputs.filter(t => { if (wrapped.includes(t)) return false; const id = (t.match(/\bid="([^"]+)"/) || [])[1]; return !(id && new RegExp(`for="${id}"`).test(html)) && !/aria-label=/.test(t); }).length;
  check(unlabeled === 0, "campos com <label>", `${unlabeled} campo(s) sem <label for> ou aria-label`);
  check(!/outline\s*:\s*(none|0)\b/.test(ownNoComments) || /:focus-visible/.test(ownNoComments), "foco visível preservado", "outline removido sem :focus-visible", "warn");
}
console.log(`\n${errors ? "✗" : "✓"} ${errors} erro(s), ${warns} aviso(s)`);
process.exit(errors ? 1 : 0);
