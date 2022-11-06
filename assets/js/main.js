const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
        <li onclick="sendInfo(this)" class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>
                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

async function sendInfo(element) {
  pokeId = element.querySelector(".number").innerText.replace("#", "");
  console.log(pokeId);
  pokemon = await pokeApi.getPokemon(pokeId);
  console.log("front", pokemon);
  detailedPokemonModal(pokemon);
}

function detailedPokemonModal(pokemon) {
  document.querySelector(".content").insertAdjacentHTML(
    `afterbegin`,
    `<div id="pokemonDetails" class="modal">
    <div id="modal" class="invisible modal">
    <div class="modalBox">
      <a href="#" onclick="(this.parentNode.parentNode.parentNode.remove())"  class="close" tabindex="0" role="button">close</a>
        <span class="number">#${pokemon.id}</span>
        <span class="name">${pokemon.name}</span>
      <ol class="types">
      ${pokemon.types
        .map(
          (type) => `<li class="type ${type.type.name}">${type.type.name}</li>`
        )
        .join("")}
  </ol>
  <img src="${pokemon.sprites.other.dream_world.front_default}"
  alt="${pokemon.name}">

      <div class="buttons">
        <button data-id="about" class="button" onclick="changeContent()">About</button>
        <button data-id="stats" class="button" onclick="changeContent()">Base Stats </button>
        <button data-id="evolution" class="button" onclick="changeContent()">Evolution</button>
        <button data-id="moves" class="button" onclick="changeContent()">Moves</button>
      </div>

      <div class="panel show" id="about">
        <div class="items">
          <p>Species ${pokemon.species.name} </p>
          <p>Heigth ${pokemon.height*10} cm</p>
          <p>weight ${pokemon.weight} KG</p>

          <p>Abilities ${
            pokemon.abilities
            .map((ability) => ability.ability.name)
            .join(", ")}
            </p>
        </div>
      </div>

      <div class="panel" id="stats"><p>base stats...</p></div>
      <div class="panel" id="evolution"><p>evolution...</p></div>
      <div class="panel" id="moves"><p>moves...</p></div>

    </div>
  </div>
     </div>`
  );
}

function changeContent(){
  console.log(typeof pokemon.abilities.name)
   const buttons = document.querySelector('.buttons');
   const panels = document.querySelectorAll('.panel');

   buttons.addEventListener('click', handleClick);

   function handleClick(e) {
   
   if (e.target.matches('button')) {
       panels.forEach(panel => panel.classList.remove('show'));

       const { id } = e.target.dataset;
       const selector = `.panel[id="${id}"]`;

       document.querySelector(selector).classList.add('show');
   }
  }
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});
