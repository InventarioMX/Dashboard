document.addEventListener('DOMContentLoaded', async () => {
  await setupCharts();
});

let timeout;

async function update(){
  try {
    dashboardManager.setFilters();
    let data = await updateHeads();

    let btndate = document.querySelector('[id^="dia_"].active').id.split("_")[1];
    dashboardManager.setDate(parseInt(btndate));

    let [day, month, year, hours, minutes, seconds] = data.match(/\d+/g);

    let ciclo = 5 * 60 * 1000
    let UltimaAtualizacao = new Date(`${month}/${day}/${year} ${hours}:${minutes}:${seconds}`);
    let proximaAtualizacao = new Date(UltimaAtualizacao.getTime() + ciclo + 30000)

    const agora = new Date();
    const intervalo = Math.max((proximaAtualizacao - agora), 30000);
    const proxim = new Date(agora.getTime()+intervalo).toLocaleString('Pt-Br');
    console.log(`Proxima atualização: ${proxim}`)

    timeout = setTimeout(atualizarListaProdutos, intervalo);
  } catch (error) {
    console.error('Erro ao atualizar dados:', error);
    timeout = setTimeout(atualizarListaProdutos, 30000);
  }
}

async function updateTables() {
  try {
    const response = await fetch('/api/table', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dashboardManager.filters),
    });

    const data = await response.json();

    dashboardManager.updateTable('excelTable',data)

  } catch (error) {
    console.error('Erro ao atualizar heads:', error);
  }
}

/**
 * atualiza cabeçalho
 */
async function updateHeads() {
  try {
    const response = await fetch('/api/head', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dashboardManager.filters),
    });

    const data = await response.json();

    let pendRealize = Math.min(data.cap - data.gi_hoje, data.inprocess);
    pendRealize = pendRealize < 0 ? 0 : pendRealize;

    const porcentagemmeta = Math.round((data.gi_hoje / (pendRealize + data.gi_hoje)) * 100);

    data.gi_pending = pendRealize;

    Object.keys(data).forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.innerHTML = data[id].toLocaleString('pt-BR');
      }
    });

    dashboardManager.valocimetro.chart.data.datasets[0].data = [porcentagemmeta, 100 - porcentagemmeta];
    dashboardManager.valocimetro.chart.update();
    dashboardManager.updatecapa(data.cap)

    return data.lastatu;
  } catch (error) {
    console.error('Erro ao atualizar heads:', error);
    return error;
  }
}

/**
 * Configura todos os gráficos do dashboard
 */
async function setupCharts() {
  dashboardManager.addChart(
    'Shipping_Type',
    'line',
    {
      labels: ['M02','P03','P04','T01'],
      datasets: [{
        label: "Itens",
        fill: true,
        backgroundColor: 'rgba(66,134,121,0.2)',
        borderColor: '#00f2c3',
        borderWidth: 2,
        pointBackgroundColor: '#00f2c3',
        pointBorderColor: 'rgba(255,255,255,0)',
        pointRadius: 5,
        data: Array(4).fill().map(() => 0),
      }],
    },
    {
      ...defaultChartConfigs.line.options,
      plugins: {
        ...defaultChartConfigs.line.options.plugins,
      }
    },
    "Verde"
  );
  
  dashboardManager.addChart(
    'Status',
    'bar',
    {
      labels: ["W.Pre-Visit","W.Booking","P.Ship","W.Allocation","Allocation","Picking","Pick Send","With NF","Print","Checking","Mv. Dock","Mf.Created","Loading"],
      datasets: [{
        label:"Itens",
        fill: true,
        backgroundColor:"rgba(31, 143, 241, 0.05)",
        borderColor: '#1f8ef1',
        borderColor: ['#033f74ff', '#033f74ff', '#033f74ff', '#1f8ef1', '#1f8ef1', '#1f8ef1', '#1f8ef1', '#1f8ef1', '#1f8ef1', '#1f8ef1', '#1f8ef1', '#1f8ef1', '#1f8ef1'],
        borderWidth: 2,
        data: Array(13).fill().map(() => 0),
      }]
    },
    {
      ...defaultChartConfigs.bar.options,
    },
    "Azul"
  );

  dashboardManager.addChart(
    'Division',
    'horizontalBar',
    {
      labels: ['A/C','SVC','WM','ACS','REF','A/V','MON','MEM','LAV','NPC','CTV','VC','HHP','TBL','DA'],
      datasets: [{
        label: "Itens",
        fill: true,
        backgroundColor: "rgba(0, 242, 194, 0.02)",
        borderColor: '#1f8ef1',
        borderWidth: 2,
        data: Array(15).fill().map(() => 0),
      }]
    },
    {
      ...defaultChartConfigs.horizontalBar.options,
    },
    "Azul"
  );

  dashboardManager.addChart(
    'DO_Type',
    'doughnut',
    {
      labels: ['MONO','MULTI'],
      datasets: [{
        label: "Itens",
        borderColor: ["#00f2c3","#1f8ef1"],
        fill: true,
        backgroundColor: ["rgba(0, 242, 194, 0.05)","rgba(31, 143, 241, 0.05)"],
        borderWidth: 3,
        data: Array(2).fill().map(() => 0),
      }]
    },
    {
      ...defaultChartConfigs.doughnut.options,
      plugins: {
        ...defaultChartConfigs.doughnut.options.plugins,
        datalabels: {
          color: 'rgba(255, 255, 255, 0.8)',
          anchor: 'center',
          align: 'center',
          font: {
            size: 20,
          },
          formatter: (value) => `${value.toLocaleString('pt-BR')}`,
        },
      },
    }
  );

  dashboardManager.addChart(
    'DO_Date',
    'line',
    {
      labels: ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"], 
      datasets: [{
        label: "Itens",
        fill: true,
        backgroundColor:"rgba(46, 191, 249, 0.02)",
        borderColor: '#2EC0F9',
        borderWidth: 2,
        pointBackgroundColor: "#2EC0F9",
        pointBorderColor: 'rgba(255,255,255,0)',
        pointRadius: 5,
        data: Array(24).fill().map(() => 0),
        spanGaps: true
      },
      {
        label: "Cap",
        fill: true,
        backgroundColor: "transparent",
        borderColor: 'rgba(199, 33, 33, 0.88)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(199, 33, 33, 0.88)',
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverRadius: 0,
        pointRadius: 0,
        data: [],
        type: "line",
        datalabels: {
          display: false,
        },
      }]
    },
    {
      ...defaultChartConfigs.line.options,
      plugins: {
        ...defaultChartConfigs.line.options.plugins,
      }
    },
    "Azul"
  );

  // cria grafico idependente
  dashboardManager.valocimetro = new ChartManager(
    'Velocimetro',
    'doughnut',
    {
      labels: ['Atingido', 'Faltante'],
      datasets: [{
        borderColor: ["#00f2c3","rgba(0, 242, 194, 0.04)"],
        pointBorderColor: "#FFF",
        pointBackgroundColor: "#f96332",
        pointBorderWidth: 2,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 1,
        pointRadius: 4,
        backgroundColor: ["#00f2c3","rgba(0, 242, 194, 0.05)"],
        borderWidth: 3,
        data: [0,100],
      }],
    },
    {
      ...defaultChartConfigs.velocimetro.options,
    }
  );
  dashboardManager.valocimetro.render();
  dashboardManager.addTable('excelTable', []);
}

/**
 * Configura event listeners para controles da UI
 */
function setupEventListeners() {
  const labels_dia = document.querySelectorAll('label[id^="dia_"]');
  labels_dia.forEach((label) => {
    label.addEventListener('click', (e) => {
      const valorSelecionado = parseInt(e.target.closest('label').id.split("_")[1]);
      dashboardManager.setDate(valorSelecionado);
    });
  });

  const labels_pgi = document.querySelectorAll('label[id^="pgi_"]');
  labels_pgi.forEach((label) => {
    label.addEventListener('click', (e) => {
      const valorSelecionado = parseInt(e.target.closest('label').id.split("_")[1]);
      if(dashboardManager.setPGI(valorSelecionado)){
        setTimeout(() => {
          e.target.closest('label').classList.remove('active');
        },100);
      }
    });
  });

  document.getElementById('clearAllFiltersBtn').addEventListener('click', () => {
    dashboardManager.clearFilters(false);
  });

  // recize muda tipo
  const mobileQuery = window.matchMedia("(max-width: 768px)");
  let graficos_mobile = ['Status','DO_Date']
  let tipo_original = {'Status':'bar','DO_Date':'line'}
  function verificarDispositivo(e) {
    if (e.matches) {
      for (const [id, chart] of dashboardManager.charts) {
        if (graficos_mobile.includes(id)){
          chart.changeType('horizontalBar')
        }
      }
      document.querySelectorAll(".chart-area-desc").forEach(el => {
        el.classList.remove("chart-area-desc");
        el.classList.add("chart-area-mob");
      })
      console.log('mobile')
    } else {
      for (const [id, chart] of dashboardManager.charts) {
        if (graficos_mobile.includes(id)){
          chart.changeType(tipo_original[id])
        }
      }
      document.querySelectorAll(".chart-area-mob").forEach(el => {
        el.classList.add("chart-area-desc");
        el.classList.remove("chart-area-mob");
      })
      console.log('desktop')
    }
  }
  verificarDispositivo(mobileQuery);
  mobileQuery.addEventListener("change", verificarDispositivo);
}

async function applyFiltersToData(originalData, filters, ordem, chartId) {
  let chartdata = originalData
  let novosdados = await fetchData(chartId, filters, ordem);

  const chartsignore = ["Division"];

  for (const id of chartId) {
    if (chartsignore.includes(id)){
      chartdata[id].labels = novosdados[0][id].map(item => item.x);
      chartdata[id].datasets[0].data = novosdados[0][id].map(item => item.y);
    } else{
      const mapaNovosDados = novosdados[0][id] ? new Map(novosdados[0][id].map(item => [item.x, item.y])) : new Map();
      const mapaDados = new Map();

      chartdata[id].labels.forEach(item => {
        mapaDados.set(item, mapaNovosDados.get(item) || 0);
      });

      if (novosdados[0][id]) {
        novosdados[0][id].forEach(novoDado => {
          if (!mapaDados.has(novoDado.x)) {
            mapaDados.set(novoDado.x, novoDado.y);
          }
        });
      }

      chartdata[id].labels = Array.from(mapaDados, ([x, y]) => x);
      chartdata[id].datasets[0].data = Array.from(mapaDados, ([x, y]) => y);
    }
  }

  return chartdata;
}

async function fetchData(column, filtros, ordem) {
  try {
    const response = await fetch(`/api/graph`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({column,filtros, ordem})
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erro ao buscar dados: ${error}`);
    return null;
  }
}

// async function fetchData(column, filtros, ordem) {
//   try {
//     const formData = new FormData();
//     formData.append('acao', 'graph');
//     formData.append('column', column);
//     formData.append('filtros', JSON.stringify(filtros));
//     formData.append('ordem', JSON.stringify(ordem));

//     const response = await fetch(`${authManager.baseUrl}`, {
//       method: "POST",
//       body: formData
//     });
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error(`Erro ao buscar dados: ${error}`);
//     return null;
//   }
// }