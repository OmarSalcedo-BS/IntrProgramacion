const apiURL = 'https://pokeapi.co/api/v2/pokemon/';
let chart = null;

async function fetchPokemon(name) {
  const res = await fetch(apiURL + name.toLowerCase());
  if (!res.ok) throw new Error('Pokémon no encontrado');
  return await res.json();
}

function renderCard(pokemon, isWinner = false) {
  const stats = pokemon.stats.map(s => `
    <li class="list-group-item bg-transparent border-light d-flex justify-content-between">
      <span>${s.stat.name.toUpperCase()}</span>
      <span>${s.base_stat}</span>
    </li>
  `).join('');

  return `
    <div class="col-md-6 mb-4">
      <div class="card pokemon ${isWinner ? 'winner' : ''}">
        <div class="text-center">
          <h3>${pokemon.name.toUpperCase()}</h3>
          <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="img-fluid mb-3" style="height: 120px;" />
        </div>
        <ul class="list-group list-group-flush">${stats}</ul>
      </div>
    </div>
  `;
}

function getStatsArray(pokemon) {
  return pokemon.stats.map(s => s.base_stat);
}

function getTotalStats(pokemon) {
  return pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);
}

function drawChart(p1, p2) {
  const labels = p1.stats.map(s => s.stat.name);
  const data1 = getStatsArray(p1);
  const data2 = getStatsArray(p2);

  const ctx = document.getElementById('statsChart').getContext('2d');
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels,
      datasets: [
        {
          label: p1.name.toUpperCase(),
          data: data1,
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 2
        },
        {
          label: p2.name.toUpperCase(),
          data: data2,
          backgroundColor: 'rgba(54,162,235,0.2)',
          borderColor: 'rgba(54,162,235,1)',
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: 'white' }},
        title: {
          display: true,
          text: 'Comparación de Stats',
          color: 'white'
        }
      },
      scales: {
        r: {
          pointLabels: { color: 'white' },
          angleLines: { color: 'gray' },
          grid: { color: 'gray' },
          ticks: { color: 'white' }
        }
      }
    }
  });
}

async function startBattle() {
  const name1 = document.getElementById('pokemon1').value;
  const name2 = document.getElementById('pokemon2').value;

  if (!name1 || !name2) {
    alert('Por favor, selecciona dos Pokémon');
    return;
  }

  try {
    const [p1, p2] = await Promise.all([
      fetchPokemon(name1),
      fetchPokemon(name2)
    ]);

    const t1 = getTotalStats(p1);
    const t2 = getTotalStats(p2);

    const battleContainer = document.getElementById('battle-container');
    const battleResult = document.getElementById('battle-result');

    // Mostrar mensaje del ganador
    if (t1 > t2) {
      battleResult.innerHTML = `🏆 ¡${p1.name.toUpperCase()} gana la batalla!`;
    } else if (t2 > t1) {
      battleResult.innerHTML = `🏆 ¡${p2.name.toUpperCase()} gana la batalla!`;
    } else {
      battleResult.innerHTML = `🤝 ¡Empate entre ${p1.name.toUpperCase()} y ${p2.name.toUpperCase()}!`;
    }

    // Renderizar tarjetas y agregar clase 'winner' al ganador
    battleContainer.innerHTML = `
      ${renderCard(p1, t1 > t2)}
      ${renderCard(p2, t2 > t1)}
    `;

    // Agregar animación de ganador
    const cards = battleContainer.querySelectorAll('.card.pokemon');
    if (t1 > t2) {
      cards[0].classList.add('winner');
    } else if (t2 > t1) {
      cards[1].classList.add('winner');
    }

    // Dibujar gráfico
    drawChart(p1, p2);

  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function loadPokemonOptions() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
  const data = await res.json();
  const options = data.results;

  const select1 = document.getElementById('pokemon1');
  const select2 = document.getElementById('pokemon2');

  options.forEach(p => {
    const opt1 = new Option(p.name.toUpperCase(), p.name);
    const opt2 = new Option(p.name.toUpperCase(), p.name);
    select1.add(opt1);
    select2.add(opt2);
  });
}

window.onload = loadPokemonOptions;
