$ErrorActionPreference = "Stop"

$baseUrl = "https://sippo79.github.io/game-pc-guide"
$today = "2026-05-25"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$gamesDir = Join-Path $root "games"
$dataPath = Join-Path $root "data\games.json"

if (-not (Test-Path $gamesDir)) {
  New-Item -ItemType Directory -Path $gamesDir | Out-Null
}

function Escape-Html([string]$value) {
  if ($null -eq $value) {
    return ""
  }

  return [System.Net.WebUtility]::HtmlEncode($value)
}

function Get-Slug($game) {
  if ($game.id -eq "mhwilds") {
    return "monster-hunter"
  }

  return $game.id
}

function Get-SeoTitle($game) {
  switch ($game.id) {
    "apex" { return "Apex Legends おすすめPC｜144fps向けゲーミングPC構成" }
    "valorant" { return "VALORANT おすすめPC｜144fps・240fps向けゲーミングPC構成" }
    "ff14" { return "FF14 おすすめPC｜初心者向けゲーミングPC構成" }
    "mhwilds" { return "モンハンワイルズ おすすめPC｜快適に遊べるゲーミングPC構成" }
    default { return "$($game.title) おすすめPC｜必要スペックと快適に遊べる構成" }
  }
}

function Get-MetaDescription($game) {
  switch ($game.id) {
    "apex" { return "Apex LegendsをフルHD・144fpsで快適に遊ぶためのおすすめゲーミングPC構成を初心者向けに紹介。必要スペックや予算目安もわかります。" }
    "valorant" { return "VALORANTを144fpsから240fpsで快適に遊ぶためのおすすめゲーミングPC構成を紹介。低予算で選びやすい必要スペックや予算目安を解説します。" }
    "ff14" { return "FF14を高画質で快適に遊ぶためのおすすめゲーミングPC構成を初心者向けに紹介。必要スペック、予算目安、選び方のポイントがわかります。" }
    "mhwilds" { return "モンハンワイルズを快適に遊ぶためのおすすめゲーミングPC構成を紹介。重めのゲームに必要なスペックやGPU選び、予算目安を解説します。" }
    default { return "$($game.title)を快適に遊ぶためのおすすめゲーミングPC構成を紹介。必要スペック、予算目安、選び方のポイントを初心者向けにわかりやすく解説します。" }
  }
}

function Get-DetailLead($game) {
  switch ($game.level) {
    "軽い" { return "$($game.title)はPCゲームの中では軽めですが、快適さを重視するならfpsの安定や入力遅延の少なさも大切です。" }
    "軽め" { return "$($game.title)は比較的軽めのタイトルなので、予算を抑えつつ高fpsを狙いやすいゲームです。" }
    "軽め〜中量級" { return "$($game.title)は設定次第で幅広いPC構成に対応できます。まずは遊びたい解像度とfpsを決めると選びやすくなります。" }
    "中量級" { return "$($game.title)は極端に重いゲームではありませんが、高画質や高fpsを狙うならCPUとGPUのバランスが重要です。" }
    "中量級〜重め" { return "$($game.title)は遊び方によって負荷が変わりやすいため、少し余裕のある構成を選ぶと長く快適に使えます。" }
    "重め" { return "$($game.title)は負荷が高めのゲームなので、フルHDでもGPUとCPUに余裕を持たせると安心です。" }
    "超重い" { return "$($game.title)はかなり重い部類のゲームです。画質や解像度を上げたい場合は、GPU性能をしっかり確保しましょう。" }
    default { return "$($game.title)を快適に遊ぶには、必要スペックだけでなく目標fpsや解像度に合わせた構成選びが大切です。" }
  }
}

function Convert-ImagePath([string]$path) {
  if ([string]::IsNullOrWhiteSpace($path)) {
    return ""
  }

  return "../$path"
}

$games = Get-Content -Raw -Encoding UTF8 $dataPath | ConvertFrom-Json
$createdPages = @()

foreach ($game in $games) {
  $slug = Get-Slug $game
  $fileName = "$slug.html"
  $canonical = "$baseUrl/games/$fileName"
  $imagePath = Convert-ImagePath $game.image
  $seoTitle = Get-SeoTitle $game
  $metaDescription = Get-MetaDescription $game
  $detailLead = Get-DetailLead $game

  $buildCards = foreach ($build in $game.builds) {
@"
            <article class="build-card">
              <p class="build-label">$(Escape-Html $build.name)</p>
              <h3>$(Escape-Html $build.target)</h3>

              <ul class="build-specs">
                <li>
                  <span>予算目安</span>
                  <strong>$(Escape-Html $build.price)</strong>
                </li>
                <li>
                  <span>CPU</span>
                  <strong>$(Escape-Html $build.cpu)</strong>
                </li>
                <li>
                  <span>GPU</span>
                  <strong>$(Escape-Html $build.gpu)</strong>
                </li>
              </ul>
              <p class="build-comment">$(Escape-Html $build.comment)</p>
            </article>
"@
  }

  $html = @"
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>$(Escape-Html $seoTitle)</title>
  <meta name="description" content="$(Escape-Html $metaDescription)" />
  <link rel="canonical" href="$(Escape-Html $canonical)" />

  <meta property="og:title" content="$(Escape-Html $seoTitle)" />
  <meta property="og:description" content="$(Escape-Html $metaDescription)" />
  <meta property="og:image" content="$baseUrl/$(Escape-Html $game.image)" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="$(Escape-Html $canonical)" />
  <meta name="twitter:card" content="summary_large_image" />

  <link rel="stylesheet" href="../style.css" />
  <link rel="icon" type="image/png" href="../images/favicon.png" />
</head>

<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="../index.html" class="site-logo">
        GAME PC <span>GUIDE</span>
      </a>

      <nav class="header-nav">
        <a href="../index.html#games" class="header-link">ゲーム一覧</a>
        <a href="../index.html#beginner" class="header-link">初心者向け</a>
      </nav>
    </div>
  </header>

  <main>
    <section class="game-detail-hero">
      <img src="$(Escape-Html $imagePath)" alt="$(Escape-Html $game.title)" />

      <div class="container">
        <a href="../index.html#games" class="back-link">
          ← ゲーム一覧に戻る
        </a>

        <p class="hero-badge">$(Escape-Html $game.genre) / $(Escape-Html $game.level)</p>

        <h1>$(Escape-Html $game.title) おすすめPC</h1>

        <p class="hero-text">
          $(Escape-Html $game.description)
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-heading">
          <p class="section-label">RECOMMENDED BUILDS</p>
          <h2>$(Escape-Html $game.title)向けおすすめPC構成</h2>
          <p>
            $(Escape-Html $detailLead)
          </p>
        </div>

        <div class="build-grid">
$($buildCards -join "`r`n")
        </div>

        <section class="affiliate-section" aria-labelledby="affiliateTitle">
          <div class="affiliate-heading">
            <p class="section-label">SHOP LINKS</p>
            <h2 id="affiliateTitle">ショップ連携準備中</h2>
            <p>現在、販売サイトへのリンクを準備しています。公開後はこのエリアから確認できます。</p>
          </div>

          <div class="affiliate-link-grid">
            <span class="affiliate-button affiliate-button-bto affiliate-button-disabled" aria-disabled="true">
              <span>このゲーム向けBTOパソコンを探す</span>
              <small>ショップ連携準備中</small>
              <em>近日対応予定</em>
            </span>
            <span class="affiliate-button affiliate-button-amazonParts affiliate-button-disabled" aria-disabled="true">
              <span>AmazonでPCパーツを見る</span>
              <small>ショップ連携準備中</small>
              <em>近日対応予定</em>
            </span>
            <span class="affiliate-button affiliate-button-rakutenParts affiliate-button-disabled" aria-disabled="true">
              <span>楽天でPCパーツを見る</span>
              <small>ショップ連携準備中</small>
              <em>近日対応予定</em>
            </span>
            <span class="affiliate-button affiliate-button-monitor affiliate-button-disabled" aria-disabled="true">
              <span>ゲーミングモニターを見る</span>
              <small>ショップ連携準備中</small>
              <em>近日対応予定</em>
            </span>
            <span class="affiliate-button affiliate-button-mouse affiliate-button-disabled" aria-disabled="true">
              <span>ゲーミングマウスを見る</span>
              <small>ショップ連携準備中</small>
              <em>近日対応予定</em>
            </span>
          </div>
        </section>

        <div class="game-info-grid">
          <section class="info-card">
            <p class="info-label">RECOMMENDED</p>
            <h3>おすすめ環境</h3>
            <p>$(Escape-Html $game.recommended)</p>
          </section>

          <section class="info-card">
            <p class="info-label">BUDGET</p>
            <h3>予算目安</h3>
            <p>$(Escape-Html $game.budget)</p>
          </section>

          <section class="info-card info-card-wide">
            <p class="info-label">POINT</p>
            <h3>選び方のポイント</h3>
            <p>$(Escape-Html $game.point)</p>
          </section>

          <section class="info-card info-card-wide">
            <p class="info-label">CAUTION</p>
            <h3>注意点</h3>
            <p>$(Escape-Html $game.caution)</p>
          </section>
        </div>

        <div class="detail-related-sites">
          <div class="related-site-grid">
            <a
              href="https://sippo79.github.io/pc-build-check/"
              class="related-site-button related-site-build"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="related-site-mini">PC BUILD CHECK</span>
              <span>PC構成診断</span>
              <small>予算や用途からおすすめPC構成をチェック</small>
            </a>

            <a
              href="https://sippo79.github.io/gpu-guide/"
              class="related-site-button related-site-gpu"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="related-site-mini">GPU GUIDE</span>
              <span>グラボ比較ガイド</span>
              <small>GPU性能や用途別の目安を比較</small>
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>© GAME PC GUIDE</p>
    </div>
  </footer>
</body>
</html>
"@

  $outputPath = Join-Path $gamesDir $fileName
  Set-Content -Path $outputPath -Value $html -Encoding UTF8
  $createdPages += "games/$fileName"
}

$sitemapUrls = @("$baseUrl/")
foreach ($page in $createdPages) {
  $sitemapUrls += "$baseUrl/$page"
}

$sitemapEntries = foreach ($url in $sitemapUrls) {
@"
  <url>
    <loc>$url</loc>
    <lastmod>$today</lastmod>
  </url>
"@
}

$sitemap = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
$($sitemapEntries -join "`r`n")
</urlset>
"@

Set-Content -Path (Join-Path $root "sitemap.xml") -Value $sitemap -Encoding UTF8

Write-Host "Created $($createdPages.Count) static game pages."

