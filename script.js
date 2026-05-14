const gameGrid = document.getElementById("gameGrid");
const gameSearchInput = document.getElementById("gameSearchInput");

let allGames = [];

async function loadGames() {
  try {
    const response = await fetch("./data/games.json");
    const games = await response.json();

    allGames = games;
    renderGames(allGames);

  } catch (error) {
    console.error("games.json の読み込み失敗", error);

    gameGrid.innerHTML = `
      <p style="color:#ff8080;">
        ゲームデータの読み込みに失敗しました。
      </p>
    `;
  }
}

function renderGames(games) {
  if (games.length === 0) {
    gameGrid.innerHTML = `
      <p class="empty-message">
        該当するゲームが見つかりませんでした。
      </p>
    `;
    return;
  }

  gameGrid.innerHTML = games.map(game => `
    <a href="game.html?id=${game.id}" class="game-card">
      <div class="game-thumb">
${game.image
  ? `
    <img
      src="${game.image}"
      alt="${game.title}"
      onerror="this.parentElement.innerHTML='<div class=&quot;game-thumb-placeholder&quot;><span>${game.genre}</span></div>'"
    >
  `
  : `
    <div class="game-thumb-placeholder">
      <span>${game.genre}</span>
    </div>
  `
}
      </div>

      <div class="game-card-body">
        <div class="game-card-top">
          <span class="game-tag">${game.genre}</span>
          <span class="game-level">${game.level}</span>
        </div>

        <h3>${game.title}</h3>
        <p>${game.description}</p>

        <span class="game-link">おすすめPCを見る →</span>
      </div>
    </a>
  `).join("");
}

function filterGames() {
  const keyword = gameSearchInput.value.trim().toLowerCase();

  const filteredGames = allGames.filter(game => {
    return (
      game.title.toLowerCase().includes(keyword) ||
      game.genre.toLowerCase().includes(keyword) ||
      game.level.toLowerCase().includes(keyword) ||
      game.description.toLowerCase().includes(keyword)
    );
  });

  renderGames(filteredGames);
}

gameSearchInput.addEventListener("input", filterGames);

loadGames();