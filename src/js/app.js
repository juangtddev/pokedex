// ==============================
// 1. CONFIGURAÇÃO E ESTADO GLOBAL
// ==============================

const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
const POKEMON_LIMIT = 18;
const POKEMON_SEARCH_API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';

const pokemonGrid = document.getElementById('pokemon-grid');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const paginationNumbersContainer = document.getElementById('pagination-numbers');
const searchInput = document.getElementById('pokemon-search');
const loadingSpinner = document.getElementById('loading-spinner');

let totalPokemonCount = 0;
let currentPage = 1;
let currentSearchTerm = '';
let allPokemonData = []

function debounce(func, delay = 300) {
    let timeoutId;
    return function(...args) {
        
        clearTimeout(timeoutId);
        
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// ==============================
// 2. FUNÇÕES DE DADOS E API
// ==============================

function getPokemonImageUrl(sprites) {

    const officialArt = sprites.other['official-artwork']?.front_default;
    if (officialArt) {
        return officialArt;
    }

    const dreamWorld = sprites.other.dream_world?.front_default;
    if (dreamWorld) {
        return dreamWorld;
    }

    const defaultSprite = sprites.front_default;
    if (defaultSprite) {
        return defaultSprite;
    }
        
    return 'assets/placeholder.png'; 
}

async function fetchPokemons(offset = 0, limit = 1000) {
  try {
    const url = `${POKEMON_API_BASE_URL}?offset=${offset}&limit=${limit}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar a lista de Pokémon:', error);
    return { results: [], count: 0, next: null, previous: null };
  }
}

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

async function searchPokemon(term) {
 
    disablePagination();
    showLoading();

    try {
        const url = `${POKEMON_SEARCH_API_BASE_URL}${term.toLowerCase().trim()}`;
        const response = await fetch(url);

        if (!response.ok) {
 
            if (response.status === 404) {
                renderPokemonList([]); // Limpa a lista
 
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
 
        renderPokemonList([data]); 
        
    } catch (error) {
        console.error("Erro na busca de Pokémon:", error);
        renderPokemonList([]);
 
    } finally {
        hideLoading();
    }
}

// ==============================
// 3. FUNÇÕES DE RENDERIZAÇÃO (UI)
// ==============================
function createPokemonCard(pokemon) {
    
    const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const id = pokemon.id.toString().padStart(3, '0');
    const imageUrl = getPokemonImageUrl(pokemon.sprites);
    const mainType = pokemon.types[0].type.name; 

    const typesHtml = pokemon.types.map(typeInfo => {
        const type = typeInfo.type.name;
        const typeDisplay = type.charAt(0).toUpperCase() + type.slice(1);
        
        const typeTextColor = `text-type-${type}-text`; 

        return `
            <span class="text-xs bg-type-${type} text-white font-semibold px-2 py-0.5 rounded-full ">
                ${typeDisplay}
            </span>
        `;
    }).join('');
    
    const cardBgColor = `bg-type-${mainType}/10`;

    return `
        <div data-id="${id}" class="pokemon-card ${cardBgColor} 
        p-4 rounded-xl shadow-md text-center 
        border border-gray-100 
        hover:shadow-lg transition-shadow duration-300 transform hover:scale-[1.02] cursor-pointer">
          
            <div class="flex justify-between items-center">
                <div class="flex justify-center items-center gap-1">
                    ${typesHtml}
                </div>
                <div>
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

function renderPokemonList(pokemons) {
    if (!pokemonGrid) return;
    pokemonGrid.innerHTML = ''; 
    const cardHTML = pokemons.map(pokemon => createPokemonCard(pokemon)).join('');
    pokemonGrid.innerHTML = cardHTML;
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

function showLoading() {
    pokemonGrid.innerHTML = ''; // Limpa a grade (opcional, mas recomendado)
    loadingSpinner.classList.remove('hidden');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

// ==============================
// 4. FUNÇÕES DE PAGINAÇÃO E CONTROLE
// ==============================

async function fetchAllPokemonForCache() {
    showLoading();
    try {
    const initialData = await fetchPokemons(0, 1);
    const totalCount = initialData.count || 100000;
    const listData = await fetchPokemons(0, totalCount);

    if (listData.results && listData.results.length > 0) {
        allPokemonData = listData.results;
        totalPokemonCount = listData.count; 
        await loadPokemons(false);
    }
    } finally {
        hideLoading();      
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

    if (currentPage >= maxPages) {
        nextButton.disabled = true;
        nextButton.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        nextButton.disabled = false;
        nextButton.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    renderPaginationNumbers(maxPages);
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

async function loadPokemons(showLoader = true) {
    if (showLoader) {
        showLoading();
    }
    const offset = (currentPage - 1) * POKEMON_LIMIT;

    const listSlice = allPokemonData.slice(offset, offset + POKEMON_LIMIT);
    if (listSlice.length === 0) {
            renderPokemonList([]);
            return;
        }
    try {
        
        const detailPromises = listSlice.map(pokemon => 
        fetchPokemonDetails(pokemon.url)
    );
    const detailedPokemons = await Promise.all(detailPromises);
    const validPokemons = detailedPokemons.filter(pokemon => pokemon !== null);

    renderPokemonList(validPokemons);
    updatePaginationUI();
    } finally {
        if (showLoader) {
            hideLoading();
        }
    }
}

function disablePagination() {
    prevButton.disabled = true;
    nextButton.disabled = true;
    paginationNumbersContainer.innerHTML = ''; 
    
}

function enablePagination() {
    
    updatePaginationUI(); 
}

function handleSearchExecution() {
    const term = searchInput.value.trim().toLowerCase();

    if (term.length === 0) {
        if (currentSearchTerm) {
            currentSearchTerm = '';
            loadPokemons(); 
            enablePagination(); 
        }
        return;
    }

    const filteredList = allPokemonData.filter(pokemon => 
        pokemon.name.startsWith(term) 
    );

    currentSearchTerm = term;
    disablePagination();

    if (filteredList.length === 0) {
        renderPokemonList([]); 
        return;
    }

    const detailPromises = filteredList.map(pokemon => 
        fetchPokemonDetails(pokemon.url)
    );
    Promise.all(detailPromises)
        .then(detailedPokemons => {
            const validPokemons = detailedPokemons.filter(p => p !== null);
            renderPokemonList(validPokemons);
        });
}

// ==============================
// 5. INICIALIZAÇÃO E EVENTOS
// ==============================

const debouncedSearch = debounce(handleSearchExecution, 300); 

function setupEventListeners() {
    prevButton.addEventListener('click', goToPreviousPage);
    nextButton.addEventListener('click', goToNextPage);

    searchInput.addEventListener('keyup', debouncedSearch);

}

async function init() {
    setupEventListeners();
    await fetchAllPokemonForCache();
}

document.addEventListener('DOMContentLoaded', init);