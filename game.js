const gameTitle = document.getElementById("gameTitle");
const gameGenre = document.getElementById("gameGenre");
const gameDescription = document.getElementById("gameDescription");
const buildGrid = document.getElementById("buildGrid");
const gameRecommended = document.getElementById("gameRecommended");
const gameBudget = document.getElementById("gameBudget");
const gamePoint = document.getElementById("gamePoint");
const gameCaution = document.getElementById("gameCaution");
const params = new URLSearchParams(window.location.search);
const gameId = params.get("id");

async function loadGameDetail() {
  try {
    const response = await fetch("./data/games.json");
    const games = await response.json();

    const game = games.find(item => item.id === gameId);

    if (!game) {
      showNotFound();
      return;
    }

    renderGameDetail(game);
gameRecommended.textContent = game.recommended || "-";
gameBudget.textContent = game.budget || "-";
gamePoint.textContent = game.point || "-";
gameCaution.textContent = game.caution || "-";
  } catch (error) {
    console.error("ゲーム詳細の読み込み失敗", error);
    showError();
  }
}

function renderGameDetail(game) {
  document.title = `${game.title}おすすめPC｜必要スペックと初心者向け構成`;

const metaDescription = document.getElementById("metaDescription");

if (metaDescription) {
  metaDescription.setAttribute(
    "content",
    `${game.title}を快適に遊ぶためのおすすめゲーミングPC構成、必要スペック、予算目安を初心者向けにわかりやすく紹介します。`
  );
}

  gameGenre.textContent = `${game.genre} / ${game.level}`;
  gameTitle.textContent = `${game.title}おすすめPC`;
  gameDescription.textContent = game.description;

  buildGrid.innerHTML = game.builds.map(build => `
    <article class="build-card">
      <p class="build-label">${build.name}</p>
      <h3>${build.target}</h3>

      <ul class="build-specs">
        <li>
          <span>予算目安</span>
          <strong>${build.price}</strong>
        </li>
        <li>
          <span>CPU</span>
          <strong>${build.cpu}</strong>
        </li>
        <li>
          <span>GPU</span>
          <strong>${build.gpu}</strong>
        </li>
      </ul>
      <p class="build-comment">${build.comment || ""}</p>
    </article>
  `).join("");
}

function showNotFound() {
  gameTitle.textContent = "ゲームが見つかりません";
  gameDescription.textContent = "URLが間違っているか、games.jsonにデータが登録されていません。";
  buildGrid.innerHTML = "";
}

function showError() {
  gameTitle.textContent = "読み込みに失敗しました";
  gameDescription.textContent = "games.jsonの場所や記述を確認してください。";
  buildGrid.innerHTML = "";
}

loadGameDetail();