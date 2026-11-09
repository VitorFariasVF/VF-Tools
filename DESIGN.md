# Padrão de design — VF Tools (identidade Editorial)

> **Criando uma ferramenta nova?** Comece pelo modelo em [`template/`](template/) (HTML pronto + `tool.js`) e use [`components.css`](components.css) e [`tokens.css`](tokens.css). O checklist está em [`template/README.md`](template/README.md). Para conferir automaticamente: `node scripts/check-identity.js sua-ferramenta/index.html`.

Toda ferramenta nova (card no site **e** o app em si) segue estas regras para manter um visual único.

## 1. Adicionar uma ferramenta ao site
Acrescente um objeto em `data/tools.js`. Campos:

| Campo | Regra |
|---|---|
| `name` | Até 35 caracteres, sem emoji, sem "Tool"/"App" no fim |
| `repo` | `Dono/repositório` (vira o ID e o link do GitHub) |
| `description` | **1 frase, até 90 caracteres**, começa com verbo ou substantivo, termina com ponto |
| `category` | `utilidades` (helpers do dia a dia) · `casual` (jogos, mesas, diversão) · `profissional` (trabalho, produtividade, IA) |
| `tags` | 1–3 tags, Capitalizadas, tecnologia ou tema (`Web`, `Bot`, `IA`). Reutilize as existentes antes de criar outra |
| `status` | `ativo` · `andamento` (trabalho em andamento) · `beta` (instável) · `arquivado` (sem manutenção) |
| `pages` | Link do GitHub Pages (`https://vitorfariasvf.github.io/<repo>/`). Fica salvo mesmo em `andamento`; o botão "Abrir" só aparece em `ativo`/`beta` |
| `disabled` | Opcional. `disabled: true` tira a ferramenta da vitrine sem apagar a entrada (para reativar, remova a linha) |

**Regra de visibilidade:** só repositórios **públicos** entram na vitrine.

Nova categoria? Adicione em `window.CATEGORIES` (label, desc, ícone) e uma cor `--c-<nome>` em `tokens.css`.

## 1b. Identidade
Estilo **Editorial**: fundo quente escuro, títulos em serifa (`--font-display`) com ênfase em itálico âmbar (`<em>` com `--accent`), corpo em sans. Cada ferramenta é uma **linha numerada** (01, 02…) com meta → título → descrição → tags à esquerda e ações à direita. O âmbar é reservado ao botão principal e ao destaque do título; as cores de categoria aparecem só no ícone e no rótulo. Sem emojis: ícones SVG de traço (1.8px, `currentColor`).

**Mascote Doggy:** a foto real do cachorro do autor (`assets/doggy.jpg`) em círculo com borda branca, mais um adesivo por pose (`dog.js`): `oi`, `au`, `busca`, `cats`, `acao`, `amor`, `tema`, `fim`. Um passo do tour = uma pose. O botão sempre mostra o rótulo "Ajuda"; animações repetem no máximo 3 vezes e respeitam `prefers-reduced-motion`.

## 2. Tokens (`tokens.css`)
Nunca use cor, espaçamento ou raio "solto". Em qualquer ferramenta:
```html
<link rel="stylesheet" href="https://vitorfariasvf.github.io/VF-Tools/tokens.css">
```
- **Cores:** `--bg`, `--surface`, `--text`, `--muted`, `--line`, `--accent`, `--ok/--warn/--danger`. Cor da categoria: `--c-utilidades`, `--c-casual`, `--c-profissional`.
- **Espaço:** escala 4/8/12/16/24/32/48/80 (`--s1`…`--s8`).
- **Raios:** `--r-sm` 8, `--r-md` 12 (botões/inputs), `--r-lg` 16 (cards), `--r-pill`.
- **Fonte:** `--font` (Inter → system-ui). Título 1.05–1.25rem peso 600/700, corpo 16px, apoio .85–.92rem.
- **Movimento:** `--ease` + `--dur` (.2s). Animações só de `opacity`/`transform`.

## 3. Princípios de UI/UX
1. **Uma ação primária por tela** (botão `--accent` preenchido); as demais são secundárias (contorno).
2. **Escuro é o padrão; claro é opcional** (`data-theme="light"`). Teste os dois; nunca fixe `#fff`/`#000`.
3. **Contraste mínimo 4.5:1** para texto; cor nunca é o único indicador (status sempre tem texto).
4. **Alvos de toque ≥ 40px.** Mobile primeiro (breakpoint 640px: 1 coluna, filtros em faixa rolável, inputs 16px); sem rolagem horizontal da página; gutter lateral de 16px.
5. **Foco visível** (`:focus-visible`) e navegação completa por teclado; `aria-label` em botões de ícone.
6. **Respeite `prefers-reduced-motion`** (tokens já zeram `--dur`).
7. **Estados sempre desenhados:** vazio, carregando, erro, sucesso. Mensagens curtas, em português, dizendo o que fazer.
8. **Hierarquia:** título → descrição (cinza) → metadados. No máximo 3 níveis por card.
9. **Sem surpresa:** ações destrutivas pedem confirmação; nada é enviado a servidores sem aviso.

## 4. Persistência local (Web Storage)
O site guarda tudo em `localStorage` na chave **`vf-tools:v1`**:
```json
{ "theme": "", "favorites": ["id"], "recent": [{"id":"…","ts":0}], "uses": {"id": 3},
  "filters": {"cat":"","tag":"","status":"","sort":"name"} }
```
- `id` = nome do repositório em minúsculas.
- Os dados nunca saem do navegador; "Apagar dados locais" (rodapé) limpa tudo.
- Sempre `try/catch` em leitura/escrita (modo privado pode bloquear).
- Ferramentas individuais devem usar sua **própria** chave `vf-tools:<id>:v1` e nunca alterar a do site. Mudou o formato? Suba a versão (`v2`).

## 5. Checklist antes de publicar
- [ ] Card preenchido conforme a tabela da seção 1
- [ ] Testado em claro/escuro e 360px de largura
- [ ] Só tokens, sem cores soltas
- [ ] Foco/teclado e contraste verificados
- [ ] Estados vazio/erro tratados
