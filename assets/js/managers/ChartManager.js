/**
 * ChartManager - Classe para gerenciar gráficos individuais do Chart.js
 */
class ChartManager {
  constructor(id, type, data, options = {}, onClickCallback = null, gradientColor) {
    this.id = id;
    this.type = type;
    this.data = data;
    this.chart = null;
    this.canvas = null;
    this.onClickCallback = onClickCallback;
    this.gradientColor = gradientColor;
    this.options = {
      onClick: (event, elements) => this.handleClick(event, elements),
      onHover: (event, chartElements) => {
        if (chartElements.length > 0) {
          event.target.style.cursor = 'pointer';
        } else {
          event.target.style.cursor = 'default';
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
      },
      ...options,
      plugins: {
        datalabels: {
          color: 'rgba(255, 255, 255, 0.8)',
          anchor: 'end',
          align: 'top',
          font: {
            size: 25,
          },
          formatter: (value) => `${value.toLocaleString('pt-BR')}`,
        },
        ...options.plugins,
      },
      legend: {
        ...options.legend,
        onClick: (event, legendItem) => {
          this.legendClick(event, legendItem),
          event.target.style.cursor = 'pointer';
        },
        onHover: (event, legendItem) => {
          if (legendItem.text.length > 0) {
            event.target.style.cursor = 'pointer';
          } else {
            event.target.style.cursor = 'default';
          }
        },
        
      }
    };
  }

  /**
   * Manipula cliques nos elementos do gráfico
   */
  legendClick(event, legendItem){
    if (legendItem.text) {
      // Chama o callback com o ID do gráfico e o valor clicado
      this.onClickCallback(this.id, legendItem.text, {});
    }
  }
  handleClick(event, elements) {
    if (elements.length > 0 && this.onClickCallback) {
      const element = elements[0];
      const datasetIndex = element._datasetIndex;
      const index = element._index;

      // Obtém o título/label da coluna clicada
      let clickedValue = null;
      
      if (this.data.labels && this.data.labels[index]) {
        clickedValue = this.data.labels[index];
      } else if (this.data.datasets && this.data.datasets[datasetIndex]) {
        clickedValue = this.data.datasets[datasetIndex].label || `Dataset ${datasetIndex}`;
      }

      if (clickedValue) {
        // Chama o callback com o ID do gráfico e o valor clicado
        this.onClickCallback(this.id, clickedValue, {
          datasetIndex,
          index,
          element,
          event,
          chartData: this.data
        });
      }
    }
  }

  /**
   * Define callback para cliques
   */
  setOnClickCallback(callback) {
    this.onClickCallback = callback;
    if (this.chart) {
      this.chart.options.onClick = (event, elements) => this.handleClick(event, elements);
      this.chart.update('none');
    }
  }

  /**
   * Renderiza o gráfico no elemento canvas
   */
  render() {
    const canvas = document.getElementById(this.id);
    if (!canvas) {
      console.error(`Canvas element with id '${this.id}' not found`);
      return;
    }

    this.canvas = canvas;
    const ctx = canvas.getContext('2d');

    if (this.gradientColor) {
      const gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
      const colors = {
        Azul: ['rgba(29,140,248,0)', 'rgba(29,140,248,0.0)', 'rgba(29,140,248,0.2)'],
        Verde: ['rgba(66,134,121,0)', 'rgba(66,134,121,0.0)', 'rgba(66,134,121,0.2)']
      };
      colors[this.gradientColor]?.forEach((color, i) => gradientStroke.addColorStop((i==1?0.2:i==2?1:0), color));
      this.data.datasets[0].backgroundColor = gradientStroke;
    }

    // Destroi gráfico existente se houver
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: this.type,
      data: this.data,
      options: this.options
    });

    return this.chart;
  }

  /**
   * Atualiza os dados do gráfico
   */
  updateData(newData) {
    if (!this.chart) {
      console.error('Chart not initialized. Call render() first.');
      return;
    }
    this.data = newData;
    this.chart.data = newData;
  }

  /**
   * Muda o tipo do gráfico
   */
  changeType(newType) {
    if (!this.chart) {
      console.error('Chart not initialized. Call render() first.');
      return;
    }
    
    this.type = newType;
    this.chart.config.type = newType;
    this.options = {...this.options, ...defaultChartConfigs[newType].options}
    this.chart.options = {...this.options, ...defaultChartConfigs[newType].options}

    this.render();
    // this.chart.update();
  }

  /**
   * Atualiza as opções do gráfico
   */
  updateOptions(newOptions) {
    if (!this.chart) {
      console.error('Chart not initialized. Call render() first.');
      return;
    }

    // Preserva o onClick handler personalizado
    const onClick = this.options.onClick;
    this.options = { ...this.options, ...newOptions, onClick };
    this.chart.options = this.options;
    this.chart.update();
  }

  /**
   * Destroi o gráfico
   */
  destroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  /**
   * Obtém dados do gráfico
   */
  getData() {
    return this.data;
  }

  /**
   * Obtém tipo do gráfico
   */
  getType() {
    return this.type;
  }

  /**
   * Obtém opções do gráfico
   */
  getOptions() {
    return this.options;
  }
}