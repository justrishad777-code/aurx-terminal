let chartState = { interval: "D", style: "1", showDraw: false };
let isChartInitialized = false;

function renderDynamicChart() {
    const wrapper = document.getElementById('dynamic-chart-wrapper');
    wrapper.innerHTML = '';
    const container = document.createElement('div');
    container.id = "tv_dynamic_container";
    container.style.height = "100%";
    container.style.width = "100%";
    wrapper.appendChild(container);

    new TradingView.widget({
        "autosize": true, "symbol": "OANDA:XAUUSD", "interval": chartState.interval,
        "theme": "dark", "style": chartState.style, "hide_top_toolbar": true,
        "hide_side_toolbar": !chartState.showDraw, "container_id": "tv_dynamic_container"
    });
}

function applyTimeframe(code, label, el) {
    chartState.interval = code;
    document.getElementById('current-tf-label').innerText = label;
    document.getElementById('tf-dropdown').classList.remove('is-visible');
    renderDynamicChart();
}

function updateChartSetting(type) {
    if(type === 'style') chartState.style = chartState.style === "1" ? "3" : "1";
    if(type === 'draw') chartState.showDraw = !chartState.showDraw;
    renderDynamicChart();
}

function routeTo(viewId, title, el) {
    document.querySelectorAll('.view-module').forEach(v => v.classList.remove('is-active'));
    document.getElementById(viewId).classList.add('is-active');
    
    document.querySelectorAll('.nav-action').forEach(b => b.classList.remove('is-active'));
    el.classList.add('is-active');

    const ws = document.getElementById('mainWorkspace');
    if (viewId === 'view-terminal') {
        document.getElementById('globalHeader').style.display = 'none';
        ws.style.padding = '0';
        ws.style.overflowY = 'hidden'; 
        if (!isChartInitialized) { renderDynamicChart(); isChartInitialized = true; }
    } else {
        document.getElementById('globalHeader').style.display = 'flex';
        ws.style.padding = '10px 15px 120px 15px';
        ws.style.overflowY = 'auto';
    }
}

function performSystemCleanup() {
    localStorage.clear();
    window.location.reload(true);
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector('.settings-menu').innerHTML = `
        <li class="settings-item" onclick="performSystemCleanup()">🧹 Clear Cache</li>
        <li class="settings-item">ℹ️ Version 1.0.0 Stable</li>
    `;
});
