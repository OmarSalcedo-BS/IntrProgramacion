const pokedex = document.getElementById("pokedex");
const searchInput = document.getElementById("search");
let allPokemon =[];

async function fetchPokemon(id) {
    const res = await fetch (`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();
    return data;
}

async function fetchAllPokemon(limit = 150) { 

    for (let i = 1; i <= limit; i++) {
      const pokemon = await fetchPokemon(i); 
      allPokemon.push(pokemon); 
      renderPokemon(pokemon); 
    } 
  } 

  function renderPokemon(pokemon) {
    const pokemonEl = document.createElement("div");
    pokemonEl.classList.add("pokemon");
    pokemonEl.innerHTML =`
    <img src="${pokemon.sprites.front_default}" alt= "${pokemon.name}"/>
    <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2> 
    <p>#${pokemon.id.toString().padStart(3, '0')}</p> 
  `; 
  pokedex.appendChild(pokemonEl); 
  }

  searchInput.addEventListener('input', () => { 
    const query = searchInput.value.toLowerCase(); 
    pokedex.innerHTML = ''; 
    const filtered = allPokemon.filter(p => 
      p.name.includes(query) || p.id.toString() === query 
    ); 
    filtered.forEach(renderPokemon); 
  }); 
  fetchAllPokemon(); 

