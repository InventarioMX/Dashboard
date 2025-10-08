/**
 * Aplicação principal do Dashboard
 */

// Instância global do dashboard manager
let dashboardManager;

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Inicializando Dashboard...');

  const popup = document.getElementById("popup");
  popup.style.display = "flex";

  // Inicializa o dashboard manager
  dashboardManager = new DashboardManager();
  // Inicializa o download manager
  // downloadManager = new SecureDownloadManager();

  // Configura observador de filtros
  dashboardManager.onFilterChange((allFilters, oldFilters, changeType) => {
    updateUI(allFilters);

    dashboardManager.applyFilters((originalData, currentFilters, ordem, chartId) => {
      return applyFiltersToData(originalData, currentFilters, ordem, chartId);
    });

    setTimeout(() => {
      updateTables();
    }, 800);
  });

  // Renderiza gráficos após um pequeno delay
  setTimeout(() => {
    dashboardManager.renderAll();

    // Configura event listeners
    setupEventListenersDefalt(); 

    const params = new URLSearchParams(window.location.search);
    if (params.get("wh")) {
      document.getElementById(params.get("wh")).click()

      const url = new URL(window.location.href);
      url.searchParams.delete('wh');

      const urlcerta = {"C820_L":"MX","C820_J":"CE","C820_R":"REC","C820_G":"GRV" }
      window.history.pushState({}, "", `${url.href}${urlcerta[params.get("wh")]}`);
    }
    
    console.log('✅ Dashboard inicializado com sucesso!');
  }, 200);

});

function setupEventListenersDefalt(){
  const plantas = document.querySelectorAll('[id^="C820_"]');
  plantas.forEach((plants) => {
    plants.addEventListener('click', (e) => {
      document.getElementById('plant_btn').textContent = e.target.parentNode.querySelector('.card-title').textContent;
      const valorSelecionado = e.target.closest('input');
      if(dashboardManager.filters["Warehouse"] !== valorSelecionado.id){
        dashboardManager.setFilters({"Warehouse":valorSelecionado.id});
        updateHeads()
      }
      plantas.forEach((plant) => {
        plant.checked = false;
      });
      valorSelecionado.checked = true;
    });
  });
};

/**
 * Muda o tipo de um gráfico
 */
function changeChartType(chartId, newType) {
  const chart = dashboardManager.getChart(chartId);
  if (chart) {
    chart.changeType(newType);
  }
}

/**
 * Atualiza a interface do usuário
 */
function updateUI(filters) {
  const clickFilters = dashboardManager.getClickFilters();
  updateClickFiltersUI(clickFilters);
}

/**
 * Atualiza a UI dos filtros de clique
 */
function updateClickFiltersUI(clickFilters) {

  document.querySelectorAll('[id^="filter-clear-"]').forEach(element => {
    element.innerHTML = '';
  });

  const clearall = document.getElementById(`clearAllFiltersBtn`);

  if (Object.keys(clickFilters).length === 0) {
    clearall.style.display = 'none';
    return;
  }

  clearall.style.display = 'block';

  Object.entries(clickFilters).forEach(([filterKey, value]) => {
    const chartId = filterKey;
    const icon = document.getElementById(`filter-clear-${chartId}`);
    icon.innerHTML = `
      <i class="tim-icons text-info icon-filter-remove" onclick="clearClickFilter('${chartId}')"></i>
    `;
  });
}

const btnsair = document.getElementById("sair");
const formLogin = document.getElementById("Form_Login");
const popup = document.getElementById("popup");
const telaLogin = document.getElementById("tela_login");
const telaDash = document.getElementById("tela_dash");
const loginMessage = document.getElementById('loginMessage');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
let loginverifi = false;

formLogin.addEventListener("submit", async function(e) {
  e.preventDefault();

  const usuario = usernameInput.value.trim();
  const senha = passwordInput.value;

  LoadingState('show');

  try {
    await authManager.login(usuario, senha);
    await initializeDashboard(loginverifi);
    loginverifi = true;

    showNotification('Sessão iniciada com sucesso!', 'success');
  } catch (error) {
    LoadingState('hide');
    usernameInput.value = "";
    passwordInput.value = "";
    usernameInput.focus();
    showNotification(`Error: ${error.mesage}`,`danger`)
  }
});

btnsair.addEventListener("click", async function() {
  try {
    LoadingState('show');
    await authManager.logout();
    LoadingState('hide');
  } catch (error) {
    showNotification(`Error: ${error.mesager}`,`danger`)
  }
});

/**
 * Remove filtro de clique específico
 */
function clearClickFilter(chartId) {
  dashboardManager.clearClickFilter(chartId);
}

// Torna funções disponíveis globalmente para uso inline
window.clearClickFilter = clearClickFilter;
window.changeChartType = changeChartType;
