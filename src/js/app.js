const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

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
