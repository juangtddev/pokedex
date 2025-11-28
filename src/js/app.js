const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
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
  console.log('Inicializando Pokedex...');
  const initialData = await fetchPokemons(0, 18);
  console.log('Dados Iniciais Recebidos:', initialData);
}

document.addEventListener('DOMContentLoaded', init);
