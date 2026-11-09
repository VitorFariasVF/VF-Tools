// Fonte única das ferramentas. Regras em DESIGN.md.
// category: "utilidades" | "casual" | "profissional"
// status:   "ativo" | "beta" | "arquivado"
window.CATEGORIES = {
  utilidades:   { label: "Utilidades",   desc: "Pequenos helpers do dia a dia", icon: "⚙" },
  casual:       { label: "Casual",       desc: "Jogos, mesas e diversão",       icon: "🎲" },
  profissional: { label: "Profissional", desc: "Trabalho, produtividade e IA",  icon: "💼" }
};
window.TOOLS = [
  { name: "Cronômetro", repo: "VitorFariasVF/cronometro-github-pages",
    description: "Cronômetro simples e rápido, direto no navegador.",
    category: "utilidades", tags: ["Web", "JavaScript"], status: "ativo",
    demo: "https://vitorfariasvf.github.io/cronometro-github-pages/" },
  { name: "Backup & Editor de Save — R.E.P.O", repo: "VitorFariasVF/Ferramenta-de-backup-e-editor-de-save-r.e.p.o",
    description: "Faça backup e edite os saves do jogo R.E.P.O com segurança.",
    category: "utilidades", tags: ["Saves", "Desktop"], status: "ativo" },
  { name: "Riot ID Changer (LCU)", repo: "VitorFariasVF/Riot-ID-Changer--LCU-",
    description: "Gerencie o Riot ID conversando com o cliente do LoL (LCU).",
    category: "utilidades", tags: ["LCU", "Desktop"], status: "beta" },
  { name: "D&D 5e Builder", repo: "VitorFariasVF/dnd5e-builder",
    description: "Monte fichas de personagem de D&D 5e com escolhas guiadas.",
    category: "casual", tags: ["D&D", "Web"], status: "ativo" },
  { name: "Ceguituz Bot", repo: "VitorFariasVF/Ceguituz-bot-DD",
    description: "Bot para mesas de D&D: rolagens e tarefas do mestre.",
    category: "casual", tags: ["Bot", "D&D"], status: "ativo" },
  { name: "Kanban FZ", repo: "VitorFariasVF/Kanban-FZ",
    description: "Quadro Kanban para organizar tarefas e fluxos de trabalho.",
    category: "profissional", tags: ["Kanban", "Web"], status: "ativo" },
  { name: "System Orbit Skills", repo: "VitorFariasVF/sos-system-orbit-skills",
    description: "Coleção de skills para estender agentes de IA.",
    category: "profissional", tags: ["IA", "Agentes"], status: "ativo" },
  { name: "Rise Mode Plugins", repo: "VitorFariasVF/rise-mode-plugins",
    description: "Plugins para turbinar fluxos de trabalho com IA.",
    category: "profissional", tags: ["IA", "Plugins"], status: "beta" }
];
