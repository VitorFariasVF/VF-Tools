# Modelo de ferramenta — VF Tools

Ponto de partida para qualquer ferramenta nova seguir **o mesmo padrão visual e de uso** do site.
Regras completas em [`../DESIGN.md`](../DESIGN.md).

## Como usar
1. Copie esta pasta (`index.html` e `tool.js`) para o repositório da ferramenta.
2. Troque os caminhos relativos pelas URLs do site (depois que o Pages estiver ativo):
   ```html
   <link rel="stylesheet" href="https://vitorfariasvf.github.io/VF-Tools/tokens.css">
   <link rel="stylesheet" href="https://vitorfariasvf.github.io/VF-Tools/components.css">
   <link rel="stylesheet" href="https://vitorfariasvf.github.io/VF-Tools/doggy.css">
   <script>window.VF_BASE = "https://vitorfariasvf.github.io/VF-Tools/";</script>
   <script src="https://vitorfariasvf.github.io/VF-Tools/dog.js"></script>
   <script src="https://vitorfariasvf.github.io/VF-Tools/help.js"></script>
   ```
   O link "voltar" e o favicon também apontam para o site (`.../VF-Tools/` e `.../VF-Tools/assets/favicon.svg`).
3. Defina o id em `<html data-tool="meu-id">` e também na chave do script de tema (`vf-tools:meu-id:v1`).
4. Edite `<title>`, descrição, `<h1>` e o conteúdo de `<main>`. **Não remova**: skip link, botão de tema, rodapé com "Limpar meus dados".
5. Cadastre a ferramenta na vitrine (veja abaixo).

## O que já vem pronto
| Arquivo | Para quê |
|---|---|
| `../tokens.css` | Cores, fontes, espaços, raios, movimento. Escuro por padrão; claro com `data-theme="light"` |
| `../components.css` | Botões, chips, selos, formulários, cartões, grade, estados (vazio/erro/carregando), toast, rodapé |
| `../doggy.css` + `../dog.js` + `../help.js` | O mascote Doggy: botão "Ajuda", balão de boas-vindas e tour guiado com seta. Configure os passos em `window.VFTour` (3 a 6 passos) |
| `tool.js` | `VFTool.get/set/clear`, tema compartilhado com o site, `VFTool.toast()` |
| `../scripts/check-identity.js` | Verificador automático de identidade (veja abaixo) |

## Cadastrar na vitrine
No repositório `VF-Tools`, acrescente em `data/tools.js`:
```js
{ name: "Nome da Ferramenta", repo: "VitorFariasVF/nome-do-repo",
  description: "Uma frase, até 90 caracteres, terminando com ponto.",
  category: "utilidades",            // utilidades | casual | profissional
  tags: ["Web", "JavaScript"],       // 1 a 3, Capitalizadas
  status: "andamento",               // andamento -> ativo quando estiver pronta
  pages: "https://vitorfariasvf.github.io/nome-do-repo/" }
```
Só repositórios **públicos** entram na vitrine.

## Verificador de identidade
Rode antes de publicar (precisa só do Node, sem instalar nada):
```bash
node scripts/check-identity.js caminho/da/sua-ferramenta/index.html
```
Ele confere idioma, viewport, `tokens.css`/`components.css`, tema escuro por padrão, botão de tema, skip link, `<main>`/`<h1>`, favicon, cores e espaçamentos soltos, emojis, mais de um botão primário, imagens sem `alt`, campos sem rótulo e foco removido. `✗` é erro (bloqueia, sai com código 1); `!` é aviso. O modelo desta pasta passa sem nenhum aviso.

## Checklist antes de publicar
- [ ] `node scripts/check-identity.js` sem erros
- [ ] Usa `tokens.css` e `components.css` (sem cores, espaços ou raios soltos)
- [ ] Escuro por padrão e claro funcionando (teste os dois)
- [ ] Um único botão primário por tela
- [ ] Todo campo tem `<label>` visível; erro e dica em texto, não só em cor
- [ ] Estados vazio, erro e carregando desenhados
- [ ] Teclado completo, foco visível, alvos de toque ≥ 44px
- [ ] Sem rolagem lateral em 360px de largura
- [ ] Respeita `prefers-reduced-motion`
- [ ] Dados só em `localStorage` com chave `vf-tools:<id>:v1`, com `try/catch`, e botão "Limpar meus dados"
- [ ] Nada é enviado a servidores sem aviso claro
