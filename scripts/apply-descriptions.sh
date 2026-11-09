#!/usr/bin/env bash
# Aplica as descrições (campo "About") nos repositórios públicos de VitorFariasVF.
# Requer o GitHub CLI (https://cli.github.com) já autenticado: gh auth login
#
# Uso:   bash scripts/apply-descriptions.sh          (só mostra o que faria)
#        APPLY=1 bash scripts/apply-descriptions.sh  (aplica de verdade)
set -u
OWNER=VitorFariasVF
run() { if [ "${APPLY:-0}" = 1 ]; then gh repo edit "$OWNER/$1" --description "$2" && echo "ok  $1"; else echo "gh repo edit $OWNER/$1 --description "$2""; fi; }
run 'VF-Tools' 'Vitrine das minhas ferramentas open source, com padrão visual e modelo para novas ferramentas.'
run 'cronometro-github-pages' 'Cronômetro simples e rápido, publicado com GitHub Pages.'
run 'dnd5e-builder' 'Montador de fichas de personagem de D&D 5e, com escolhas guiadas.'
run 'Ferramenta-de-backup-e-editor-de-save-r.e.p.o' 'Faz backup e edita os saves do jogo R.E.P.O.'
run 'SIte-FZ-piloto' 'Piloto do site do projeto FZ.'
run 'typescript-curso-1' 'Exercícios do primeiro curso de TypeScript.'
run 'javascript-avancado-i-projetoCompleto' 'Projeto completo do curso JavaScript Avançado I.'
run 'compass-front-challenge-keepAlive-04' 'Desafio front-end do Compass: Keep Alive (desafio 04).'
run 'introducao-javascript' 'Primeiros exercícios da introdução ao JavaScript.'
run 'JavaScript-explorando-a-linguagem' 'Exercícios do curso JavaScript: explorando a linguagem.'
run 'compass-front-challenge-planejamento-semana' 'Desafio front-end do Compass: planejamento da semana.'
run 'Javascript-HTML-pratique-l-gica-com-desenhos-anima--es-e-um-jogo' 'Curso de JavaScript e HTML: lógica com desenhos, animações e um jogo.'
run 'Javascript-HTML-desenvolva-um-jogo-e-pratique-l-gica-de-programa--o-Basic-javascript-exercises' 'Curso de JavaScript e HTML: desenvolva um jogo e pratique lógica de programação.'
run 'Pagina--Frut--Bootstrap-4-criando-uma-landing-page-responsiva' 'Landing page responsiva da Frut, feita com Bootstrap 4.'
run 'compass-font-challenge-Folio-Agency' 'Desafio front-end do Compass: página da agência Folio.'
run 'Apeperia-ALURA-Layouts-Responsivos-trabalhando-com-layouts-mobile' 'Curso da Alura sobre layouts responsivos, com o projeto Apeperia.'
run 'Alura-Books-HTML-CSS-responsividade-com-mobile-first' 'Curso da Alura: HTML e CSS com responsividade mobile first (Alura Books).'
run 'HTML-CSS-ALURA-' 'Exercícios do curso de HTML e CSS da Alura (página da barbearia).'
run 'Flexbox-posicione-elementos-na-tela' 'Curso de Flexbox: posicione elementos na tela.'
run 'flex-e-grid-main' 'Exercícios de Flexbox e Grid em CSS.'
run 'compass-front-challenge-onboarding-01' 'Desafio front-end do Compass: onboarding (desafio 01).'
run 'HTML5-e-CSS3-Web-Page-Barbearia-Alura' 'Página de barbearia em HTML5 e CSS3, do curso da Alura.'
run 'tabuleiro' 'Exercício de tabuleiro em CSS.'
run 'Curso-exercicios-nextjs' 'Exercícios do curso de Next.js.'
run 'crud-angular-srping' 'CRUD com Angular no front-end e Spring no back-end.'
run 'crud-spring' 'API CRUD em Java com Spring.'
run 'Crud-Angular' 'CRUD com Angular.'
