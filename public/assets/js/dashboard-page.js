class ChartManager {
  constructor(chartId, type, data = {}, options = {},gradientColor) {
    this.chartId = chartId;
    this.ctx = document.getElementById(chartId).getContext("2d");
    if (gradientColor) {
      const gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);
      const colors = {
        Azul: ['rgba(29,140,248,0)', 'rgba(29,140,248,0.0)', 'rgba(29,140,248,0.2)'],
        Verde: ['rgba(66,134,121,0)', 'rgba(66,134,121,0.0)', 'rgba(66,134,121,0.2)']
      };
      colors[gradientColor]?.forEach((color, i) => gradientStroke.addColorStop(i / 2, color));
      data.datasets[0].backgroundColor = gradientStroke;
    }
    this.chart = new Chart(this.ctx,{
      type: type,
      data: data,
      options: {
        onClick: (event,elements) => this.handleClick(event,elements),
        maintainAspectRatio: false,
        responsive: true,
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
      const label =  this.chartId == "D/O Date"? Dashboard.DOCreatedFilter + " " + this.chart.data.labels[index]: this.chart.data.labels[index]
      if (Dashboard.chartFilters[this.chartId] === label) {
        delete Dashboard.chartFilters[this.chartId]
      } else {
        Dashboard.chartFilters[this.chartId] = label;
      }
      Dashboard.update_charts()
      Dashboard.update_tables()
    }
  }
};

class HeadManager{
  constructor(id,icon,description){
    this.id = id;
    this.ctx = document.getElementById(id);
    this.icon = icon;
    this.description = description;

    this.ctx.innerHTML = (icon?icon:"") + (description?description:"");

    Dashboard.instances_head.push(this);
  }
  update(value){
    this.ctx.innerHTML = (this.icon?this.icon:"") + (this.description?this.description:"") + value.toLocaleString('pt-BR');
  }
};

const formatarData = (diasAtras = 0) => {
  let data = new Date();
  data.setDate(data.getDate() - diasAtras);
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

let fulldata = null;
let d2cdata = null;

const Dashboard = {

  data: {},
  data_charts:{},
  data_head:{},
  globalFilters_in: {"Warehouse Cd.":["C820_L","C820_J","C820_R"]},
  globalFilters_out: {},
  chartFilters: {},
  DOCreatedFilter: formatarData(),
  instances_chart: [],
  instances_head: [],

  Dashboard_start(data){
    
    fulldata = data;
    d2cdata = data.RelatorioD2C;

    this.initialize_charts();
    this.initialize_table();
    this.initialize_buttons();

    this.update();

  },
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

          const value = chartInstance.data.datasets[0].data[0];

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

    const TransmetodLabels = [...new Set(d2cdata.map(row => row["Trans Method."]))];

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
          top: 40,
          bottom: 0,
          left: 40,
          right: 40,
        }
      },
    };

    var ordem_status = ["00_Waiting Pre-Visit","00_CARR_ID Incorreto","P.Shipmment","W.Booking","W.Allocation","Allocation","Picking","With NF","Print","Checking","Mf.Created","Loading","GI"]
    const StatusLabels = [...new Set(d2cdata
      .filter(item => item["Status"] !== "GI" )
      .map(row => row["Status"]))]
      .sort((a, b) => { return ordem_status.indexOf(a) - ordem_status.indexOf(b); });

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

    let DivisionLabels = [...new Set(d2cdata.map(row => row["Division"]))];

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
          formatter: (value) => `${value?value.toLocaleString('pt-BR'):value}`, // Formato dos rótulos
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
        data: [],
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

    const TypeLabels = [...new Set(d2cdata.map(row => row["D/O Type"]))];

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
  initialize_table(){
    const container = document.getElementById('excelTable');
    this.table = new Handsontable(container, {
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
        "Division",
        "Status"
      ],
      manualColumnResize: true, // Redimensionar colunas
      manualRowResize: true,    // Redimensionar linhas
      filters: true,            // Habilita filtros
      dropdownMenu: true,       // Menu suspenso para filtros
      licenseKey: 'non-commercial-and-evaluation'
    });
  },
  initialize_buttons(){
    $("#Current").click(function() {
      Dashboard.DOCreatedFilter = formatarData();
      Dashboard.update_charts();
    });
    $("#D-1").click(function() {
      Dashboard.DOCreatedFilter = formatarData(1);
      Dashboard.update_charts();
    });
    $("#D-2").click(function() {
      Dashboard.DOCreatedFilter = formatarData(2);
      Dashboard.update_charts();
    });
    $("#C820_L").click(function() {
      const key = "Warehouse Cd.";
      const value = "C820_L";
      const index = Dashboard.globalFilters_in[key].indexOf(value);
      if (index !== -1) {
        Dashboard.globalFilters_in[key].splice(index, 1);
      } else {
        Dashboard.globalFilters_in[key].push(value);
      }
      Dashboard.update();
    });
    $("#C820_J").click(function() {
      const key = "Warehouse Cd.";
      const value = "C820_J";
      const index = Dashboard.globalFilters_in[key].indexOf(value);
      if (index !== -1) {
        Dashboard.globalFilters_in[key].splice(index, 1);
      } else {
        Dashboard.globalFilters_in[key].push(value);
      }
      Dashboard.update();
    });
    $("#C820_R").click(function() {
      const key = "Warehouse Cd.";
      const value = "C820_R";
      const index = Dashboard.globalFilters_in[key].indexOf(value);
      if (index !== -1) {
        Dashboard.globalFilters_in[key].splice(index, 1);
      } else {
        Dashboard.globalFilters_in[key].push(value);
      }
      Dashboard.update();
    });
    $("#filtrarparadigma").click(function() {
      const key = "Item Code";
      const modelos = ["SM-S931B","SM-S936B","SM-S938B","SM-S938B","EF-GS931","EF-PS931","EF-VS931","EF-QS931","EF-MS931","EF-JS931","EF-RS931","EF-GS936","EF-PS936","EF-VS936","EF-QS936","EF-MS936","EF-JS936","EF-RS936","EF-GS938","EF-PS938","EF-VS938","EF-QS938","EF-MS938","EF-JS938","EF-RS938"];
      if (Dashboard.globalFilters_in[key]) {
        delete Dashboard.globalFilters_in[key];
        $("#filtrarparadigma i").removeClass("text-info")
        $("#filtrarparadigma span").removeClass("text-info")
      } else {
        Dashboard.globalFilters_in[key] = (modelos);
        $("#filtrarparadigma i").addClass("text-info")
        $("#filtrarparadigma span").addClass("text-info")
      }
      Dashboard.update();
    });
    $("#exibirparadigma").click(function() {
      const key = "Item Code";
      const modelos = ["SM-S931B","SM-S936B","SM-S938B","SM-S938B","EF-GS931","EF-PS931","EF-VS931","EF-QS931","EF-MS931","EF-JS931","EF-RS931","EF-GS936","EF-PS936","EF-VS936","EF-QS936","EF-MS936","EF-JS936","EF-RS936","EF-GS938","EF-PS938","EF-VS938","EF-QS938","EF-MS938","EF-JS938","EF-RS938"];
      if (Dashboard.globalFilters_out[key]) {
        delete Dashboard.globalFilters_out[key];
      } else {
        Dashboard.globalFilters_out[key] = (modelos);
      }
      Dashboard.update();
    });
    $("#btn_backlog").click(function() {
      const key = "Warehouse Cd.";
      const value = "C820_R";
      const index = Dashboard.globalFilters_in[key].indexOf(value);
      if (index !== -1) {
        Dashboard.globalFilters_in[key].splice(index, 1);
      } else {
        Dashboard.globalFilters_in[key].push(value);
      }
      Dashboard.update();
    });
  },
  update(data){
    if(data){
      fulldata = data;
      d2cdata = data.RelatorioD2C;
    }

    this.update_heads();
    this.update_charts();
    this.update_tables();
  },
  update_heads(){

    const datadfiltered = this.globalfilterdata(d2cdata);

    const lastupdate = fulldata.UltAtualizacao[0].Atualizacao;

    // Pré-calcula as datas necessárias
    const dataAtual = formatarData();
    const dataMenos1 = formatarData(1);
    const dataMenos2 = formatarData(2);

    // Processa os valores de GI e Backlog de forma otimizada
    let Backlog = 0, GI_DMenos2 = 0, GI_DMenos1 = 0, GI_Current = 0, GI_Exp = 0;
    let expected = ["Checking","Mf.Created","Loading"]

    datadfiltered.forEach(row => {
        const pgiDate = row["PGI Date"].split(" ")[0];
        const giDate = row["GI Date"].split(" ")[0];
        const orderQty = row["Order Quantity"];

        if (row["Status"] !== "GI" && pgiDate < dataAtual) {
          Backlog += orderQty;
        }
        if (giDate === dataMenos2) {
          GI_DMenos2 += orderQty;
        }
        if (giDate === dataMenos1) {
          GI_DMenos1 += orderQty;
        }
        if (giDate === dataAtual) {
          GI_Current += orderQty;
        }
        if (expected.includes(row["Status"])){
          GI_Exp += orderQty;
        }
    });

    const Capacidade = fulldata.Capacidade
    .filter(row => this.globalFilters_in["Warehouse Cd."].includes(row["Warehouse Cd."]))
    .reduce((acc, item) => {return acc + item["Cap"];}, 0);

    const PendingCap = GI_Current > Capacidade ? 0 : Capacidade - GI_Current;

    var lastupdateIcon = "<i class='tim-icons icon-refresh-01 text-info'></i>";
    var lastupdateDescription = " Last Update: ";

    var capIcon = "<i class='tim-icons  icon-app text-info'></i>";
    var capDescription = " Capacity:";

    document.getElementById("lastupdate").innerHTML = lastupdateIcon + lastupdateDescription + (lastupdate.toLocaleString('pt-BR'));
    document.getElementById("backlog").innerHTML = Backlog.toLocaleString('pt-BR');
    document.getElementById("GID2").innerHTML = GI_DMenos2.toLocaleString('pt-BR');
    document.getElementById("GID1").innerHTML = GI_DMenos1.toLocaleString('pt-BR');
    document.getElementById("GICurrent").innerHTML = (GI_Current.toLocaleString('pt-BR'))
    document.getElementById("Cap").innerHTML = (capIcon + capDescription + Capacidade.toLocaleString('pt-BR'));
    document.getElementById("PendingCap").innerHTML = PendingCap.toLocaleString('pt-BR');
    document.getElementById("GIExpected").innerHTML = GI_Exp.toLocaleString('pt-BR');
    
    const currentValue = Math.round(GI_Current / Capacidade * 100) > 100 ? 100 : Math.round(GI_Current / Capacidade * 100);
    this.myChartCap.chart.data.datasets[0].data = [currentValue, 100-currentValue];
    this.myChartCap.chart.update();

  },
  update_charts(){
    const processedChartDataDOCreated = this.ChartDataProcess(
      this.globalfilterdata(
        this.filterdata(d2cdata)
      ),
      ["D/O Date"]
    );
    const processedChartData = this.ChartDataProcess(
      this.globalfilterdata(
        this.filterdata(d2cdata.filter(item => item["Status"] !== "GI"))
      ),
      ["Trans Method.","Status","Division","D/O Type"]
    );

    // Atualiza gráficos sem criar cópias desnecessárias
    this.instances_chart.forEach(instance => {
        const { chartId, chart } = instance;
        const isDODate = chartId === "D/O Date";
        const chartData = isDODate ? processedChartDataDOCreated : processedChartData;

        if (chartData?.[chartId]) {
          const { labels, dados } = chartData[chartId];

          if (chartId === "Division") {
            chart.data.labels = labels;
            chart.data.datasets[0].data = dados;
          } else if(chartId === "D/O Date") {
            chart.data.datasets[0].data = chart.data.labels.map(label => {
              const searchLabel = isDODate ? `${this.DOCreatedFilter} ${label}` : label;
              const index = labels.indexOf(searchLabel);
              return index >= 0 ? dados[index] : 0;
            });
            chart.data.datasets[1].data = Array(24).fill(Math.round(fulldata.Capacidade.reduce((acc, item) => {return acc + item["Cap"]}, 0)/24));
          } else {
            chart.data.datasets[0].data = chart.data.labels.map(label => {
              const searchLabel = isDODate ? `${this.DOCreatedFilter} ${label}` : label;
              const index = labels.indexOf(searchLabel);
              return index >= 0 ? dados[index] : 0;
            });
          }
          chart.update();
        }
    });
  },
  update_tables(){
    this.table.loadData(
      this.globalfilterdata(this.filterdata(d2cdata))
      .filter(item => item["Status"] !== "GI")
      .map(row => ([
        row["Warehouse Cd."] ?? "",
        row["D/O No."] ?? "",
        row["D/O Date"] ?? "",
        row["PGI Date"] ?? "",
        row["Item Code"] ?? "",
        row["Storage Location"] ?? "",
        row["Plant Code"] ?? "",
        row["Trans Method."] ?? "",
        row["Order Quantity"] ?? "",
        row["D/O Type"] ?? "",
        row["Division"] ?? "",
        row["Status"] ?? ""
      ]))
    );
  },
  filterdata(data){
    const filteredData = data.filter(item =>
      Object.entries(this.chartFilters).every(([key, value]) => key == "D/O Date"? item[key].split(":")[0]+":00" === value: item[key] === value)
    );
    return filteredData;
  },
  globalfilterdata(data){
    const filter_out = data.filter(item =>
      Object.entries(this.globalFilters_out).every(([key, values]) =>
        key === "Item Code" ?
        !values.includes(item[key].substr(0, 8)):
        Array.isArray(values) ? !values.includes(item[key]) : item[key] !== values
      )
    );
    const filter_in = filter_out.filter(item =>
      Object.entries(this.globalFilters_in).every(([key, values]) =>
        key === "Item Code" ?
        values.includes(item[key].substr(0, 8)):
        Array.isArray(values) ? values.includes(item[key]) : item[key] === values
      )
    );
    return filter_in;
  },
  ChartDataProcess(tabela, chartIds) {
    const dadosAgrupados = {};
  
    tabela.forEach(row => {
      Object.keys(row).forEach(coluna => {
        if (coluna !== "Order Quantity") { // Ignora a coluna de soma diretamente
          const chave = coluna; // Define o nome do gráfico dinamicamente

          dadosAgrupados[chave] ??= {};
          let categoria = chave=="D/O Date" ? row[chave].split(":")[0] + ":00" : row[chave];
          const quantidade = row["Order Quantity"] ?? 0; 
  
          dadosAgrupados[chave][categoria] = (dadosAgrupados[chave][categoria] || 0) + quantidade;
        }
      });
    });

    // Converter para o formato de gráfico
    const Data = {};
    Object.entries(dadosAgrupados).forEach(([chartId, data]) => {
      if(chartIds.includes(chartId)){
        Data[chartId] = {
          labels: Object.keys(data),
          dados: Object.values(data)
        };
      }
    });
    return Data;
  }
};
