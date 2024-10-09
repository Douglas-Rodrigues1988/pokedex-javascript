
const pokeApi = {};

class Pokemon {
    constructor() {
        this.number = 0;
        this.name = '';
        this.types = [];
        this.type = '';
        this.photo = '';
    }
}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon();
    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;

    const types = pokeDetail.types?.map((typeSlot) => typeSlot.type.name) || [];
    const [type] = types;

    pokemon.types = types;
    pokemon.type = type;
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

    return pokemon;
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(convertPokeApiDetailToPokemon)
        .catch((error) => {
            console.error('Fetch error: ', error);
        });
};

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => Promise.all(pokemons.map(pokeApi.getPokemonDetail)))
        .then((pokemonsDetails) => pokemonsDetails)
        .catch((error) => {
            console.error('Fetch error: ', error);
        });
};
