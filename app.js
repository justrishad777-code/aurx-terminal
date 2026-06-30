/**
 * RTV Market Terminal - Core Application Controller
 * Manages view routing, interactive charts and cache cleanup operations.
 */

// Application Operational States
const chartState = {
    interval: "D",
    style: "1",      // 1 = Candle Chart, 3 = Area Chart
    showDraw: false  
};

let isChartInitialized = false;

/**
 * Destroys existing instance and renders a clean TradingView chart frame
 */
function renderDynamicChart() {
    const wrapper = document.getElementById('dynamic-chart-wrapper');
    wrapper.innerHTML = ''; // Enforce structural wipe

    const container = document.createElement('div');
    container.id = "tv_dynamic_container";
    container.style.height = "100%";
    container.style.width = "100%";
    wrapper.appendChild(container);

    new TradingView.widget({
        "autosize": true,
        "symbol": "OANDA:XAUUSD",
        "interval": chartState.interval,
        "timezone": "Asia/Dhaka",
        "theme": "dark",
        "style": chartState.style,
        "locale": "en",
        "enable_publishing": false,
        "backgroundColor": "#000000",
        "gridColor": "rgba(255, 255, 255, 0.04)",
        "hide_top_toolbar": true,
        "hide_side_toolbar": !chartState.showDraw, 
        "hide_legend": true,
        "allow_symbol_change": false,
        "save_image": false,
        "container_id": "tv_dynamic_container"
    });
}

/**
 * Toggles structural visibility of the timeframe selection overlay modal
 */
function toggleTimeframeMenu() {
    document.getElementById('tf-dropdown').classList.toggle('is-visible');
}

/**
 * Mutates chart resolution interval state and triggers frame re-render
 */
function applyTimeframe(intervalCode, label, element) {
    chartState.interval = intervalCode;
    
    document.getElementById('current-tf-label').innerText = label;
    
    document.querySelectorAll('.tf-option').forEach(opt => opt.classList.remove('is-active'));
    element.classList.add('is-active');
    
    document.getElementById('tf-dropdown').classList.remove('is-visible');
    renderDynamicChart();
}

/**
 * Mutates peripheral toolbar options (Drawing utilities & structural types)
 */
function updateChartSetting(actionType, value, element) {
    if (actionType === 'style') {
        chartState.style = chartState.style === "1" ? "3" : "1";
        element.classList.toggle('is-selected');
    }
    else if (actionType === 'draw') {
        chartState.showDraw = !chartState.showDraw;
        element.classList.toggle('is-selected');
    }
    renderDynamicChart();
}

/**
 * Core Navigation Router for Module Transitions
 */
function routeTo(viewId, headerTitle, triggerElement) {
    document.querySelectorAll('.view-module').forEach(view => {
        view.classList.remove('is-active');
    });
    document.getElementById(viewId).classList.add('is-active');

    document.querySelectorAll('.nav-action').forEach(btn => {
        btn.classList.remove('is-active');
    });
    triggerElement.classList.add('is-active');
    
    const globalHeader = document.getElementById('globalHeader');
    const mainWorkspace = document.getElementById('mainWorkspace');

    if (viewId === 'view-terminal') {
        globalHeader.style.display = 'none';
        mainWorkspace.style.padding = '0';
        
        if (!isChartInitialized) {
            renderDynamicChart();
            isChartInitialized = true;
        }
    } else {
        globalHeader.style.display = 'flex';
        document.getElementById('header-title').innerText = headerTitle;
        mainWorkspace.style.padding = '10px 15px 130px 15px';
    }
}

/**
 * Controls structural state changes for reactive interactive monogram
 */
function toggleBranding(element) {
    element.classList.toggle('is-expanded');
    if(element.classList.contains('is-expanded')) {
        setTimeout(() => {
            element.classList.remove('is-expanded');
        }, 3000);
    }
}

/**
 * Purges memory storage layers and triggers application force reload
 */
function performSystemCleanup() {
    if (window.confirm("Perform cache purge? This clear temporary system buffers.")) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload(true);
    }
}

// Dynamically Injecting Functional Cleaners into Workspace Menu Component
document.addEventListener("DOMContentLoaded", () => {
    const settingsContainer = document.querySelector('.settings-menu');
    if(settingsContainer) {
        settingsContainer.innerHTML = `
            <li class="settings-item" onclick="performSystemCleanup()">
                <span class="settings-icon">🧹</span> Clear System Cache
            </li>
            <li class="settings-item" onclick="alert('RTV Terminal Environment v1.0.0 is running stably.')">
                <span class="settings-icon">ℹ️</span> Core Engine Info
            </li>
        `;
    }
});
