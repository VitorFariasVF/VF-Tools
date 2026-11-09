// Fonte única das ferramentas. Regras em DESIGN.md.
// category: "utilidades" | "casual" | "profissional"
// status:   "ativo" | "andamento" (trabalho em andamento) | "beta" | "arquivado"
// Só repositórios PÚBLICOS entram aqui. `pages` guarda o link do GitHub Pages;
// com status "andamento" o botão "Abrir" fica oculto até virar "ativo".
// `disabled: true` tira a ferramenta da vitrine sem apagar (para reativar, remova a linha).
window.CATEGORIES = {
  utilidades:   { label: "Utilidades",   desc: "Pequenos helpers do dia a dia", icon: "⚙" },
  casual:       { label: "Casual",       desc: "Jogos, mesas e diversão",       icon: "🎲" },
  profissional: { label: "Profissional", desc: "Trabalho, produtividade e IA",  icon: "💼" }
};
window.TOOLS = [
  { name: "Cronômetro", repo: "VitorFariasVF/cronometro-github-pages",
    description: "Cronômetro simples e rápido, direto no navegador.",
    category: "utilidades", tags: ["Web", "JavaScript"], status: "ativo",
    pages: "https://vitorfariasvf.github.io/cronometro-github-pages/",
    disabled: true },   // desativado: não é um site
  { name: "Mesa de PDF", repo: "VitorFariasVF/mesa-de-pdf",
    description: "Junte, separe e organize PDFs e converta fotos em PDF, tudo no navegador.",
    category: "utilidades", tags: ["PDF", "Web"], status: "ativo",
    pages: "https://vitorfariasvf.github.io/mesa-de-pdf/" },
  { name: "Relatório Fácil", repo: "VitorFariasVF/relatorio-facil",
    description: "Transforme uma planilha em relatório com gráficos, pronto para PDF ou HTML, no navegador.",
    category: "profissional", tags: ["Relatórios", "Web"], status: "ativo",
    pages: "https://vitorfariasvf.github.io/relatorio-facil/" },
  { name: "Backup & Editor de Save — R.E.P.O", repo: "VitorFariasVF/Ferramenta-de-backup-e-editor-de-save-r.e.p.o",
    description: "Faça backup e edite os saves do jogo R.E.P.O com segurança.",
    category: "utilidades", tags: ["Saves", "Desktop"], status: "andamento",
    pages: "https://vitorfariasvf.github.io/Ferramenta-de-backup-e-editor-de-save-r.e.p.o/" },
  { name: "D&D 5e Builder", repo: "VitorFariasVF/dnd5e-builder",
    description: "Monte fichas de personagem de D&D 5e com escolhas guiadas.",
    category: "casual", tags: ["D&D", "Web"], status: "andamento",
    pages: "https://vitorfariasvf.github.io/dnd5e-builder/" }
];
