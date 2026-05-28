const START_DATE = "2000-01-01";
const TODAY = "2026-05-28";
const FAVORITE_KEY = "marketSignalFavorites";

const assets = [
  { id: "TWII", symbol: "台指", name: "台灣加權指數", group: "指數", beta: 1.00, ai: 0.62, quality: 0.64, valuation: 0.58, flow: 0.72 },
  { id: "0050", symbol: "0050", name: "元大台灣50", group: "ETF", beta: 0.92, ai: 0.72, quality: 0.70, valuation: 0.62, flow: 0.68 },
  { id: "006208", symbol: "006208", name: "富邦台50", group: "ETF", beta: 0.90, ai: 0.70, quality: 0.70, valuation: 0.62, flow: 0.66 },
  { id: "2330", symbol: "2330", name: "台積電", group: "半導體", beta: 1.08, ai: 0.95, quality: 0.92, valuation: 0.76, flow: 0.74 },
  { id: "2454", symbol: "2454", name: "聯發科", group: "IC 設計", beta: 1.18, ai: 0.70, quality: 0.76, valuation: 0.70, flow: 0.66 },
  { id: "2317", symbol: "2317", name: "鴻海", group: "電子代工", beta: 1.06, ai: 0.78, quality: 0.65, valuation: 0.55, flow: 0.62 },
  { id: "2308", symbol: "2308", name: "台達電", group: "電源/工控", beta: 0.98, ai: 0.74, quality: 0.82, valuation: 0.68, flow: 0.58 },
  { id: "2382", symbol: "2382", name: "廣達", group: "AI 伺服器", beta: 1.28, ai: 0.92, quality: 0.66, valuation: 0.78, flow: 0.70 },
  { id: "2412", symbol: "2412", name: "中華電", group: "防禦", beta: 0.45, ai: 0.18, quality: 0.84, valuation: 0.44, flow: 0.42 },
  { id: "2882", symbol: "2882", name: "國泰金", group: "金融", beta: 0.82, ai: 0.18, quality: 0.58, valuation: 0.50, flow: 0.64 }
];

const modules = [
  { id: "trend", name: "價格趨勢", weight: 18, note: "均線結構、動能與相對強弱。" },
  { id: "earnings", name: "獲利基本面", weight: 18, note: "營收、EPS、品質與展望。" },
  { id: "valuation", name: "估值壓力", weight: 16, note: "PE、PB、殖利率與風險溢酬。" },
  { id: "breadth", name: "市場廣度/族群", weight: 14, note: "同族群擴散、站上均線比例與集中度。" },
  { id: "flow", name: "籌碼資金", weight: 16, note: "外資、主力、融資、成交熱度。" },
  { id: "macro", name: "宏觀與產業上游", weight: 18, note: "利率、匯率、AI CAPEX、景氣循環。" }
];

const signalRules = [
  { min: 75, key: "green", title: "綠燈", action: "多頭健康", text: "趨勢與基本面仍支持風險資產，可維持原本配置節奏。" },
  { min: 62, key: "yellow", title: "黃燈", action: "強勢偏熱", text: "多頭仍在，但估值、情緒或集中度開始升溫。" },
  { min: 48, key: "orange", title: "橘燈", action: "回檔風險升高", text: "健康度與風險開始背離，適合保留現金、避免追高。" },
  { min: 34, key: "red", title: "紅燈", action: "防守優先", text: "多個模組轉弱，回檔機率高，先控部位集中度。" },
  { min: 0, key: "deep-red", title: "深紅", action: "高危險區", text: "可能進入趨勢破壞或恐慌段，避免情緒化承接。" }
];

const colorMap = {
  green: "#1f9d55",
  yellow: "#d99a00",
  orange: "#e56b1f",
  red: "#d83a3a",
  "deep-red": "#8f1d2c"
};

const sourceList = ["Reuters", "Bloomberg", "CNBC", "Nikkei Asia", "WSJ", "中央社", "經濟日報", "工商時報", "MoneyDJ"];

const newsEvents = [
  news("2000-03-10", "國際財經媒體", "科技股估值泡沫進入高波動期", "高本益比科技股對利率與資金情緒變得敏感，趨勢轉弱時回檔速度會放大。", "估值", -2, ["TWII", "0050", "2330", "2454"]),
  news("2008-09-15", "Reuters / Bloomberg", "全球金融危機引發風險資產重定價", "信用風險上升時，金融與景氣循環股的風險分數需大幅上修。", "宏觀", -3, ["TWII", "0050", "2882"]),
  news("2011-08-05", "國際財經媒體", "歐債與美債評級事件拉高全球避險需求", "資金轉向防禦時，高 beta 標的健康度通常先下滑。", "宏觀", -2, ["TWII", "0050", "2454", "2317"]),
  news("2018-10-11", "Reuters / 中央社", "美債殖利率與貿易摩擦壓抑科技股估值", "出口導向電子股容易受美元、關稅與終端需求預期影響。", "估值", -2, ["TWII", "0050", "2330", "2317", "2454"]),
  news("2020-03-16", "Reuters / 中央社", "疫情衝擊全球需求，市場進入恐慌流動性壓力", "極端流動性事件下，回檔風險度應優先反映波動與信用壓力。", "宏觀", -3, ["TWII", "0050", "006208", "2330", "2882"]),
  news("2021-07-15", "經濟日報 / MoneyDJ", "半導體供需緊俏，台灣權值電子基本面受支撐", "供需能見度高時，獲利健康度會支撐估值溢價。", "基本面", 2, ["TWII", "0050", "006208", "2330", "2454"]),
  news("2022-06-15", "Bloomberg / WSJ", "聯準會升息加速，成長股估值承壓", "利率上行會壓縮科技股評價，高 beta 與高估值標的需提高風險分數。", "估值", -2, ["TWII", "0050", "006208", "2330", "2454", "2382"]),
  news("2023-05-25", "CNBC / Reuters", "AI 晶片需求推升全球半導體信心", "AI CAPEX 上修會提高半導體與 AI 伺服器供應鏈健康度。", "基本面", 3, ["TWII", "0050", "006208", "2330", "2382", "2308"]),
  news("2024-04-18", "中央社 / 工商時報", "台積電先進製程與封裝展望成市場焦點", "先進製程與封裝能見度支撐台股核心權值股，但集中度也提高。", "基本面", 2, ["TWII", "0050", "006208", "2330"]),
  news("2025-03-13", "經濟日報 / 工商時報", "融資與當沖熱度升高，短線情緒指標偏熱", "散戶槓桿升溫時，指數可以續強，但追價風險應上修。", "籌碼", -2, ["TWII", "0050", "006208", "2382"]),
  news("2026-05-22", "Bloomberg / 中央社", "AI 權值股續強但市場討論集中風險", "越集中於少數權值股，越需要同時看市場廣度與估值壓力。", "市場廣度", -1, ["TWII", "0050", "006208", "2330", "2382"])
];

const datasets = new Map(assets.map((asset) => [asset.id, buildDailySignals(asset)]));
let selectedAssetId = "TWII";
let selectedDate = TODAY;
let chartStartIndex = 0;
let chartEndIndex = currentRows().length - 1;
let chartMode = "health";
let favorites = loadFavorites();

function news(date, source, title, summary, category, impact, assetsList) {
  return { date, source, title, summary, category, impact, assets: assetsList };
}

function currentAsset() {
  return assets.find((asset) => asset.id === selectedAssetId) || assets[0];
}

function currentRows() {
  return datasets.get(selectedAssetId) || datasets.get(assets[0].id);
}

function buildDailySignals(asset) {
  const rows = [];
  const startDate = parseDate(START_DATE);
  const endDate = parseDate(TODAY);
  const totalDays = Math.round((endDate - startDate) / 86400000);
  const seed = asset.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

  for (let i = 0; i <= totalDays; i += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const progress = i / Math.max(totalDays, 1);
    const longCycle = Math.sin((i + seed) / 520);
    const midCycle = Math.sin((i + seed) / 97);
    const shortCycle = Math.cos((i + seed) / 31);
    const aiEra = logistic((progress - 0.86) * 18) * asset.ai;
    const rateStress = logistic((progress - 0.82) * 13) * (0.45 + asset.beta * 0.35);
    const qualityBase = 45 + asset.quality * 34;

    const row = {
      date: toISODate(date),
      asset,
      modules: [
        moduleScore("trend", qualityBase + asset.beta * 6 + midCycle * 11 + aiEra * 12, 34 + asset.beta * 18 + Math.max(midCycle, 0) * 16),
        moduleScore("earnings", qualityBase + aiEra * 18 + longCycle * 7, 28 + (1 - asset.quality) * 22 + Math.max(-longCycle, 0) * 12),
        moduleScore("valuation", 58 + asset.quality * 10 - asset.valuation * 8 + shortCycle * 5, 36 + asset.valuation * 38 + aiEra * 18 + rateStress * 12),
        moduleScore("breadth", 62 + (asset.group === "防禦" ? 5 : 0) - aiEra * 9 + Math.sin((i + seed) / 71) * 13, 30 + asset.beta * 14 + aiEra * 16 + Math.max(-midCycle, 0) * 12),
        moduleScore("flow", 54 + asset.flow * 22 + shortCycle * 9, 32 + asset.flow * 18 + asset.beta * 12 + Math.max(shortCycle, 0) * 13),
        moduleScore("macro", 60 + asset.quality * 10 - rateStress * 12 + longCycle * 8, 35 + rateStress * 36 + asset.beta * 8)
      ],
      syntheticReturn: syntheticForwardReturn(i, progress, asset)
    };
    row.states = buildStates(row);
    rows.push(row);
  }

  newsEvents.forEach((event) => {
    if (!event.assets.includes(asset.id)) return;
    const row = rows.find((item) => item.date === event.date);
    if (!row) return;
    row.modules = row.modules.map((item) => adjustModuleByNews(item, event));
    row.states = buildStates(row);
  });

  return rows;
}

function logistic(value) {
  return 1 / (1 + Math.exp(-value));
}

function moduleScore(id, health, risk) {
  const meta = modules.find((item) => item.id === id);
  return {
    ...meta,
    health: Math.round(clamp(health, 0, 100)),
    risk: Math.round(clamp(risk, 0, 100))
  };
}

function adjustModuleByNews(item, event) {
  const mapping = {
    "基本面": ["earnings", "trend", "macro"],
    "估值": ["valuation", "macro"],
    "籌碼": ["flow", "trend"],
    "宏觀": ["macro", "flow", "trend"],
    "市場廣度": ["breadth", "trend"]
  };
  const affected = mapping[event.category] || [];
  if (!affected.includes(item.id)) return item;
  const healthShift = event.impact > 0 ? event.impact * 4 : event.impact * 2;
  const riskShift = event.impact < 0 ? Math.abs(event.impact) * 6 : -event.impact * 2;
  return {
    ...item,
    health: Math.round(clamp(item.health + healthShift, 0, 100)),
    risk: Math.round(clamp(item.risk + riskShift, 0, 100))
  };
}

function syntheticForwardReturn(index, progress, asset) {
  return Math.sin(index / 63) * 0.025 * asset.beta + Math.sin(index / 420) * 0.035 + progress * 0.018 + asset.quality * 0.004 - 0.018;
}

function weightedScore(day, field) {
  const totalWeight = day.modules.reduce((sum, item) => sum + item.weight, 0);
  const weighted = day.modules.reduce((sum, item) => sum + item[field] * item.weight, 0);
  return Math.round(weighted / totalWeight);
}

function compositeScore(day) {
  const health = weightedScore(day, "health");
  const risk = weightedScore(day, "risk");
  return Math.round(clamp(health - risk * 0.45 + 28, 0, 100));
}

function getSignal(score) {
  return signalRules.find((rule) => score >= rule.min);
}

function getQuadrant(health, risk) {
  if (health >= 68 && risk < 58) return { key: "ideal", title: "健康高、風險低", text: "最理想的多頭環境，可維持配置。" };
  if (health >= 68 && risk >= 58) return { key: "hot", title: "健康高、風險高", text: "強勢但擁擠，不宜追高。" };
  if (health < 68 && risk >= 58) return { key: "danger", title: "健康低、風險高", text: "回檔壓力明顯，防守優先。" };
  return { key: "repair", title: "健康低、風險低", text: "盤整或修復期，等基本面回升。" };
}

function buildStates(day) {
  const health = weightedScore(day, "health");
  const risk = weightedScore(day, "risk");
  const score = compositeScore(day);
  const signal = getSignal(score);
  const quadrant = getQuadrant(health, risk);

  return [
    ["標的", `${day.asset.symbol} ${day.asset.name}`],
    ["分類", day.asset.group],
    ["綜合分", `${score}/100`],
    ["象限", quadrant.title],
    ["主要判斷", signal.action]
  ];
}

function getDay(date) {
  const rows = currentRows();
  return rows.find((item) => item.date === date) || rows[rows.length - 1];
}

function parseDate(value) {
  return new Date(`${value}T00:00:00`);
}

function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

function daysBetween(a, b) {
  return Math.round((parseDate(a) - parseDate(b)) / 86400000);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatDate(value) {
  const date = parseDate(value);
  return new Intl.DateTimeFormat("zh-Hant-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short"
  }).format(date);
}

function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
}

function initAssets() {
  const select = document.getElementById("assetSelect");
  select.innerHTML = assets.map((asset) => `<option value="${asset.id}">${asset.symbol} ${asset.name}</option>`).join("");
  select.value = selectedAssetId;
  select.addEventListener("change", () => selectAsset(select.value));
  document.getElementById("assetSearch").addEventListener("input", renderAssetGrid);
  document.getElementById("favoriteToggle").addEventListener("click", () => toggleFavorite(selectedAssetId));
  renderAssetGrid();
  renderFavorites();
}

function renderAssetGrid() {
  const query = document.getElementById("assetSearch").value.trim().toLowerCase();
  const filtered = assets.filter((asset) => {
    const text = `${asset.symbol} ${asset.name} ${asset.group}`.toLowerCase();
    return text.includes(query);
  });
  document.getElementById("assetGrid").innerHTML = filtered.map((asset) => {
    const active = asset.id === selectedAssetId;
    const liked = favorites.includes(asset.id);
    return `
      <article class="asset-card ${active ? "is-active" : ""}">
        <div class="asset-card-top">
          <button type="button" class="asset-picker" data-asset="${asset.id}">
            <strong>${asset.symbol}</strong>
            <span>${asset.name}</span>
          </button>
          <button type="button" class="heart-button ${liked ? "is-favorite" : ""}" data-heart="${asset.id}" aria-label="收藏 ${asset.symbol}">${liked ? "♥" : "♡"}</button>
        </div>
        <span>${asset.group}</span>
      </article>
    `;
  }).join("");

  document.querySelectorAll("[data-asset]").forEach((button) => {
    button.addEventListener("click", () => selectAsset(button.dataset.asset));
  });
  document.querySelectorAll("[data-heart]").forEach((button) => {
    button.addEventListener("click", () => toggleFavorite(button.dataset.heart));
  });
}

function renderFavorites() {
  const row = document.getElementById("favoriteRow");
  if (!favorites.length) {
    row.innerHTML = `<span class="source-chip">尚未加入愛心標的</span>`;
  } else {
    row.innerHTML = favorites.map((id) => {
      const asset = assets.find((item) => item.id === id);
      return `<button type="button" class="favorite-chip is-favorite" data-favorite="${id}">♥ ${asset.symbol}</button>`;
    }).join("");
  }
  document.querySelectorAll("[data-favorite]").forEach((button) => {
    button.addEventListener("click", () => selectAsset(button.dataset.favorite));
  });

  const isFavorite = favorites.includes(selectedAssetId);
  const toggle = document.getElementById("favoriteToggle");
  toggle.classList.toggle("is-favorite", isFavorite);
  toggle.setAttribute("aria-pressed", String(isFavorite));
  toggle.textContent = isFavorite ? "♥ 已加入愛心" : "♡ 加入愛心";
}

function toggleFavorite(id) {
  favorites = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
  saveFavorites();
  renderAssetGrid();
  renderFavorites();
}

function selectAsset(id) {
  selectedAssetId = id;
  selectedDate = TODAY;
  chartStartIndex = 0;
  chartEndIndex = currentRows().length - 1;
  document.getElementById("assetSelect").value = id;
  resetTrendControls();
  renderAssetGrid();
  renderFavorites();
  renderAll();
}

function renderDashboard(date) {
  const day = getDay(date);
  selectedDate = day.date;

  const health = weightedScore(day, "health");
  const risk = weightedScore(day, "risk");
  const score = compositeScore(day);
  const signal = getSignal(score);
  const quadrant = getQuadrant(health, risk);

  document.getElementById("dataDate").textContent = formatDate(day.date);
  setRing("healthRing", "healthScore", health, healthColor(health));
  setRing("riskRing", "riskScore", risk, riskColor(risk));
  document.getElementById("healthTitle").textContent = health >= 72 ? "基本面與趨勢偏強" : health >= 58 ? "多頭仍在但需觀察" : "多頭健康度轉弱";
  document.getElementById("healthText").textContent = `${currentAsset().symbol} 的健康度綜合價格趨勢、獲利、族群廣度與產業上游。`;
  document.getElementById("riskTitle").textContent = risk >= 70 ? "回檔風險偏高" : risk >= 55 ? "風險升溫" : "風險相對可控";
  document.getElementById("riskText").textContent = "風險度綜合估值、籌碼情緒、集中度、利率匯率與波動壓力。";
  document.getElementById("signalTitle").textContent = `${signal.title} · ${quadrant.title}`;
  document.getElementById("signalText").textContent = `${signal.text} ${quadrant.text}`;
  document.getElementById("actionTitle").textContent = signal.action;
  document.getElementById("actionText").textContent = actionText(health, risk, signal);

  renderStates(day.states);
  renderModules(day.modules);
  renderMatrix(health, risk);
  renderHistory();
}

function setRing(ringId, scoreId, value, color) {
  const ring = document.getElementById(ringId);
  ring.style.setProperty("--pct", value);
  ring.style.setProperty("--ring", color);
  document.getElementById(scoreId).textContent = value;
}

function healthColor(value) {
  if (value >= 75) return colorMap.green;
  if (value >= 62) return colorMap.yellow;
  if (value >= 48) return colorMap.orange;
  return colorMap.red;
}

function riskColor(value) {
  if (value >= 72) return colorMap.red;
  if (value >= 58) return colorMap.orange;
  if (value >= 42) return colorMap.yellow;
  return colorMap.green;
}

function actionText(health, risk, signal) {
  if (health >= 68 && risk >= 58) return "標的仍強，但回檔風險偏熱；適合持有、分批，不適合一次追高。";
  if (health >= 68) return "趨勢與基本面配合，配置可維持，新增部位仍看估值與新聞是否已反映。";
  if (risk >= 58) return "健康度下降且風險偏高，優先降低槓桿與集中度，等待健康度修復。";
  return `${signal.action}，先觀察獲利與價格趨勢是否回升，再提高加碼速度。`;
}

function renderStates(states) {
  document.getElementById("stateList").innerHTML = states.map(([label, value]) => `
    <div class="state-item"><span>${label}</span><strong>${value}</strong></div>
  `).join("");
}

function renderModules(items) {
  document.getElementById("moduleList").innerHTML = items.map((item) => `
    <article class="module-card">
      <div class="module-top">
        <h3>${item.name}</h3>
        <div class="module-score">
          <span class="badge" style="background:${healthColor(item.health)}">健 ${item.health}</span>
          <span class="badge" style="background:${riskColor(item.risk)}">險 ${item.risk}</span>
        </div>
      </div>
      <div class="meter" aria-hidden="true"><span style="width:${item.health}%; background:${healthColor(item.health)}"></span></div>
      <div class="meter" aria-hidden="true"><span style="width:${item.risk}%; background:${riskColor(item.risk)}"></span></div>
      <div class="module-meta">
        <span>權重 ${item.weight}%</span>
        <span>${item.note}</span>
      </div>
    </article>
  `).join("");
}

function renderMatrix(health, risk) {
  const active = getQuadrant(health, risk).key;
  const cells = [
    ["ideal", "健康高、風險低", "多頭健康，正常配置。", colorMap.green],
    ["hot", "健康高、風險高", "強勢偏熱，避免追高。", colorMap.yellow],
    ["repair", "健康低、風險低", "修復觀察，等待轉強。", colorMap.orange],
    ["danger", "健康低、風險高", "防守優先，控制下行。", colorMap.red]
  ];
  document.getElementById("matrix").innerHTML = cells.map(([key, title, text, color]) => `
    <div class="matrix-cell ${key === active ? "is-active" : ""}" style="--active:${color}">
      <strong>${title}</strong>
      <span>${text}</span>
    </div>
  `).join("");
}

function renderHistory() {
  const recent = currentRows().slice(-7).reverse();
  document.getElementById("historyList").innerHTML = recent.map((day) => {
    const score = compositeScore(day);
    const signal = getSignal(score);
    const isSelected = day.date === selectedDate;
    return `
      <article class="history-item">
        <time>${day.date}</time>
        <div class="history-signal">
          <span class="dot" style="background:${colorMap[signal.key]}"></span>
          <strong>${score}</strong>
          <span>${signal.title}</span>
        </div>
        <button type="button" data-date="${day.date}" ${isSelected ? "disabled" : ""}>查看</button>
      </article>
    `;
  }).join("");

  document.querySelectorAll("[data-date]").forEach((button) => {
    button.addEventListener("click", () => renderDashboard(button.dataset.date));
  });
}

function initTabs() {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab-button").forEach((item) => item.classList.remove("is-active"));
      document.querySelectorAll(".tab-panel").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      document.getElementById(`tab-${button.dataset.tab}`).classList.add("is-active");
      renderAll();
    });
  });
}

function initTrendControls() {
  resetTrendControls();
  document.getElementById("startRange").addEventListener("input", (event) => {
    chartStartIndex = Math.min(Number(event.target.value), chartEndIndex - 7);
    event.target.value = chartStartIndex;
    renderTrend();
  });
  document.getElementById("endRange").addEventListener("input", (event) => {
    chartEndIndex = Math.max(Number(event.target.value), chartStartIndex + 7);
    event.target.value = chartEndIndex;
    renderTrend();
  });
  document.querySelectorAll(".chart-mode").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".chart-mode").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      chartMode = button.dataset.mode;
      renderTrend();
    });
  });
}

function resetTrendControls() {
  const start = document.getElementById("startRange");
  const end = document.getElementById("endRange");
  const max = currentRows().length - 1;
  start.max = max;
  end.max = max;
  start.value = chartStartIndex;
  end.value = chartEndIndex;
}

function valueForChart(day) {
  if (chartMode === "risk") return weightedScore(day, "risk");
  if (chartMode === "composite") return compositeScore(day);
  return weightedScore(day, "health");
}

function renderTrend() {
  const rows = currentRows().slice(chartStartIndex, chartEndIndex + 1);
  const values = rows.map(valueForChart);
  const latest = rows[rows.length - 1];
  const high = Math.max(...values);
  const low = Math.min(...values);
  const avg = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  const latestSignal = getSignal(compositeScore(latest));

  document.getElementById("startDateLabel").textContent = formatDate(rows[0].date);
  document.getElementById("endDateLabel").textContent = formatDate(latest.date);
  document.getElementById("rangeHigh").textContent = high;
  document.getElementById("rangeLow").textContent = low;
  document.getElementById("rangeAvg").textContent = avg;
  document.getElementById("rangeSignal").textContent = latestSignal.title;
  drawChart(rows);
}

function drawChart(rows) {
  const svg = document.getElementById("scoreChart");
  const width = 920;
  const height = 360;
  const pad = { top: 24, right: 28, bottom: 42, left: 48 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const yFor = (score) => pad.top + (100 - score) / 100 * innerH;
  const xFor = (index) => pad.left + index / Math.max(rows.length - 1, 1) * innerW;
  const points = rows.map((day, index) => `${xFor(index).toFixed(1)},${yFor(valueForChart(day)).toFixed(1)}`);
  const area = `${pad.left},${pad.top + innerH} ${points.join(" ")} ${pad.left + innerW},${pad.top + innerH}`;
  const grid = [0, 25, 50, 75, 100].map((score) => {
    const y = yFor(score);
    return `<line x1="${pad.left}" x2="${pad.left + innerW}" y1="${y}" y2="${y}" stroke="#dfe4ea" />
      <text class="axis-label" x="12" y="${y + 4}">${score}</text>`;
  }).join("");
  const first = rows[0];
  const last = rows[rows.length - 1];
  const latestValue = valueForChart(last);
  const chartTitle = chartMode === "risk" ? "回檔風險度" : chartMode === "composite" ? "綜合分" : "多頭健康度";
  const stroke = chartMode === "risk" ? riskColor(latestValue) : healthColor(latestValue);

  svg.innerHTML = `
    <rect class="signal-band" x="${pad.left}" y="${yFor(100)}" width="${innerW}" height="${yFor(75) - yFor(100)}" fill="${colorMap.green}"></rect>
    <rect class="signal-band" x="${pad.left}" y="${yFor(75)}" width="${innerW}" height="${yFor(50) - yFor(75)}" fill="${colorMap.yellow}"></rect>
    <rect class="signal-band" x="${pad.left}" y="${yFor(50)}" width="${innerW}" height="${yFor(25) - yFor(50)}" fill="${colorMap.orange}"></rect>
    <rect class="signal-band" x="${pad.left}" y="${yFor(25)}" width="${innerW}" height="${yFor(0) - yFor(25)}" fill="${colorMap.red}"></rect>
    ${grid}
    <polygon class="trend-area" points="${area}"></polygon>
    <polyline class="trend-line" points="${points.join(" ")}" style="stroke:${stroke}"></polyline>
    <circle class="trend-dot" cx="${xFor(rows.length - 1)}" cy="${yFor(latestValue)}" r="6" stroke="${stroke}"></circle>
    <text class="axis-label" x="${pad.left}" y="${height - 12}">${first.date}</text>
    <text class="axis-label" text-anchor="end" x="${pad.left + innerW}" y="${height - 12}">${last.date}</text>
    <text class="chart-note" text-anchor="end" x="${pad.left + innerW}" y="20">${currentAsset().symbol} · ${chartTitle} ${latestValue} / 100</text>
  `;
}

function initNewsControls() {
  const input = document.getElementById("newsDate");
  input.min = START_DATE;
  input.max = TODAY;
  input.value = TODAY;
  input.addEventListener("change", renderNews);
}

function renderNews() {
  const date = document.getElementById("newsDate").value || TODAY;
  const day = getDay(date);
  const health = weightedScore(day, "health");
  const risk = weightedScore(day, "risk");
  const score = compositeScore(day);
  const signal = getSignal(score);
  const items = findNews(date);
  const tone = items.reduce((sum, item) => sum + item.impact, 0);
  const strongest = day.modules.slice().sort((a, b) => b.health - a.health)[0];
  const weakest = day.modules.slice().sort((a, b) => b.risk - a.risk)[0];
  const title = tone >= 3 ? "新聞面提高基本面信心" : tone <= -2 ? "新聞面提醒風險升溫" : "新聞面中性偏觀望";

  document.getElementById("confidencePill").textContent = `${score}/100 · ${signal.title}`;
  document.getElementById("confidencePill").style.background = colorMap[signal.key];
  document.getElementById("confidenceTitle").textContent = title;
  document.getElementById("confidenceComment").textContent =
    `${currentAsset().symbol} 在 ${date} 的多頭健康度為 ${health}/100，回檔風險度為 ${risk}/100。最強支撐是 ${strongest.name}，最大壓力是 ${weakest.name}。新聞若偏基本面正向，會提高獲利續航信心；若偏估值、籌碼或宏觀負向，代表追價風險升高。`;
  document.getElementById("sourceStrip").innerHTML = sourceList.map((source) => `<span class="source-chip">${source}</span>`).join("");
  document.getElementById("newsList").innerHTML = items.map((item) => `
    <article class="news-card">
      <div class="news-meta"><time>${item.date}</time><span>${item.source}</span></div>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <span class="impact-badge" style="background:${item.impact >= 0 ? colorMap.green : colorMap.red}">${item.category} ${item.impact > 0 ? "+" : ""}${item.impact}</span>
    </article>
  `).join("");
}

function findNews(date) {
  const asset = currentAsset();
  return newsEvents
    .filter((event) => event.assets.includes(asset.id))
    .map((event) => ({ ...event, distance: Math.abs(daysBetween(event.date, date)) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5)
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));
}

function renderBacktest() {
  const rows = currentRows();
  const samples = rows.slice(0, -20);
  const bySignal = signalRules.map((rule) => {
    const signalRows = samples.filter((day) => getSignal(compositeScore(day)).key === rule.key);
    const returns = signalRows.map((day) => forwardReturn(day.date, 20));
    return {
      rule,
      count: signalRows.length,
      avgReturn: average(returns),
      winRate: returns.length ? returns.filter((value) => value > 0).length / returns.length : 0,
      maxDrawdown: signalRows.length ? Math.min(...signalRows.map((day) => maxForwardDrawdown(day.date, 20))) : 0
    };
  });

  const orangeOrWorse = samples.filter((day) => compositeScore(day) < 62);
  const next20Drawdowns = orangeOrWorse.map((day) => maxForwardDrawdown(day.date, 20));
  const avgWarningDrawdown = average(next20Drawdowns);
  const hitRate = next20Drawdowns.length ? next20Drawdowns.filter((value) => value <= -0.05).length / next20Drawdowns.length : 0;

  document.getElementById("backtestGrid").innerHTML = `
    <div class="backtest-card"><span>標的</span><strong>${currentAsset().symbol} ${currentAsset().name}</strong></div>
    <div class="backtest-card"><span>樣本期間</span><strong>${START_DATE} 至 ${TODAY}</strong></div>
    <div class="backtest-card"><span>橘燈以下 20 日平均最大回檔</span><strong>${formatPct(avgWarningDrawdown)}</strong></div>
    <div class="backtest-card"><span>橘燈以下命中 -5% 回檔率</span><strong>${formatPct(hitRate)}</strong></div>
  `;
  document.getElementById("eventList").innerHTML = bySignal.map((item) => `
    <article class="event-card">
      <div class="event-top">
        <h3>${item.rule.title}</h3>
        <span class="impact-badge" style="background:${colorMap[item.rule.key]}">${item.count} 天</span>
      </div>
      <p>未來 20 日平均報酬 ${formatPct(item.avgReturn)}，勝率 ${formatPct(item.winRate)}，最大回檔樣本 ${formatPct(item.maxDrawdown)}。</p>
    </article>
  `).join("");
}

function forwardReturn(date, horizon) {
  const rows = currentRows();
  const index = rows.findIndex((day) => day.date === date);
  return rows.slice(index + 1, index + horizon + 1).reduce((sum, row) => sum + row.syntheticReturn / horizon, 0);
}

function maxForwardDrawdown(date, horizon) {
  const rows = currentRows();
  const index = rows.findIndex((day) => day.date === date);
  let equity = 1;
  let peak = 1;
  let maxDd = 0;
  rows.slice(index + 1, index + horizon + 1).forEach((row) => {
    equity *= 1 + row.syntheticReturn / 20;
    peak = Math.max(peak, equity);
    maxDd = Math.min(maxDd, equity / peak - 1);
  });
  return maxDd;
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatPct(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function renderAll() {
  renderDashboard(selectedDate);
  renderTrend();
  renderNews();
  renderBacktest();
}

document.getElementById("todayButton").addEventListener("click", () => {
  selectedDate = TODAY;
  renderDashboard(TODAY);
});

initAssets();
initTabs();
initTrendControls();
initNewsControls();
renderAll();
