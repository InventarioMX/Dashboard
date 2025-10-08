/**
 * DashboardManager - Gerencia múltiplos gráficos e filtros
 */
class DashboardManager {
  constructor() {
    this.date = this.getDate();
    this.charts = new Map();
    this.tables = new Map();
    this.ordem = {
      'Status': ["W.Pre-Visit","CARR_ID Incorreto","P.Ship","W.Booking","W.Allocation","Allocation","Picking","Pick Send","With NF","Print","Checking","Mv. Dock","Mf.Created","Loading","GI"],
      'Division': {alvo:'y', sort:'DESC'}
    };
    this.filters = {
      'DO_Date': this.getDate(),
      'Warehouse': 'C820_L',
      'Storage_Location': {op:'<>', valor:'FCBA'}
    };
    this.filterCallbacks = [];
    this.clickFilters = {}; // Filtros criados por cliques nos gráficos
  }

  setPGI = (d = 0) => {
    let data = new Date();
    let formattedDate = data.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
    let retorno;
    let valor;
    let op;

    switch (d) {
      case -1:
        op = '<';
        break;
      case 0:
        formattedDate = `${formattedDate}%`
        op = 'LIKE';
        break;
      case 1:
        data.setDate(data.getDate() + d);
        formattedDate = data.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
        op = '>=';
        break;
      default:
        console.log("Dia inválido");
        return;
    }
    
    valor = { op, valor: formattedDate };

    if (JSON.stringify(this.filters.PGI_Date) === JSON.stringify(valor)) {
      delete this.filters.PGI_Date;
      retorno = true;
    } else {
      this.filters.PGI_Date = valor;
      retorno = false;
    }

    this.filterCallbacks.forEach(callback => {
      callback(this.filters, {}, 'click');
    });
    return retorno
  };

  setDate = (d = 0) => {
    let data = new Date();
    data.setDate(data.getDate() + d);
    data = data.toLocaleDateString('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit'})
    
    if(this.filters.DO_Date == data){
      return;
    } else {
      if (!this.clickFilters.DO_Date) {
        this.filters.DO_Date = data
      } else {
        this.filters.DO_Date = `${data} ${this.clickFilters.DO_Date.split(":")[0]}`
      }
    }

     // Notifica callbacks sobre mudança de filtros
      this.filterCallbacks.forEach(callback => {  
        callback(this.filters, {}, 'click');
      });
  };

  getDate = (d = 0) => {
    let data = new Date();
    data.setDate(data.getDate() + d);
    return data.toLocaleDateString('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit'});
  };

  /**
   * Adiciona um novo gráfico ao dashboard
   */
  addChart(id, type, data, options = {}, gradientColor) {
    // Callback para cliques no gráfico
    const onClickCallback = (chartId, clickedValue, clickInfo) => {
      this.handleChartClick(chartId, clickedValue, clickInfo);
    };

    const chartManager = new ChartManager(id, type, data, options, onClickCallback, gradientColor);
    this.charts.set(id, chartManager);
    return chartManager;
  }

  /**
   * Adiciona uma nova tabela ao dashboard
   */
  addTable(id, data) {
    const table = new Handsontable(document.getElementById(id), {
      data: data,
      height: 450,
      stretchH: 'all',
      wordWrap: false,
      filters: true,
      dropdownMenu: true,
      contextMenu: true,
      copyPaste: true,
      copyPaste: {
        copyColumnHeaders: true,
      },
      autoWrapRow: true,
      autoWrapCol: true,
      dropdownMenu: ['filter_by_condition', 'filter_by_value', 'filter_action_bar', '---------'],
      
      licenseKey: 'non-commercial-and-evaluation'
    });
    this.tables.set(id, table);
    table.addHook('beforeKeyDown', function(event) {
      if (event.ctrlKey && event.key === 'c') {
        table.getPlugin('copyPaste').copy('with-column-headers');
        event.stopImmediatePropagation();
      }
    });
    return table;
  }

  updateTable(id, newData) {
    const table = this.tables.get(id);
    try {
      if (table) {
        const colHeaders = Object.keys(newData[0]);
        table.loadData(newData);
        table.updateSettings({
          colHeaders: colHeaders
        });
        
      }
    } catch{
      table.loadData(newData);
    }
    
  }

  /**
   * Manipula cliques nos gráficos
   */
  handleChartClick(chartId, clickedValue, clickInfo) {
    // Cria um filtro baseado no clique
    const filterKey = `${chartId}`;

    if(filterKey === "DO_Date"){
      if (this.clickFilters[filterKey] === clickedValue) {
        delete this.clickFilters[filterKey];
        this.filters[filterKey] = this.filters[filterKey].split(" ")[0];
      } else {
        this.clickFilters[filterKey] = clickedValue;
        this.filters[filterKey] = `${this.filters[filterKey].split(" ")[0]} ${clickedValue.split(":")[0]}`;
      }

    } else {
      // Se já existe um filtro de clique para este gráfico, remove ou atualiza
      if (this.clickFilters[filterKey] === clickedValue) {
        // Se clicou no mesmo valor, remove o filtro
        delete this.clickFilters[filterKey];
        delete this.filters[filterKey];
      } else {
        // Adiciona/atualiza o filtro
        this.clickFilters[filterKey] = clickedValue;
        this.filters[filterKey] = clickedValue;
      }
    }
  
    // console.log(`Filtro criado: ${filterKey} = ${this.filters[filterKey]}`);
    
    // Notifica callbacks sobre mudança de filtros
    this.filterCallbacks.forEach(callback => {
      callback(this.filters, {}, 'click');
    });
  }

  /**
   * Remove um gráfico do dashboard
   */
  removeChart(id) {
    const chart = this.charts.get(id);
    if (chart) {
      chart.destroy();
      this.charts.delete(id);
      
      // Remove filtros de clique relacionados
      const filterKey = `${id}`;
      delete this.clickFilters[filterKey];
      delete this.filters[filterKey];
    }
  }

  /**
   * Obtém um gráfico específico
   */
  getChart(id) {
    return this.charts.get(id);
  }

  /**
   * Renderiza todos os gráficos
   */
  renderAll() {
    this.charts.forEach(chart => {
      chart.render();
    });
  }

  /**
   * Define filtros e atualiza gráficos automaticamente
   */
  setFilters(newFilters) {
    const oldFilters = { ...this.filters };
    
    // Preserva filtros de clique
    this.filters = { ...this.clickFilters, ...this.filters, ...newFilters };
    
    // Notifica callbacks sobre mudança de filtros
    this.filterCallbacks.forEach(callback => {
      callback(this.filters, oldFilters);
    });
  }

  /**
   * Limpa filtros (excluindo filtros de clique)
   */
  clearFilters(includeMainFilters = false) {
    const oldFilters = { ...this.filters };

    if (includeMainFilters) {
      this.filters = {};
      this.clickFilters = {};
    } else {
      // Remove filtros de clique
      Object.keys(this.clickFilters).forEach(key => {
        if(key === 'DO_Date'){
          this.filters[key] = this.date
        } else{
          delete this.filters[key];
        }
        
      });

      this.clickFilters = {};
    }

    // Notifica callbacks sobre mudança de filtros
    this.filterCallbacks.forEach(callback => {
      callback(this.filters, oldFilters);
    });
  }

  /**
   * Remove filtros de clique específicos
   */
  clearClickFilter(chartId) {
    const filterKey = `${chartId}`;
    if(filterKey === "DO_Date"){
      delete this.clickFilters[filterKey];
      this.filters[filterKey] = this.date;
    } else {
      delete this.clickFilters[filterKey];
      delete this.filters[filterKey];
    }
    
    // Notifica callbacks sobre mudança de filtros
    this.filterCallbacks.forEach(callback => {
      callback(this.filters, {}, 'clearClick');
    });
  }

  /**
   * Obtém filtros atuais
   */
  getFilters() {
    return { ...this.filters };
  }

  /**
   * Obtém apenas filtros de clique
   */
  getClickFilters() {
    return { ...this.clickFilters };
  }

  /**
   * Registra callback para mudanças de filtro
   */
  onFilterChange(callback) {
    this.filterCallbacks.push(callback);
  }

  /**
   * Aplica filtros a todos os gráficos
   */
  // async applyFilters(dataProcessor) {
  //   for (const [id, chart] of this.charts) {
  //     if (typeof dataProcessor === 'function') {
  //       const filteredData = await dataProcessor(chart.getData(), this.filters, this.ordem, id);
  //       chart.updateData(filteredData);
  //     }
  //   }
  //   this.refressview();
  // }
  async applyFilters(dataProcessor) {
    const data = {};
    const ids = [];
    for (const [id, chart] of this.charts) {
      ids.push(id);
      data[id] = chart.getData();
    }

    await dataProcessor(data, this.filters, this.ordem, ids);

    this.refressview();
  }

  updatecapa(capacidade){
    let chart = this.getChart('DO_Date');
    let data = chart.getData();
    let caphh = Math.round(capacidade/24);

    document.getElementById("CapHH").innerText = `${caphh}`;

    data.datasets[1].data = Array(24).fill().map(() => caphh)

    chart.updateData(data)
    chart.chart.update()

  }

  /**
   * atualiza todos graficos em simultaneo
   */

  refressview(){
    for (const [id, chart] of this.charts) {
      chart.chart.update();
    }
  }

  /**
   * Destroi todos os gráficos
   */
  destroyAll() {
    this.charts.forEach(chart => {
      chart.destroy();
    });
    this.charts.clear();
    this.clickFilters = {};
  }

  /**
   * Obtém estatísticas do dashboard
   */
  getStats() {
    return {
      totalCharts: this.charts.size,
      activeFilters: Object.keys(this.filters).length,
      clickFilters: Object.keys(this.clickFilters).length,
      chartTypes: Array.from(this.charts.values()).map(chart => chart.getType())
    };
  }
}