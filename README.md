# VF Tools

🔗 **Acesse:** https://vitorfariasvf.github.io/VF-Tools/

Vitrine das minhas ferramentas, com busca e filtros por categoria, tecnologia e status.

## Adicionar uma ferramenta
Edite `data/tools.js` seguindo o **[DESIGN.md](DESIGN.md)** (padrão visual, campos e checklist).

Categorias: Utilidades · Casual · Profissional. Favoritos, recentes e preferências ficam no `localStorage` do navegador.

## Publicar
GitHub → Settings → Pages → Source: branch `main`, pasta `/ (root)`.

Site 100% estático (HTML/CSS/JS), sem build.

## Modelo para novas ferramentas
Pasta [`template/`](template/): página-modelo (com o Doggy), helper de armazenamento/tema e checklist. Estilos compartilhados em `tokens.css`, `components.css` e `doggy.css`. Para conferir se uma ferramenta segue a identidade: `node scripts/check-identity.js sua-ferramenta/index.html`.

## Repositórios públicos
A seção "Repositórios públicos" lista tudo o que está público no GitHub, com a linguagem de cada um e filtro por linguagem. Os dados vêm ao vivo da API do GitHub (cache de 1 h); se ela falhar, o site usa o retrato em `data/repos.js`. Lógica em `repos.js`.
