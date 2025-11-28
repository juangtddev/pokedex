
# 📚 Desafio Técnico Front-End: Pokedex Interativa

Este projeto é a solução para o desafio técnico de Front-End proposto pela **Lumis**, com o objetivo de construir uma Pokedex interativa e responsiva utilizando **Vanilla JavaScript**.

A implementação prioriza a **organização do código**, o **Git Flow profissional**, a **performance (UX)** e a **escalabilidade**, refletindo as boas práticas e metodologias ágeis esperadas para a posição de Desenvolvedor Fullstack Júnior.

-----

## 🎯 Objetivo da Aplicação

Criar uma Pokedex que:

1.  Liste Pokemons utilizando dados da **PokéAPI**.
2.  Permita **busca dinâmica** por nome ou ID.
3.  Implemente **paginação** interativa sem recarregar a página.
4.  Possua um *design* **responsivo** e visualmente agradável.

-----

## ⚙️ Tecnologias Utilizadas

| Categoria | Tecnologia | Versão/Tipo |
| :--- | :--- | :--- |
| **Linguagem Principal** | JavaScript | Vanilla JS (ES6+) |
| **Estilização** | Tailwind CSS | v4.1 (CLI / Configuração CSS-First) |
| **Marcação** | HTML | HTML5 |
| **Comunicação** | PokeAPI | RESTful |

-----

## 💡 Racional e Justificativas Técnicas

### 1\. Escolha do Tailwind CSS (em vez de CSS Puro)

O desafio permite o uso de ferramentas extras desde que justificadas. Optei por integrar o **Tailwind CSS (v4.1 CLI)** com a nova arquitetura **CSS-First** em vez de CSS puro ou pré-processadores.

| Benefício | Justificativa Profissional |
| :--- | :--- |
| **Agilidade e Produtividade** | O Tailwind é um *utility-first framework* que otimiza o tempo gasto na estilização de interfaces ricas. Seu novo motor (v4.0+) garante compilações até **100x mais rápidas**, crucial para a velocidade de desenvolvimento. |
| **Padronização e Flexibilidade** | Garante a **consistência** visual do design do Figma, enquanto a arquitetura v4.1 permite customizações de tema diretamente em CSS (`@theme`), alinhando-se a recursos modernos do CSS. |
| **Proficiência Técnica** | Demonstra familiaridade com *build tools* e a capacidade de integrar ferramentas de Front-End modernas (como o Tailwind v4.1, que é otimizado e simplificado ). |

### 2\. Design e Estilização dos Cards

O visual dos cards foi pensado para clareza e alto impacto, utilizando o sistema de design do Tailwind:

  * **Cor de Fundo Dinâmica (Efeito Suave):**
      * O background do card é dinamicamente definido pela **cor principal do tipo do Pokémon**, aplicada com **opacidade suave** (ex: `bg-type-grass-bg/20`).
      * **Resultado:** Cria uma sensação de **leveza** e **clareza**, destacando o tipo primário do Pokémon de forma elegante.
  * **Badges de Tipo Detalhados:**
      * Os *badges* de tipo (texto) utilizam as cores primárias do tipo (ex: `bg-type-fire`) sem borda e com texto em branco.
      * **Resultado:** Permite que o usuário **diferencie rapidamente** os múltiplos tipos (Água, Fogo, etc.), aumentando a legibilidade.
  * **Fallback de Imagem:** Implementada uma lógica robusta para *fallback* da imagem (Verificando `official-artwork`, `dream_world` e `front_default` em sequência), garantindo que **todos** os Pokémon exibam uma arte válida, mesmo com dados incompletos na API.

-----

## 🚀 Arquitetura e Estratégia de Performance

Para atingir a interatividade e performance exigidas, o código em Vanilla JS foi arquitetado em torno de um sistema de cache e eventos controlados:

1.  **Cache Completo de Dados (Escalabilidade):**
      * Na inicialização, a aplicação faz a chamada inicial para buscar e armazenar **todos** os Pokémon disponíveis no estado global.
      * **Benefício:** A **Paginação** e a **Busca** funcionam instantaneamente, pois o trabalho pesado de chamada à API é feito apenas uma vez, otimizando o carregamento de páginas.
2.  **Busca Dinâmica com Debouncing:**
      * A busca por nome é acionada "a cada caractere", mas utiliza a função utilitária **`debounce` (300ms)**.
      * **Benefício:** Oferece uma UX moderna de filtragem em tempo real, mas de forma performática, limitando as chamadas à API. A filtragem real (`startsWith`) é feita localmente no *cache*.
3.  **Renderização Otimizada e UX:**
      * As funções de busca de detalhes e de carregamento de página utilizam **`Promise.all`** para buscar múltiplos recursos da API em paralelo, minimizando o tempo de espera.
      * Implementado o **Estado de Carregamento (*Loading State*)** com um *spinner* em todas as operações assíncronas, dando *feedback* ao usuário.

-----

## 📂 Processo de Desenvolvimento e Git Flow

O projeto foi desenvolvido seguindo um fluxo de trabalho profissional, que é esperado em um ambiente de equipe ágil (Scrum/Kanban):

  * **Estrutura de Código:** O `app.js` é organizado em módulos lógicos (Configuração, API, Renderização, Paginação, Eventos) para garantir a **legibilidade** e a **manutenção**.
  * **Git Flow Estrito:** Todas as funcionalidades foram implementadas através de *feature branches* (ex: `feature/dynamic-search-with-debounce`).
  * **Revisão e Documentação:** Cada *issue* foi concluída com um Pull Request (PR) detalhado, documentando o código, a justificativa e os testes, demonstrando um processo de entrega rigoroso e transparente.

-----

## 🛠️ Como Executar o Projeto

1.  **Clone o Repositório:**

    ```bash
    git clone git@github.com:juangtddev/pokedex.git
    cd pokedex
    ```

2.  **Instale as Dependências do Tailwind:**

    ```bash
    npm install
    ```

    *(É necessário ter Node.js instalado para o CLI do Tailwind).*

3.  **Execute a Aplicação:**

      * Abra o arquivo `index.html` diretamente no seu navegador.

-----

**Desenvolvedor:** Juan Daniel Bezerra Jorge