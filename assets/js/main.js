const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li onclick="sendInfo(this)" class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}


async function sendInfo(element){
    pokeId = element.querySelector('.number').innerText.replace('#','')
    console.log(pokeId);
    pokemon = await pokeApi.getPokemon(pokeId)
    console.log('front',pokemon);
    detailedPokemonModal(pokemon)
}

function detailedPokemonModal(pokemon){
    document.querySelector('.content').insertAdjacentHTML(`afterbegin`, 
    `<div id="pokemonDetails" class="modal" onclick="(this.remove())">
    <div id="modal" class="invisible modal">
    <div class="modalBox">
      <a href="#"  class="close" tabindex="0" role="button">close</a>

      <h1>${pokemon.name}</h1>
      <ol class="types">
      ${pokemon.types.map((type) => `<li class="type ${type.type.name}">${type.type.name}</li>`).join('')}
  </ol>
      
      <p>Digite uma tarefa clicando no campo "add task" :)
      ps. Clique em qualquer lugar para fechar esta janela.

      </p>
    </div>
  </div>
     </div>`);

}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})