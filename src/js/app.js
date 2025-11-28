const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
const pokemonGrid = document.getElementById('pokemon-grid');

/**
 * Cria o HTML de um único Card de Pokémon.
 * @param {Object} pokemon - Objeto de detalhes do Pokémon (do loadInitialData).
 * @returns {string} O HTML completo do card.
 */
function createPokemonCard(pokemon) {
    
    const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const id = pokemon.id.toString().padStart(3, '0');
    const imageUrl = pokemon.sprites.other['official-artwork'].front_default;
    
    const mainType = pokemon.types[0].type.name; 

    const typesHtml = pokemon.types.map(typeInfo => {
        const type = typeInfo.type.name;
        const typeDisplay = type.charAt(0).toUpperCase() + type.slice(1);
        const bgColorClass = `bg-type-${type}`.toLowerCase().trim();;
         console.log("Gerando badge para tipo:", type, "com classe:", bgColorClass);
        return `
            <div class="${bgColorClass} text-white text-xs font-semibold border border-current px-2 py-0.5 rounded-full ">
                ${typeDisplay}
            </div>
        `;
    }).join('');

    return `
        <div data-id="${id}" class="pokemon-card bg-type-${mainType}/20 
        p-4 rounded-xl shadow-md text-center 
                     border border-gray-100 
                    hover:shadow-lg transition-shadow duration-300 transform hover:scale-[1.02] cursor-pointer">
          
                    <div class="flex justify-between items-center">
            <div class="flex justify-center items-center gap-1">
                ${typesHtml}
            </div>
            <div class="flex justify-center items-center">
                <span class="text-gray-500 text-sm font-medium">#${id}</span>
            </div>
            </div>
            
            <div class="flex justify-center items-center h-28 my-2">
                <img 
                    src="${imageUrl}" 
                    alt="${name} Artwork" 
                    class="w-32 h-24 object-contain transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                >
            </div>
            
            <h3 class="text-xl font-bold text-gray-800 mt-2">${name}</h3>
                        
        </div>
    `;
}

/**
 * Renderiza a lista de Pokémon na grade e limpa a grade primeiro.
 * @param {Array<Object>} pokemons - Lista de objetos Pokémon detalhados.
 */
function renderPokemonList(pokemons) {
    if (!pokemonGrid) return;
    pokemonGrid.innerHTML = ''; 
    const cardHTML = pokemons.map(pokemon => createPokemonCard(pokemon)).join('');
    pokemonGrid.innerHTML = cardHTML;
}

/**
 * Busca detalhes completos de um Pokémon através de sua URL.
 * @param {string} url - URL específica do Pokémon (ex: https://pokeapi.co/api/v2/pokemon/1/).
 * @returns {Promise<Object|null>} Os detalhes completos do Pokémon, ou null em caso de erro.
 */
async function fetchPokemonDetails(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} for URL: ${url}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar detalhes do Pokémon:", url, error);
        return null;
    }
}

function goToNextPage() {
    currentPage++;
    loadPokemons();
    window.scrollTo(0, 0);
}

function goToPreviousPage() {
    currentPage--;
    loadPokemons();
    window.scrollTo(0, 0);
}

function renderPaginationNumbers(maxPages) {
    if (!paginationNumbersContainer) return;
    
    paginationNumbersContainer.innerHTML = ''; 
    
    const maxVisiblePages = 3; 
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(maxPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageNumber = i;
        const isActive = pageNumber === currentPage;
        
        const classList = isActive 
            ? 'px-3 py-1 bg-blue-500 text-white rounded-md cursor-default' 
            : 'px-3 py-1 text-gray-700 hover:bg-gray-200 rounded-md cursor-pointer transition duration-150';

        const pageElement = document.createElement('span');
        pageElement.className = classList;
        pageElement.textContent = pageNumber;
        
        if (!isActive) {
            pageElement.addEventListener('click', () => {
                currentPage = pageNumber;
                loadPokemons();
                window.scrollTo(0, 0);
            });
        }

        paginationNumbersContainer.appendChild(pageElement);
    }

    if (endPage < maxPages) {
         const ellipsis = document.createElement('span');
         ellipsis.textContent = '...';
         ellipsis.className = 'px-3 py-1 text-gray-500 cursor-default';
         paginationNumbersContainer.appendChild(ellipsis);
    }

    if (endPage < maxPages) {
        const lastPageButton = document.createElement('span');
        lastPageButton.textContent = maxPages;
        lastPageButton.className = 'px-3 py-1 text-gray-700 hover:bg-gray-200 rounded-md cursor-pointer transition duration-150';
        lastPageButton.addEventListener('click', () => {
            currentPage = maxPages;
            loadPokemons();
            window.scrollTo(0, 0);
        });
        paginationNumbersContainer.appendChild(lastPageButton);
    }
}

function updatePaginationUI() {

    if (currentPage <= 1) {
        prevButton.disabled = true;
        prevButton.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        prevButton.disabled = false;
        prevButton.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    const maxPages = Math.ceil(totalPokemonCount / POKEMON_LIMIT);
    renderPaginationNumbers(maxPages);
}

/**
 * Carrega a primeira página de dados, incluindo os detalhes de cada Pokémon.
 * @param {number} offset - Ponto de início da lista.
 * @param {number} limit - Número de Pokémon.
 */
async function loadPokemons() {
    const offset = (currentPage - 1) * POKEMON_LIMIT;
    
    const listData = await fetchPokemons(offset, POKEMON_LIMIT);

    if (!listData.results || listData.results.length === 0) {
            return;
    }
    
    totalPokemonCount = listData.count;

    const detailPromises = listData.results.map(pokemon => 
        fetchPokemonDetails(pokemon.url)
    );
    const detailedPokemons = await Promise.all(detailPromises);
    const validPokemons = detailedPokemons.filter(pokemon => pokemon !== null);

    renderPokemonList(validPokemons);
    
    updatePaginationUI();
}

/**
 * Busca uma lista paginada de Pokémon.
 * @param {number} offset - O ponto de início da lista (para paginação).
 * @param {number} limit - O número de Pokémon a serem retornados.
 * @returns {Promise<Object>} Os dados brutos da API.
 */
async function fetchPokemons(offset = 0, limit = 18) {
  try {
    const url = `${POKEMON_API_BASE_URL}?offset=${offset}&limit=${limit}`;
    console.log(`Fetching from: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Erro ao buscar a lista de Pokémon:', error);
    return { results: [], count: 0, next: null, previous: null };
  }
}

// Elementos do DOM
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const paginationNumbersContainer = document.getElementById('pagination-numbers'); // Container dos números

// Variáveis de Estado
let currentPageOffset = 0;
const POKEMON_LIMIT = 18; // 18 Pokémon por página, baseado no layout do Figma
let totalPokemonCount = 0; // Total de Pokémon, para calcular o número de páginas
let currentPage = 1;

function setupEventListeners() {
    
    prevButton.addEventListener('click', goToPreviousPage);
    nextButton.addEventListener('click', goToNextPage);
    
}

async function init() {
    setupEventListeners();
    await loadPokemons();
}

document.addEventListener('DOMContentLoaded', init);
