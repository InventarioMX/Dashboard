class ChartManager {
  constructor(chartId, type, data = {}, options = {},gradientcolor) {
    this.chartId = chartId;
    this.ctx = document.getElementById(chartId).getContext("2d");
    if (gradientcolor){
      switch (gradientcolor) {
        case "Azul":
          var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);
              gradientStroke.addColorStop(1,   'rgba(29,140,248,0.2)');
              gradientStroke.addColorStop(0.1, 'rgba(29,140,248,0.0)');
              gradientStroke.addColorStop(0,   'rgba(29,140,248,0)');
              data.datasets[0].backgroundColor = gradientStroke
          break;
        case "Verde":
          var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);
              gradientStroke.addColorStop(1, 'rgba(66,134,121,0.2)');
              gradientStroke.addColorStop(0.2, 'rgba(66,134,121,0.0)');
              gradientStroke.addColorStop(0, 'rgba(66,134,121,0)');
              data.datasets[0].backgroundColor = gradientStroke
          break;
      }
    }
    this.chart = new Chart(this.ctx,{
      type: type,
      data: data,
      options: {
        onClick: (event,elements) => this.handleClick(event,elements),
        maintainAspectRatio: false,
        responsive: true,
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
        animation: {
          duration: 2000,
        },
        legend: {
          display: false
        },
        ...options
      }
    });
    Dashboard.instances_chart.push(this);
  }
  handleClick(event,elements) {
    if (elements.length > 0) {
      const index = elements[0]._index;
      const label = this.chart.data.labels[index]
      if (Dashboard.chartFilters[this.chartId] === label) {
        delete Dashboard.chartFilters[this.chartId]
      } else {
        Dashboard.chartFilters[this.chartId] = label;
      }
      console.log(Dashboard.chartFilters);
    }
  }
}

class HeadManager{
  constructor(id,icon,description){
    this.ctx = document.getElementById(id);
    this.icon = icon;
    this.description = description;

    console.log(id,icon,description)
    this.ctx.innerHTML = (icon?icon:"") + (description?description:"");

    Dashboard.instances_head.push(this);
  }
  update(value){
    this.ctx.innerHTML = (this.icon?this.icon:"") + (this.description?this.description:"") + value.toLocaleString('pt-BR');
  }
}

const Dashboard = {

  data: {},
  data_charts:{},
  data_head:{},
  globalFilters: {},
  chartFilters: {},
  instances_chart: [],
  instances_head: [],

  initialize_charts(){

    var DataCap = {
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
        data: [78 , 22],
      }],
    }
    var OptionsCap = {
      animation: {
        duration: 1000, 
        animateScale: true,
        animateRotate: true,
        onComplete: function() {
          const chartInstance = this.chart;
          const ctx = chartInstance.ctx;
          const centerX = (chartInstance.chartArea.left + chartInstance.chartArea.right) / 2;
          const centerY = (chartInstance.chartArea.top + chartInstance.chartArea.bottom) / 1.35;

          ctx.save();
          ctx.font = '2.6625rem Poppins'; 
          ctx.fillStyle = 'white'; 
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const value = 78

          ctx.fillText(`${value}%`, centerX, centerY);
          ctx.restore();
        },
      },
      hover: {
        animationDuration: 0,
      },
      aspectRatio: 2.7,
      maintainAspectRatio: false,
      responsive: true,
      rotation: Math.PI, 
      circumference: Math.PI, 
      cutoutPercentage: 75,
      legend: { display: false },
      tooltips: { enabled: false }, 
      responsive: true,
      plugins: {
        datalabels: {
          display: false,
        },
      },
      layout: {
        padding: {
          left:10,
          right: 10,
          top: 10,
          bottom: 10,
        }
      },
      
    };

    const TransmetodLabels = [...new Set(this.data.RelatorioD2C.map(row => row["Trans Method."]))];

    var DataTransmetod = {
      labels: TransmetodLabels,
      datasets: [{
        label: "Itens",
        fill: true,
        backgroundColor: 'rgba(66,134,121,0.2)',
        borderColor: '#00f2c3',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: '#00f2c3',
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: '#00d6b4',
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: TransmetodLabels.map(label => 0),
      }],
    };
    var OptionsTransmetod = {
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
      },
      scales: {
        yAxes: [{
          beginAtZero: true,
          display: false,
        }],
        xAxes: [{
          gridLines: {
            drawBorder: false,
            color: 'rgba(0,242,195,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            fontSize: 19,
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }]
      },
      layout: {
        padding: {
          top: 20,
          bottom: 0,
          left: 40,
          right: 40,
        }
      },
    };

    const StatusLabels = [...new Set(this.data.RelatorioD2C.map(row => row["Status"]))];

    var DataStatus = {
      labels: StatusLabels,
      datasets: [{
        label:"Itens",
        fill: true,
        backgroundColor:"rgba(31, 143, 241, 0.05)",
        borderColor: '#1f8ef1',
        borderWidth: 2,
        data: StatusLabels.map(label => 0),
      }]
    };
    var OptionsStatus = {
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
      },
      scales: {
        yAxes: [{
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: "transparent",
          },
          display:false,
        }],
        xAxes: [{
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            fontSize: 17,
            padding: 20,
            fontColor: "#9e9e9e"
          },
        }]
      },
      layout: {
        padding: {
          top: 40,
          bottom: 0,
          left: 0,
          right: 0,
        }
      },
    };

    let DivisionLabels = [...new Set(this.data.RelatorioD2C.map(row => row["Division"]))];

    var DataDivision = {
      labels: DivisionLabels,
      datasets: [{
        label: "Itens",
        fill: true,
        backgroundColor: "rgba(0, 242, 194, 0.02)",
        borderColor: '#1f8ef1',
        borderWidth: 2,
        data: DivisionLabels.map(label => 0),
      }]
    }
    var OptionsDivision = {
      plugins: {
        legend: {
          display: true,
        },
        datalabels: {
          color: 'rgba(255, 255, 255, 0.8)',
          anchor: "end",  // Alinha ao final da barra
          align: "right",  // Posiciona o texto à direita da barra
          offset: 10,
          padding: 10,
          font: {
            size: 18,
          },
          formatter: (value) => `${value.toLocaleString('pt-BR')}`, // Formato dos rótulos
        },
        tooltip: { callbacks: { label: (context) => `Quantidade: ${context.raw}` } }
      },
      scales: {
        yAxes: [{
          gridLines: {
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: 'rgba(29,140,248,0.1)',
          },
          ticks: {
            fontSize: 17,
            fontColor: "#9e9e9e"
          }
        }],
        xAxes: [{
          display: false,
        }]
      },
      layout: {
        padding: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 55,
        }
      },
    };

    let caphoralabel = Array(24).fill(Math.round(this.data.Capacidade.reduce((acc, item) => {return acc + item["Cap"]}, 0)/24));

    var DataDOCreated = {
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
        data: [2,0,4,2,6,4,8,6,10,8,12,10,14,10,9,8,7,6,5,4,3,2,1,0],
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
        data: caphoralabel,
        datalabels: {
          display: false,
        },
      }]
    }
    var OptionsDOCreated = {
      plugins: {
        datalabels: {
          color: 'rgba(255, 255, 255, 0.8)',
          anchor: 'end',
          align: 'top',
          font: {
            size: 25,
          },
          formatter: (value) => `${value.toLocaleString('pt-BR')}`, // Formato dos rótulos
        },
      },
      scales: {
        yAxes: [{
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9a9a9a",
            display:false
          }
        }],
        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(225,78,202,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }]
      },
      layout: {
        padding: {
          top: 40,
          bottom: 0,
          left: 25,
          right: 25,
        }
      },
    };

    const TypeLabels = [...new Set(this.data.RelatorioD2C.map(row => row["D/O Type"]))];

    var DataType = {
      labels: TypeLabels,
      datasets: [{
        label: "Itens",
        borderColor: ["#00f2c3","#1f8ef1"],
        fill: true,
        backgroundColor: ["rgba(0, 242, 194, 0.05)","rgba(31, 143, 241, 0.05)"],
        borderWidth: 3,
        data: TypeLabels.map(label => 0)
      }]
    }
    var OptionsType = {
      cutoutPercentage: 50,
      maintainAspectRatio: false,
      legend: {
        position: 'bottom',
        align: 'center',
        Size: 20,
        labels: {
          fontColor: "#9e9e9e",
          padding: 20,
          fontSize: 14,
        },
      },
      plugins: {
        datalabels: {
          color: 'rgb(255, 255, 255)',
          anchor: 'center',
          align: 'center',
          font: {
            size: 18,
          },
          formatter: (value) => `${value.toLocaleString('pt-BR')}`,
        },
      },
      layout: {
        padding: {
          left:10,
          right: 10,
          top: 20,
          bottom: 0
        }
      },
    };

    this.myChartCap = new ChartManager("CapPorcent","doughnut",DataCap,OptionsCap);
    this.myChartTransmetod = new ChartManager("Trans Method.","line",DataTransmetod,OptionsTransmetod,"Verde");
    this.myChartStatus = new ChartManager("Status","bar",DataStatus,OptionsStatus,"Azul");
    this.myChartDivision = new ChartManager("Division","horizontalBar",DataDivision,OptionsDivision,"Azul");
    this.myChartDOCreated = new ChartManager("D/O Date","line",DataDOCreated,OptionsDOCreated,"Azul");
    this.myChartType = new ChartManager("D/O Type","doughnut",DataType,OptionsType)

  },
  initialize_heads(){

    var lastupdateIcon = "<i class='tim-icons icon-refresh-01 text-info'></i>"
    var lastupdateDescription = " Last Update: "

    var capIcon = "<i class='tim-icons  icon-app text-info'></i>"
    var capDescription = " Capacity: "

    this.headLastUpdate = new HeadManager("lastupdate",lastupdateIcon,lastupdateDescription)
    this.headBacklog = new HeadManager("backlog")
    this.headGID2 = new HeadManager("GID2")
    this.headGID1 = new HeadManager("GID1")
    this.headGICurrent = new HeadManager("GICurrent")
    this.headCapacity = new HeadManager("Cap",capIcon,capDescription)
    this.headPendingCap = new HeadManager("PendingCap")
    this.headGIExpected = new HeadManager("GIExpected")

  },
  update(newData){

    const processarDados = (tabela) => {
      const dadosAgrupados = {};
    
      tabela.forEach(row => {
        Object.keys(row).forEach(coluna => {
          if (coluna !== "Order Quantity") { // Ignora a coluna de soma diretamente
            const chave = coluna + "Chart"; // Define o nome do gráfico dinamicamente
    
            if (!dadosAgrupados[chave]) {
              dadosAgrupados[chave] = {};
            }
    
            const categoria = row[coluna]; // Exemplo: "Waiting" ou "P04"
            const quantidade = row["Order Quantity"];
    
            if (!dadosAgrupados[chave][categoria]) {
              dadosAgrupados[chave][categoria] = 0;
            }
            dadosAgrupados[chave][categoria] += quantidade;
          }
        });
      });
    
      // Converter para o formato de gráfico
      const newData = {};
      Object.entries(dadosAgrupados).forEach(([chartId, data]) => {
        newData[chartId] = {
          labels: Object.keys(data),
          dados: Object.values(data)
        };
      });
    
      return newData;
    };
    
    const teste = processarDados(newData.RelatorioD2C);
    console.log(teste);
    
  
    this.instances_chart.forEach(instance => {
      const chartId = instance.id;

      instance.chart.data.labels = newData;
      instance.chart.data.datasets[0].data = newData;
      instance.chart.update();
    });
    this.instances_head.forEach(instance => {
      instance.update(newData[0]);
    });
  },
  filterdata(data){
    const filteredData = data.filter(item =>
      Object.entries(this.chartFilters).every(([key, value]) => item[key] === value)
    );
  }
}


demo = {
  
  initPickColor: function() {
    $('.pick-class-label').click(function() {
      var new_class = $(this).attr('new-class');
      var old_class = $('#display-buttons').attr('data-class');
      var display_div = $('#display-buttons');
      if (display_div.length) {
        var display_buttons = display_div.find('.btn');
        display_buttons.removeClass(old_class);
        display_buttons.addClass(new_class);
        display_div.attr('data-class', new_class);
      }
    });
  },

  StrToDate: function(str){
    var date = new Date(str.split('/').reverse().join('/'));
    return date;
  },

  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  C820_L_clic: false,
  C820_J_clic: false,
  C820_R_clic: false,

  backlog_clic: false,
  paradigma_clic: false,
  pinparadigma_clic: false,

  currentTransMethedFilter: null,
  currentStatusFilter: null,
  currentTypeFilter: null,
  currentDOCreatedFilter: null,
  currentDivisionFilter: null,

  initDashboardPageCharts: function(datajson) {
    
    let baseData = datajson.RelatorioD2C.filter(item => item.Status !== "GI" && item["Storage Location"] !== "FCBA");
    let baseDocreated = datajson.RelatorioD2C.filter(item => item["Storage Location"] !== "FCBA")
    let baseGI =  datajson.RelatorioD2C;
    let baseCap =  datajson.Capacidade;

    console.log(baseData);

    let bkbaseData = baseData;
    let bkbaseDocreated = baseDocreated;
    let bkbaseGI =  baseGI;
    let bkbaseCap = baseCap;

    let hoje = new Date();
    hoje.setDate(hoje.getDate());
    let dateFiltercurrent = hoje.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    hoje.setDate(hoje.getDate()-1);
    let dateFilterdmenos1 = hoje.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    hoje.setDate(hoje.getDate()-2);
    let dateFilterdmenos2 = hoje.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const modelos = [
      "SM-S931B",
      "SM-S936B",
      "SM-S938B",
      "SM-S938B",
      "EF-GS931",
      "EF-PS931",
      "EF-VS931",
      "EF-QS931",
      "EF-MS931",
      "EF-JS931",
      "EF-RS931",
      "EF-GS936",
      "EF-PS936",
      "EF-VS936",
      "EF-QS936",
      "EF-MS936",
      "EF-JS936",
      "EF-RS936",
      "EF-GS938",
      "EF-PS938",
      "EF-VS938",
      "EF-QS938",
      "EF-MS938",
      "EF-JS938",
      "EF-RS938"
    ];

    function filtra_click() {
      let filteredData = bkbaseData;
      let filteredDataGI = bkbaseGI;
      let filteredDataCap = bkbaseCap;

      if (demo.C820_L_clic){
        filteredData = filteredData.filter(item => item["Warehouse Cd."] !== "C820_L" );
        filteredDataGI = filteredDataGI.filter(item => item["Warehouse Cd."] !== "C820_L" );
        filteredDataCap = filteredDataCap.filter(item => item["Warehouse Cd."] !== "C820_L" );
      }

      if (demo.C820_J_clic){
        filteredData = filteredData.filter(item => item["Warehouse Cd."] !== "C820_J" );
        filteredDataGI = filteredDataGI.filter(item => item["Warehouse Cd."] !== "C820_J" );
        filteredDataCap = filteredDataCap.filter(item => item["Warehouse Cd."] !== "C820_J" );
      }

      if (demo.C820_R_clic){
        filteredData = filteredData.filter(item => item["Warehouse Cd."] !== "C820_R" );
        filteredDataGI = filteredDataGI.filter(item => item["Warehouse Cd."] !== "C820_R" );
        filteredDataCap = filteredDataCap.filter(item => item["Warehouse Cd."] !== "C820_R" );
      }

  
      if (demo.backlog_clic){
        filteredData = filteredData.filter(item => item.Status !== "GI" && item["Storage Location"] !== "FCBA" && item["Trans Method."] !== "T01" && item["Trans Method."] !== "M02" && demo.StrToDate(item["PGI Date"]) < demo.StrToDate(dateFiltercurrent));
      }

      if(demo.paradigma_clic){
        filteredData = filteredData.filter(item => !modelos.includes(item['Item Code'].substr(0, 8)));
      }

      if(demo.pinparadigma_clic){
        filteredData = filteredData.filter(item => modelos.includes(item['Item Code'].substr(0, 8)));
      }


      if (!demo.backlog_clic && !demo.paradigma_clic && !demo.pinparadigma_clic && !demo.C820_L_clic && !demo.C820_J_clic){
        baseData = bkbaseData;
        baseDocreated = bkbaseDocreated;
        baseGI = bkbaseGI;
        baseCap = bkbaseCap;
      } else {
        baseData = filteredData;
        baseDocreated = filteredData;
        baseGI = filteredDataGI;
        baseCap = filteredDataCap;
      }

      Backlog = baseData
      .filter(item => item.Status !== "GI" && item["Storage Location"] !== "FCBA" && item["Trans Method."] !== "T01" && item["Trans Method."] !== "M02" && demo.StrToDate(item["PGI Date"]) < demo.StrToDate(dateFiltercurrent))
      .reduce((acc, item) => {
        return acc + item["Order Quantity"]; 
      }, 0);
      tbBacklog.innerHTML = " " + Backlog.toLocaleString('pt-BR');

      inprocess = baseData
      .filter(item => item.Status !== "GI" && item["Storage Location"] !== "FCBA")
      .reduce((acc, item) => {
        return acc + item["Order Quantity"]; 
      }, 0);
      tbinprocess.innerHTML = "In process: " + inprocess.toLocaleString('pt-BR');

       gicurrent = baseGI
      .filter(item => item.Status === "GI" && item["GI Date"].split(" ")[0] === dateFiltercurrent)
      .reduce((acc, item) => {
        return acc + item["Order Quantity"]; 
      }, 0);
      tbgicurrent.innerHTML = " " + gicurrent.toLocaleString('pt-BR');
      
       gidmenos1 = baseGI
      .filter(item => item.Status === "GI" && item["GI Date"].split(" ")[0] === dateFilterdmenos1)
      .reduce((acc, item) => {
        return acc + item["Order Quantity"]; 
      }, 0);
      tbgidmenos1.innerHTML = " " + gidmenos1.toLocaleString('pt-BR');
  
       gidmenos2 = baseGI
      .filter(item => item.Status === "GI" && item["GI Date"].split(" ")[0] === dateFilterdmenos2)
      .reduce((acc, item) => {
        return acc + item["Order Quantity"]; 
      }, 0);
      tbgidmenos2.innerHTML = " " + gidmenos2.toLocaleString('pt-BR');

      giexpected = baseGI
      .filter(item => expected.includes(item['Status']))
      .reduce((acc, item) => {
        return acc + item["Order Quantity"]; 
      }, 0);
      tbgiexpected.innerHTML = " " + (giexpected + gicurrent).toLocaleString('pt-BR');


      capacidade = baseCap
      .reduce((acc, item) => {
        return acc + item["Cap"]; 
      }, 0);
      Pending = (capacidade - gicurrent) < 0 ? 0 : capacidade - gicurrent;
      tbcap.innerHTML = "<i class='tim-icons  icon-app text-info'></i> Capacity " + capacidade.toLocaleString('pt-BR');
      tbPending.innerHTML = "" + Pending.toLocaleString('pt-BR');
      
      currentValue = Math.round(gicurrent / capacidade * 100) > 100 ? 100 : Math.round(gicurrent / capacidade * 100)

      myChartCap.data.datasets[0].data = [currentValue, 100-currentValue];
      myChartCap.update();

      caphoralabel = Array(24).fill(Math.round(capacidade/24));
      myChartDOCreated.data.datasets[1].data = caphoralabel;
      myChartDOCreated.update();
      

    }

    const lastupdate = datajson.UltAtualizacao[0].Atualizacao;
    const tblastupdate = document.getElementById("lastupdate");
    tblastupdate.innerHTML = "<i class='tim-icons icon-refresh-01 text-info'></i> Last Update: " + lastupdate ;

    let Backlog = baseData
    .filter(item => item.Status !== "GI" && item["Storage Location"] !== "FCBA" && item["Trans Method."] !== "T01" && item["Trans Method."] !== "M02" && demo.StrToDate(item["PGI Date"]) < demo.StrToDate(dateFiltercurrent))
    .reduce((acc, item) => {
      return acc + item["Order Quantity"]; 
    }, 0);
    const tbBacklog = document.getElementById("Backlog");
    tbBacklog.innerHTML = " " + Backlog.toLocaleString('pt-BR');

    let inprocess = baseData
    .filter(item => item.Status !== "GI" && item["Storage Location"] !== "FCBA")
    .reduce((acc, item) => {
      return acc + item["Order Quantity"]; 
    }, 0);
    const tbinprocess = document.getElementById("inprocess");
    tbinprocess.innerHTML = "In process: " + inprocess.toLocaleString('pt-BR');

    let gicurrent = baseGI
    .filter(item => item.Status === "GI" && item["GI Date"].split(" ")[0] === dateFiltercurrent)
    .reduce((acc, item) => {
      return acc + item["Order Quantity"]; 
    }, 0);
    const tbgicurrent = document.getElementById("gicurrent");
    tbgicurrent.innerHTML = " " + gicurrent.toLocaleString('pt-BR');

    let gidmenos1 = baseGI
    .filter(item => item.Status === "GI" && item["GI Date"].split(" ")[0] === dateFilterdmenos1)
    .reduce((acc, item) => {
      return acc + item["Order Quantity"]; 
    }, 0);
    const tbgidmenos1 = document.getElementById("gidmenos1");
    tbgidmenos1.innerHTML = " " + gidmenos1.toLocaleString('pt-BR');

    let gidmenos2 = baseGI
    .filter(item => item.Status === "GI" && item["GI Date"].split(" ")[0] === dateFilterdmenos2)
    .reduce((acc, item) => {
      return acc + item["Order Quantity"]; 
    }, 0);
    const tbgidmenos2 = document.getElementById("gidmenos2")
    tbgidmenos2.innerHTML = " " + gidmenos2.toLocaleString('pt-BR');

    let expected = ["Checking","Mf.Created","Loading"]
    let giexpected = baseGI
    .filter(item => expected.includes(item['Status']))
    .reduce((acc, item) => {
      return acc + item["Order Quantity"]; 
    }, 0);
    const tbgiexpected = document.getElementById("giexpected")
    tbgiexpected.innerHTML = " " + (giexpected + gicurrent).toLocaleString('pt-BR');


    var ctx = document.getElementById('gaugeCap').getContext("2d");

    gradientFillGreen = ctx.createLinearGradient(0, 230, 0, 50);
    gradientFillGreen.addColorStop(0, "rgba(66, 134, 121, 0.18)");
    gradientFillGreen.addColorStop(1, "rgba(66, 134, 121, 0.04)");

    const tbcap = document.getElementById("cap");
    const tbPending = document.getElementById("Pending");
    let capacidade = datajson.Capacidade
          .reduce((acc, item) => {
            return acc + item["Cap"]; 
          }, 0);
    let Pending = (capacidade - gicurrent) < 0 ? 0 : capacidade - gicurrent;
    tbcap.innerHTML = "<i class='tim-icons  icon-app text-info'></i> Capacity " + capacidade.toLocaleString('pt-BR');
    tbPending.innerHTML = "" + Pending.toLocaleString('pt-BR');

    let currentValue = Math.round(gicurrent / capacidade * 100) > 100 ? 100 : Math.round(gicurrent / capacidade * 100)

    var data = {
      labels: ['Atingido', 'Faltante'],
      datasets: [{
        borderColor: ["#00f2c3",gradientFillGreen],
        pointBorderColor: "#FFF",
        pointBackgroundColor: "#f96332",
        pointBorderWidth: 2,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 1,
        pointRadius: 4,
        backgroundColor: ["#00f2c3", gradientFillGreen],
        borderWidth: 3,
        data: [currentValue , 100 - currentValue],
      }],
    }

    ChartOptionsConfigCap = {
      animation: {
        duration: 0, // Duração da animação em milissegundos
        animateScale: true,
        animateRotate: true,
        onComplete: function() {
          // Obtém o contexto do gráfico
          const chartInstance = this.chart;
          const ctx = chartInstance.ctx;
  
          // Calcula a posição central do canvas
          const centerX = (chartInstance.chartArea.left + chartInstance.chartArea.right) / 2;
          const centerY = (chartInstance.chartArea.top + chartInstance.chartArea.bottom) / 1.35;
  
          // Define estilo do texto
          ctx.save();
          ctx.font = '2.6625rem Poppins'; // Fonte do texto
          ctx.fillStyle = 'white'; // Cor do texto
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
  
          // Obtém o valor total dos dados
          //const total = chartInstance.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const value = Math.round(gicurrent / capacidade * 100)
          // Desenha o texto no centro
          ctx.fillText(`${value}%`, centerX, centerY);
          ctx.restore();
        },
      },
      hover: {
        animationDuration: 0, // Remove a animação do hover
      },
      aspectRatio: 2.7,
      maintainAspectRatio: false,
      responsive: true,
      rotation: Math.PI, // Inicia a rotação no topo (270 graus)
      circumference: Math.PI, // Mostra apenas metade do círculo (180 graus)
      cutoutPercentage: 75, // Controla a espessura do arco (70% da largura do gráfico)
      legend: { display: false }, // Remove a legenda
      tooltips: { enabled: false }, 
      responsive: true,
      plugins: {
        datalabels: {
          display: false,
        },
      },
      layout: {
        padding: {
          left:10,
          right: 10,
          top: 20,
          bottom: 30,
        }
      },
      
    };

    const myChartCap = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: ChartOptionsConfigCap
    });


    function consolidateData(data, groupField) {
      return data.reduce((acc, row) => {
        if (!demo.currentTransMethedFilter || row["Trans Method."] === demo.currentTransMethedFilter) {
          if (!demo.currentDOCreatedFilter || row["D/O Date"].split(":")[0] + ":00" === demo.currentDOCreatedFilter) {
            if (!demo.currentStatusFilter || row["Status"] === demo.currentStatusFilter ) {
              if (!demo.currentTypeFilter || row["D/O Type"] === demo.currentTypeFilter) {
                if (!demo.currentDivisionFilter || row["Division"] === demo.currentDivisionFilter) {
                  acc[row[groupField]] = (acc[row[groupField]] || 0) + row["Order Quantity"];
                }
              }
            }
          }
        }
        return acc;
      }, {});
    }

    function updateCharts(data) {

      const transmetodConsolidation = consolidateData(data, "Trans Method.");
      const statusConsolidation = consolidateData(data, "Status");
      const typeConsolidation = consolidateData(data, "D/O Type");
      const divisionConsolidation = consolidateData(data, "Division");

      myChartTransmetod.chart.data.datasets[0].data = transmetodLabels.map(label => transmetodConsolidation[label] || 0);
      myChartStep.chart.data.datasets[0].data = statusLabels.map(label => statusConsolidation[label] || 0);
      myChartType.data.datasets[0].data = typeLabels.map(label => typeConsolidation[label] || 0);

      DivisionLabels = [...new Set(data.map(row => row["Division"]))];
      myChartDivision.data.labels = DivisionLabels;
      myChartDivision.data.datasets[0].data = DivisionLabels.map(label => divisionConsolidation[label] || 0);


      myChartTransmetod.chart.options.scales.yAxes[0].ticks.suggestedMax =  Math.max(...myChartTransmetod.chart.data.datasets[0].data) === 0 ? 1 : Math.max(...myChartTransmetod.chart.data.datasets[0].data)*1.3;
      myChartStep.chart.options.scales.yAxes[0].ticks.suggestedMax =  Math.max(...myChartStep.chart.data.datasets[0].data) === 0 ? 1 : Math.max(...myChartStep.chart.data.datasets[0].data)*1.3;

      myChartTransmetod.chart.update();
      myChartStep.chart.update();
      myChartType.update();
      myChartDivision.update();
      
    }  

    function updatedocreated(data) {
      let base;
      if (demo.currentTypeFilter === null && demo.currentStatusFilter === null && demo.currentTransMethedFilter === null) {
        base = data;
      } else {
        base = data.filter(item => item.Status !== "GI");
      }

      let DOCreatedConsolidation = consolidateData(base, "D/O Date");
      DOCreatedConsolidation = Object.entries(DOCreatedConsolidation)
        .filter(([chave, valor]) => chave.startsWith(dateFilterDocreated))
        .reduce((acc, [chave, valor]) => {
          acc[chave.split(" ")[1].split(":")[0] + ":00"] = (acc[chave.split(" ")[1].split(":")[0] + ":00"] || 0) + valor;
          return acc;
        }, {});

      myChartDOCreated.data.datasets[0].data = DOCreatedLabels.map(label => DOCreatedConsolidation[label] || 0);
      myChartDOCreated.options.scales.yAxes[0].ticks.suggestedMax =  Math.max(...myChartDOCreated.data.datasets[0].data) === 0 ? 1 : Math.max(...myChartDOCreated.data.datasets[0].data)*1.3;
      
      // var pointColors = [];
      // for (let i = 0; i < myChartDOCreated.data.datasets[0].data.length; i++) {
      //   if (parseInt(myChartDOCreated.data.datasets[0].data[i]) > caphora) {
      //     pointColors.push('red');
      //   } else {
      //     pointColors.push('#2EC0F9');
      //   }
      // }
      // myChartDOCreated.data.datasets[0].pointBackgroundColor = pointColors
      myChartDOCreated.update();
    }

    const transmetodLabels = [...new Set(baseData.map(row => row["Trans Method."]))];
    const statusLabels = [...new Set(baseData.map(row => row["Status"]))];
    let DivisionLabels = [...new Set(baseData.map(row => row["Division"]))];
    const typeLabels = [...new Set(baseData.map(row => row["D/O Type"]))];
    const DOCreatedLabels = ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"];
    let caphoralabel = Array(24).fill(Math.round(capacidade/24));

    transmetodLabels.sort();

    var ordem_status = ["00_Waiting Pre-Visit","00_CARR_ID Incorreto","P.Shipmment","W.Booking","W.Allocation","Allocation","Picking","With NF","Print","Checking","Mf.Created","Loading","GI",""]
    statusLabels.sort((a, b) => {
      return ordem_status.indexOf(a) - ordem_status.indexOf(b);
    });

    // var ctx = document.getElementById("chartLineTransMethod").getContext("2d");

    // var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
    // gradientStroke.addColorStop(1, 'rgba(66,134,121,0.15)');
    // gradientStroke.addColorStop(0.4, 'rgba(66,134,121,0.0)'); //green colors
    // gradientStroke.addColorStop(0, 'rgba(66,134,121,0)'); //green colors

    var data = {
      labels: transmetodLabels,
      datasets: [{
        label: "Itens",
        fill: true,
        // backgroundColor: gradientStroke,
        borderColor: '#00f2c3',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: '#00f2c3',
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: '#00d6b4',
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: transmetodLabels.map(label => 0),
      }]
    };

    ChartOptionsConfigTransmetod = {
      animation: {
        duration: 2000, // Duração da animação em milissegundos
      },
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 50,
          right: 50,
        }
      },

      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
        datalabels: {
          color: 'rgba(255, 255, 255, 0.8)',
          anchor: 'end',
          align: 'top',
          font: {
            size: 25,
          },
          formatter: (value) => `${value.toLocaleString('pt-BR')}`, 
        },
        tooltip: { callbacks: { label: (context) => `Quantidade: ${context.raw}` } }
      },
      scales: {
        yAxes: [{
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            display: false,
            padding: 10,
          }
        }],
        xAxes: [{
          gridLines: {
            drawBorder: false,
            color: 'rgba(0,242,195,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            fontSize: 19,
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }]
      },
      // onClick: function(e) {
      //   const activePoints = this.getElementAtEvent(e);
      //   if (activePoints.length) {
      //     const clickedIndex = activePoints[0]._index;
      //     const clickedTransmetod = transmetodLabels[clickedIndex];

      //     demo.currentTransMethedFilter = demo.currentTransMethedFilter === clickedTransmetod ? null : clickedTransmetod;
      //     updateCharts(baseData);
      //     updateTable(baseData);
      //     updatedocreated(baseDocreated);
      //   }
      // }
    };

    // const myChartTransmetod = new Chart(ctx, {
    //   type: 'line',
    //   data: data,
    //   options: ChartOptionsConfigTransmetod
    // });

    const myChartTransmetod = new ChartManager("Trans Method.","line",data,ChartOptionsConfigTransmetod)


    // var ctx = document.getElementById("chartBarStep").getContext("2d");
    // var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
    
    // gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
    // gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
    // gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors

    var data = {
      labels: statusLabels,
      datasets: [{
        label: "Itens",
        fill: true,
        // backgroundColor: gradientStroke,
        // hoverBackgroundColor: gradientStroke,
        borderColor: '#1f8ef1',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        data: statusLabels.map(label => 0),
      }]
    }

    ChartOptionsConfigStep = {
      animation: {
        duration: 2000, // Duração da animação em milissegundos
      },
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      layout: {
        padding: {
          top: 0,
          bottom: 0,
          left: 30,
          right: 30,
        }
      },
      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        callbacks: {
          label: function(tooltipItem, data) {
            // Obtém o valor do dataset
            var valor = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

            // Formata o número separando milhar com ponto (ex: 1.500.000)
            return valor.toLocaleString("pt-BR");
          }
        }
      },
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
        datalabels: {
          color: 'rgba(255, 255, 255, 0.8)',
          anchor: 'end',
          align: 'top',
          font: {
            size: 25,
          },
          formatter: (value) => `${value.toLocaleString('pt-BR')}`, // Formato dos rótulos
        },
        tooltip: { callbacks: { label: (context) => `Quantidade: ${context.raw}` } }
      },
      scales: {
        yAxes: [{
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            display: false,
            padding: 10,
            suggestedMin: 0
          }
        }],
        xAxes: [{
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            fontSize: 17,
            padding: 20,
            fontColor: "#9e9e9e"
          },
          onClick: function(event, legendItem) {
            const clickedStatus = legendItem.text;;
            
            demo.currentStatusFilter = demo.currentStatusFilter === clickedStatus ? null : clickedStatus;
            updateCharts(baseData);
            updateTable(baseData);
            updatedocreated(baseDocreated);
          },
        }]
      },
      // onClick: function(e) {
      //   const activePoints = this.getElementAtEvent(e);
      //   if (activePoints.length) {
      //     const clickedIndex = activePoints[0]._index;
      //     const clickedStatus = statusLabels[clickedIndex];
      //     demo.currentStatusFilter = demo.currentStatusFilter === clickedStatus ? null : clickedStatus;
      //     updateCharts(baseData);
      //     updateTable(baseData);
      //     updatedocreated(baseDocreated);
      //   }
      // }
    };

    // const myChartStep = new Chart(ctx, {
    //   type: 'bar',
    //   data: data,
    //   options: ChartOptionsConfigStep
    // });

    const myChartStep = new ChartManager("Status","bar", data,ChartOptionsConfigStep) 


    ctx = document.getElementById('pieMonoMult').getContext("2d");
    gradientFillBLue = ctx.createLinearGradient(0, 230, 0, 50);
    gradientFillBLue.addColorStop(0, "rgba(114, 170, 235, 0)");
    gradientFillBLue.addColorStop(0.7, "rgba(114, 171, 235, 0.1)");
    gradientFillGreen = ctx.createLinearGradient(0, 230, 0, 50);
    gradientFillGreen.addColorStop(0, "rgba(66, 134, 121, 0.18)");
    gradientFillGreen.addColorStop(1, "rgba(66, 134, 121, 0.04)");

    var data = {
      labels: typeLabels,
      datasets: [{
        label: "Qty.",
        borderColor: ["#00f2c3","#1f8ef1"],
        pointBorderColor: "#FFF",
        pointBackgroundColor: "#f96332",
        pointBorderWidth: 2,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 1,
        pointRadius: 4,
        fill: true,
        backgroundColor: [gradientFillGreen,gradientFillBLue],
        borderWidth: 3,
        data: typeLabels.map(label => 0)
      }]
    }

    ChartOptionsConfigMonoMult = {
      animation: {
        duration: 2000, // Duração da animação em milissegundos
      },
      cutoutPercentage: 50,
      maintainAspectRatio: false,
      legend: {
        position: 'bottom',
        align: 'center',
        Size: 20,
        labels: {
          fontColor: "#9e9e9e",
          padding: 20,
          fontSize: 14,
        },
        onClick: function(event, legendItem) {
          const clickedType = legendItem.text;;
          
          demo.currentTypeFilter = demo.currentTypeFilter === clickedType ? null : clickedType;
          updateCharts(baseData);
          updateTable(baseData);
          updatedocreated(baseDocreated);
        },
      },
      responsive: true,
      plugins: {
        datalabels: {
          color: 'rgb(255, 255, 255)',
          anchor: 'center',
          align: 'center',
          font: {
            size: 18,
          },
          formatter: (value) => `${value.toLocaleString('pt-BR')}`,
        },
      },
      layout: {
        padding: {
          left:10,
          right: 10,
          top: 20,
          bottom: 0
        }
      },
      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        callbacks: {
          label: function(tooltipItem, data) {
            // Obtém o valor do dataset
            var valor = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

            // Formata o número separando milhar com ponto (ex: 1.500.000)
            return valor.toLocaleString("pt-BR");
          }
        }
      },
      onClick: function(e) {
        const activePoints = this.getElementAtEvent(e);
        if (activePoints.length) {
          const clickedIndex = activePoints[0]._index;
          const clickedType = typeLabels[clickedIndex];

          demo.currentTypeFilter = demo.currentTypeFilter === clickedType ? null : clickedType;
          updateCharts(baseData);
          updateTable(baseData);
          updatedocreated(baseDocreated);
        }
      }
    };

    const myChartType = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: ChartOptionsConfigMonoMult
    });


    var ctx = document.getElementById("chartLineDOCreated").getContext('2d');
    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
    gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
    gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors
  
    var data = {
      labels: DOCreatedLabels, 
      datasets: [{
        label: "Itens",
        fill: true,
        backgroundColor: gradientStroke,
        borderColor: '#2EC0F9',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: "#2EC0F9",
        pointBorderColor: 'rgba(255,255,255,0)',
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: DOCreatedLabels.map(label => 0),
      },
      {
        label: "Cap",
        fill: true,
        borderColor: 'rgba(199, 33, 33, 0.88)',
        borderWidth: 2,
        pointBackgroundColor: 'red',
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: '#2EC0F9',
        pointBorderWidth: 0,
        pointHoverRadius: 0,
        pointHoverBorderWidth: 0,
        pointRadius: 0,
        data: caphoralabel,
        datalabels: {
          display: false,
        },
      }]
    }

    const legendColors = [];
    DOCreatedLabels.reduce((acc, row) => {
      if (row > 70) {
        legendColors.push('red');
      } else {
        legendColors.push('rgba(255, 255, 255, 0.8)');
      }
    }, {});

    ChartOptionsConfigDOCreated = {
      animation: {
        duration: 2000, // Duração da animação em milissegundos
      },
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 50,
          right: 50,
        }
      },
      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        callbacks: {
          label: function(tooltipItem, data) {
            // Obtém o valor do dataset
            var valor = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

            // Formata o número separando milhar com ponto (ex: 1.500.000)
            return valor.toLocaleString("pt-BR");
          }
        }
      },
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
        datalabels: {
          color: 'rgba(255, 255, 255, 0.8)',
          anchor: 'end',
          align: 'top',
          font: {
            size: 25,
          },
          formatter: (value) => `${value.toLocaleString('pt-BR')}`, // Formato dos rótulos
        },
      },
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9a9a9a",
            display:false
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(225,78,202,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }]
      },
      onClick: function(e) {
        const activePoints = this.getElementAtEvent(e);
        if (activePoints.length) {
          const clickedIndex = activePoints[0]._index;
          const clickedDOCreated =  dateFilterDocreated + " " + DOCreatedLabels[clickedIndex];

          demo.currentDOCreatedFilter = demo.currentDOCreatedFilter === clickedDOCreated ? null : clickedDOCreated;

          updateCharts(baseData);
          updateTable(baseData);
          updatedocreated(baseDocreated);
        }
      }
    };

    const myChartDOCreated = new Chart(ctx, {
      type: 'line',
      data: data,
      options: ChartOptionsConfigDOCreated
    });

    let dateFilterDocreated = dateFiltercurrent;

    $("#D-2").click(function() {
      dateFilterDocreated = dateFilterdmenos2;
      updatedocreated(baseDocreated);
    });
    $("#D-1").click(function() {
      dateFilterDocreated = dateFilterdmenos1;
      updatedocreated(baseDocreated);
    });

    $("#Current").click(function() {
      dateFilterDocreated = dateFiltercurrent;
      updatedocreated(baseDocreated);
    });



    var ctx = document.getElementById("chartBarDivision").getContext("2d");
    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
    
    gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
    gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors

    var data = {
      labels: DivisionLabels,
      datasets: [{
        label: "Itens",
        fill: true,
        backgroundColor: gradientStroke,
        hoverBackgroundColor: gradientStroke,
        borderColor: '#1f8ef1',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        data: DivisionLabels.map(label => 0),
      }]
    }

    ChartOptionsConfigStep = {
      animation: {
        duration: 2000, // Duração da animação em milissegundos
      },
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      layout: {
        padding: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 55,
        }
      },
      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        callbacks: {
          label: function(tooltipItem, data) {
            // Obtém o valor do dataset
            var valor = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

            // Formata o número separando milhar com ponto (ex: 1.500.000)
            return valor.toLocaleString("pt-BR");
          }
        }
      },
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
        datalabels: {
          color: 'rgba(255, 255, 255, 0.8)',
          anchor: "end",  // Alinha ao final da barra
          align: "right",  // Posiciona o texto à direita da barra
          offset: 10,
          padding: 10,
          font: {
            size: 18,
          },
          formatter: (value) => `${value.toLocaleString('pt-BR')}`, // Formato dos rótulos
        },
        tooltip: { callbacks: { label: (context) => `Quantidade: ${context.raw}` } }
      },
      scales: {
        yAxes: [{
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            fontSize: 17,
            padding: 20,
            fontColor: "#9e9e9e"
          }
          
        }],
        xAxes: [{
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            display: false,
            padding: 10,
            suggestedMin: 0
          }
        }]
      },
      onClick: function(e) {
        const activePoints = this.getElementAtEvent(e);
        if (activePoints.length) {
          const clickedIndex = activePoints[0]._index;
          const clickedDivision = DivisionLabels[clickedIndex];
          demo.currentDivisionFilter = demo.currentDivisionFilter === clickedDivision ? null : clickedDivision;
          updateCharts(baseData);
          updateTable(baseData);
          updatedocreated(baseDocreated);
        }
      }
    };

    const myChartDivision = new Chart(ctx, {
      type: 'horizontalBar',
      data: data,
      options: ChartOptionsConfigStep
    });


    $("#btn_backlog").click(function() {
      if (!demo.backlog_clic) {
        demo.backlog_clic = true
      } else {
        demo.backlog_clic = false
      }
      filtra_click();
      updateCharts(baseData);
      updateTable(baseData);
      updatedocreated(baseDocreated);
    });

    $("#paradigma").click(function() {
      if (!demo.paradigma_clic) {
        demo.paradigma_clic = true
      } else {
        demo.paradigma_clic = false
      }
      filtra_click();
      updateCharts(baseData);
      updateTable(baseData);
      updatedocreated(baseDocreated);
    });

    $("#C820_L").click(function() {
      if (!demo.C820_L_clic) {
        demo.C820_L_clic = true
      } else {
        demo.C820_L_clic = false
      }
      filtra_click();
      updateCharts(baseData);
      updateTable(baseData);
      updatedocreated(baseDocreated);
    });

    $("#C820_J").click(function() {
      if (!demo.C820_J_clic) {
        demo.C820_J_clic = true
      } else {
        demo.C820_J_clic = false
      }
      filtra_click();
      updateCharts(baseData);
      updateTable(baseData);
      updatedocreated(baseDocreated);
    });

    $("#C820_R").click(function() {
      if (!demo.C820_R_clic) {
        demo.C820_R_clic = true
      } else {
        demo.C820_R_clic = false
      }
      filtra_click();
      updateCharts(baseData);
      updateTable(baseData);
      updatedocreated(baseDocreated);
    });

    $("#pinparadigma").click(function() {
      if (!demo.pinparadigma_clic) {
        demo.pinparadigma_clic = true
        $("#pinparadigma i").addClass("text-info")
        $("#pinparadigma span").addClass("text-info")
        
      } else {
        demo.pinparadigma_clic = false
        $("#pinparadigma i").removeClass("text-info")
        $("#pinparadigma span").removeClass("text-info")
      }
      filtra_click();
      updateCharts(baseData);
      updateTable(baseData);
      updatedocreated(baseDocreated);
    });

    const container = document.getElementById('excelTable');
    const hot = new Handsontable(container, {
      data: [],
      height: 450,
      stretchH: 'all',
      colHeaders: [        
        "Warehouse Cd.",
        "D/O No.",
        "D/O Date",
        "PGI Date",
        "Item Code",
        "Storage Location",
        "Plant Code",
        "Trans Method.",
        "Order Quantity",
        "D/O Type",
        "Status"
      ],
      manualColumnResize: true, // Redimensionar colunas
      manualRowResize: true,    // Redimensionar linhas
      filters: true,            // Habilita filtros
      dropdownMenu: true,       // Menu suspenso para filtros
      licenseKey: 'non-commercial-and-evaluation' // Licença para uso não comercial
    });

    function updateTable(data) {
      const filteredData = data.filter(row => {
        return (
          (!demo.currentTransMethedFilter || row["Trans Method."] === demo.currentTransMethedFilter) &&
          (!demo.currentDOCreatedFilter || row["D/O Date"].split(":")[0] + ":00" === demo.currentDOCreatedFilter) &&
          (!demo.currentStatusFilter || row["Status"] === demo.currentStatusFilter) &&
          (!demo.currentTypeFilter || row["D/O Type"] === demo.currentTypeFilter)
        );
      })
      .map(row => [
        row["Warehouse Cd."] || "",
        row["D/O No."] || "",
        row["D/O Date"] || "",
        row["PGI Date"] || "",
        row["Item Code"] || "",
        row["Storage Location"] || "",
        row["Plant Code"] || "",
        row["Trans Method."] || "",
        row["Order Quantity"] || "",
        row["D/O Type"] || "",
        row["Status"] || ""
      ]);

      hot.loadData(filteredData);

    }

    updateCharts(baseData);
    updateTable(baseData);
    updatedocreated(baseDocreated);

  },

  showNotification: function(from, align) {
    color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "tim-icons icon-bell-55",
      message: "Dashboar <b>Atualizado com Sucesso</b> - System."

    }, {
      type: type[color],
      timer: 2000,
      placement: {
        from: from,
        align: align
      }
    });
  }

};