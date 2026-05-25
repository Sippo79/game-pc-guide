const affiliateLinks = {
  bto: "https://example.com/bto",
  amazonParts: "https://example.com/amazon-parts",
  rakutenParts: "https://example.com/rakuten-parts",
  monitor: "https://example.com/monitor",
  mouse: "https://example.com/mouse"
};

window.affiliateLinks = affiliateLinks;

const gameGrid = document.getElementById("gameGrid");
const gameSearchInput = document.getElementById("gameSearchInput");

let allGames = [];

function createAffiliateSection() {
  const links = [
    {
      key: "bto",
      label: "\u3053\u306e\u30b2\u30fc\u30e0\u5411\u3051BTO\u30d1\u30bd\u30b3\u30f3\u3092\u63a2\u3059",
      description: "\u63a8\u5968\u30b9\u30da\u30c3\u30af\u306b\u8fd1\u3044\u5b8c\u6210\u54c1PC\u3092\u30c1\u30a7\u30c3\u30af"
    },
    {
      key: "amazonParts",
      label: "Amazon\u3067PC\u30d1\u30fc\u30c4\u3092\u898b\u308b",
      description: "CPU\u30fbGPU\u30fb\u30e1\u30e2\u30ea\u306a\u3069\u3092\u307e\u3068\u3081\u3066\u63a2\u3059"
    },
    {
      key: "rakutenParts",
      label: "\u697d\u5929\u3067PC\u30d1\u30fc\u30c4\u3092\u898b\u308b",
      description: "\u30dd\u30a4\u30f3\u30c8\u9084\u5143\u3082\u898b\u306a\u304c\u3089\u30d1\u30fc\u30c4\u3092\u6bd4\u8f03"
    },
    {
      key: "monitor",
      label: "\u30b2\u30fc\u30df\u30f3\u30b0\u30e2\u30cb\u30bf\u30fc\u3092\u898b\u308b",
      description: "144Hz\u4ee5\u4e0a\u3084WQHD\u74b0\u5883\u3092\u6574\u3048\u305f\u3044\u4eba\u5411\u3051"
    },
    {
      key: "mouse",
      label: "\u30b2\u30fc\u30df\u30f3\u30b0\u30de\u30a6\u30b9\u3092\u898b\u308b",
      description: "FPS\u3084\u9577\u6642\u9593\u30d7\u30ec\u30a4\u306e\u64cd\u4f5c\u611f\u3092\u6539\u5584"
    }
  ];

  return `
    <section class="affiliate-section" aria-labelledby="affiliateTitle">
      <div class="affiliate-heading">
        <p class="section-label">SHOP LINKS</p>
        <h2 id="affiliateTitle">\u304a\u3059\u3059\u3081\u8cfc\u5165\u5148</h2>
        <p>\u5fc5\u8981\u306a\u30b9\u30da\u30c3\u30af\u3084\u5468\u8fba\u6a5f\u5668\u3092\u3001\u6c17\u306b\u306a\u3063\u305f\u30bf\u30a4\u30df\u30f3\u30b0\u3067\u8efd\u304f\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002</p>
      </div>

      <div class="affiliate-link-grid">
        ${links.map(link => `
          <a
            class="affiliate-button affiliate-button-${link.key}"
            href="${affiliateLinks[link.key]}"
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
          >
            <span>${link.label}</span>
            <small>${link.description}</small>
          </a>
        `).join("")}
      </div>

      <p class="affiliate-disclosure">
        \u5f53\u30b5\u30a4\u30c8\u3067\u306f\u30a2\u30d5\u30a3\u30ea\u30a8\u30a4\u30c8\u5e83\u544a\u3092\u5229\u7528\u3057\u3066\u3044\u307e\u3059\u3002\u30ea\u30f3\u30af\u5148\u3067\u5546\u54c1\u3092\u8cfc\u5165\u3059\u308b\u3068\u3001\u904b\u55b6\u8005\u306b\u53ce\u76ca\u304c\u767a\u751f\u3059\u308b\u5834\u5408\u304c\u3042\u308a\u307e\u3059\u3002
        Amazon\u306e\u30a2\u30bd\u30b7\u30a8\u30a4\u30c8\u3068\u3057\u3066\u3001\u5f53\u30b5\u30a4\u30c8\u306f\u9069\u683c\u8ca9\u58f2\u306b\u3088\u308a\u53ce\u5165\u3092\u5f97\u3066\u3044\u307e\u3059\u3002
      </p>
    </section>
  `;
}

window.createAffiliateSection = createAffiliateSection;

function renderAffiliateSection(targetId) {
  const target = document.getElementById(targetId);

  if (target) {
    target.innerHTML = createAffiliateSection();
  }
}

window.renderAffiliateSection = renderAffiliateSection;

async function loadGames() {
  try {
    const response = await fetch("./data/games.json");
    const games = await response.json();

    allGames = games;
    renderGames(allGames);
  } catch (error) {
    console.error("Failed to load games.json", error);

    gameGrid.innerHTML = `
      <p style="color:#ff8080;">
        \u30b2\u30fc\u30e0\u30c7\u30fc\u30bf\u306e\u8aad\u307f\u8fbc\u307f\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002
      </p>
    `;
  }
}

function renderGames(games) {
  if (games.length === 0) {
    gameGrid.innerHTML = `
      <p class="empty-message">
        \u8a72\u5f53\u3059\u308b\u30b2\u30fc\u30e0\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3067\u3057\u305f\u3002
      </p>
    `;
    return;
  }

  const staticPagePaths = {
    mhwilds: "games/monster-hunter.html"
  };

  gameGrid.innerHTML = games.map(game => `
    <a href="${staticPagePaths[game.id] || `games/${game.id}.html`}" class="game-card">
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

        <span class="game-link">\u304a\u3059\u3059\u3081PC\u3092\u898b\u308b &rarr;</span>
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

if (gameSearchInput) {
  gameSearchInput.addEventListener("input", filterGames);
}

if (gameGrid) {
  loadGames();
  renderAffiliateSection("affiliateSection");
}
