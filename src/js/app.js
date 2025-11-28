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

/**
 * Carrega a primeira página de dados, incluindo os detalhes de cada Pokémon.
 * @param {number} offset - Ponto de início da lista.
 * @param {number} limit - Número de Pokémon.
 */
async function loadInitialData(offset = 0, limit = 18) {
    const listData = await fetchPokemons(offset, limit);

    if (!listData.results || listData.results.length === 0) {
        console.log("Nenhum Pokémon encontrado.");
        return;
    }

    const detailPromises = listData.results.map(pokemon => 
        fetchPokemonDetails(pokemon.url)
    );

   const detailedPokemons = await Promise.all(detailPromises);

    const validPokemons = detailedPokemons.filter(pokemon => pokemon !== null);

    console.log("Dados Detalhados Prontos para Renderização:", validPokemons);
    renderPokemonList(validPokemons);
    
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

async function init() {
    console.log('Módulo Principal Configurado e Inicializando Carga de Dados...');
    await loadInitialData(0, 18);
}

document.addEventListener('DOMContentLoaded', init);
