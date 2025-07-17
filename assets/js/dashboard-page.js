class ChartManager {
  constructor(chartId, type, data = {}, options = {},gradientColor,tela) {
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
        onClick: (event,elements) => this.handleClick(event,elements,tela,chartId),
        maintainAspectRatio: false,
        responsive: true,
        animation: {
          duration: 2000,
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
        },
        legend: chartId == "D/O Type"
          ? 
            {
              position: 'bottom',
              align: 'center',
              Size: 20,
              labels: {
                fontColor: "#9e9e9e",
                padding: 20,
                fontSize: 14,
              },
              onClick: (event, legendItem) => this.legendClick(event, legendItem, tela, chartId),
            }
          :
            {
              display: false,
            }
        ,
        ...options
      }
    });
    tela.instances_chart.push(this);
  }
  legendClick(event, legendItem, tela, chartId){
    const label = legendItem.text;
    if (tela.chartFilters_in[this.chartId] === label) {
      delete tela.chartFilters_in[this.chartId]
      tela.update_charts();
      if (tela === Dashboard) {
        $("[id='filter-clear-" + chartId + "']").removeClass("icon-filter-remove")
        tela.verificafilters()
      }
    } else {
      tela.chartFilters_in[this.chartId] = label;
      tela.update_charts("Click");
      if (tela === Dashboard) {
        $("[id='filter-clear-" + chartId + "']").addClass("icon-filter-remove")
        tela.verificafilters()
      }
    }
    
    tela.update_tables();
  }
  handleClick(event,elements,tela,chartId) {
    if (elements.length > 0) {
      const index = elements[0]._index;
      const label =  this.chartId == "D/O Date"? tela.DOCreatedFilter + " " + this.chart.data.labels[index]: this.chart.data.labels[index]
      if (tela.chartFilters_in[this.chartId] === label) {
        delete tela.chartFilters_in[this.chartId]
        tela.update_charts();
        
        if (tela === Dashboard) {
          $("[id='filter-clear-" + chartId + "']").removeClass("icon-filter-remove")
          tela.verificafilters()
        } 
        
      } else {
        tela.chartFilters_in[this.chartId] = label;
        tela.update_charts("Click");
        if (tela === Dashboard) {
          $("[id='filter-clear-" + chartId + "']").addClass("icon-filter-remove")
          tela.verificafilters()
        }
      }
      
      tela.update_tables();
    }
  }
};

const formatarData = (diasAtras = 0) => {
  let data = new Date();
  data.setDate(data.getDate() - diasAtras);
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const StrToDate = (str) => {
  var date = new Date(str.split('/').reverse().join('/'));
  return date;
}

function convertToUSFormat(dateString,ss) {
  if(ss){
    let [day, month, year, hours, minutes, seconds] = dateString.match(/\d+/g);
    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
  } else {
    let [day, month, year, hours, minutes] = dateString.match(/\d+/g);
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  }
}

function formatMtoDH(minutos) {
  const dias = Math.floor(minutos / 1440);
  const horas = Math.floor((minutos % 1440) / 60);
  const min = minutos % 60;

  return `${dias}d ${String(horas).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}
function convDHtoM(tempo) {
  const regex = /(\d+)d (\d{2}):(\d{2})/;
  const match = tempo.match(regex);

  const dias = parseInt(match[1], 10);
  const horas = parseInt(match[2], 10);
  const minutos = parseInt(match[3], 10);

  return (dias * 1440) + (horas * 60) + minutos;
}

let fulldata = null;
let d2cdata = null;
let ordem_status = ["W.Pre-Visit","CARR_ID Incorreto","P.Ship","W.Booking","W.Allocation","Allocation","Picking","Pick Send","With NF","Print","Checking","Mv. Dock","Mf.Created","Loading","GI"]

const Dashboard = {

  globalFilters_in: {"Warehouse Cd.":["C820_L","C820_J","C820_R","C820_G"]},
  globalFilters_out: {},
  chartFilters_in: {},
  chartFilters_out: {"Trans Method.":""},
  DOCreatedFilter: formatarData(),
  DOCreatedBtn: null,
  instances_chart: [],
  instances_head: [],

  Dashboard_start(data){
    
    fulldata = data;
    d2cdata = data.RelatorioD2C;

    this.initialize_charts();
    this.initialize_table();
    this.initialize_buttons();
    this.initialize_redim();

    this.update();
  
  },
  initialize_redim(){
    const mobileQuery = window.matchMedia("(max-width: 768px)");

    function verificarDispositivo(e) {
      if (e.matches) {
        Dashboard.myChartStatus.chart.destroy()
        Dashboard.myChartDOCreated.chart.destroy()
        Dashboard.instances_chart = Dashboard.instances_chart.filter(
          item => item && item.chartId !== 'Status' && item.chartId !== 'D/O Date'
        );        
        Dashboard.myChartStatus = new ChartManager("Status","horizontalBar",Dashboard.myChartStatusData,Dashboard.myChartDivisionOpt,"Azul",Dashboard);
        Dashboard.myChartDOCreated = new ChartManager("D/O Date","horizontalBar",Dashboard.myChartDOCreatedData,Dashboard.myChartDivisionOpt,"Azul",Dashboard);
      
        document.querySelectorAll(".chart-area-desc").forEach(el => {
          el.classList.remove("chart-area-desc");
          el.classList.add("chart-area-mob");
        })

      } else {
        Dashboard.myChartStatus.chart.destroy()
        Dashboard.myChartDOCreated.chart.destroy()
        Dashboard.instances_chart = Dashboard.instances_chart.filter(
          item => item && item.chartId !== 'Status' && item.chartId !== 'D/O Date'
        );      
        Dashboard.myChartStatus = new ChartManager("Status","bar",Dashboard.myChartStatusData,Dashboard.myChartStatusOpt,"Azul",Dashboard);
        Dashboard.myChartDOCreated = new ChartManager("D/O Date","line",Dashboard.myChartDOCreatedData,Dashboard.myChartDOCreatedOpt,"Azul",Dashboard);

        document.querySelectorAll(".chart-area-mob").forEach(el => {
          el.classList.remove("chart-area-mob");
          el.classList.add("chart-area-desc");
        })
      }
    }

    verificarDispositivo(mobileQuery);

    mobileQuery.addEventListener("change", verificarDispositivo);
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
        data: [],
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

    var DataTransmetod = {
      labels: [],
      datasets: [{
        label: "Itens",
        fill: true,
        backgroundColor: 'rgba(66,134,121,0.2)',
        borderColor: '#00f2c3',
        borderWidth: 2,
        pointBackgroundColor: '#00f2c3',
        pointBorderColor: 'rgba(255,255,255,0)',
        pointRadius: 5,
        data: [],
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

    var DataStatus = {
      labels: [],
      datasets: [{
        label:"Itens",
        fill: true,
        backgroundColor:"rgba(31, 143, 241, 0.05)",
        borderColor: '#1f8ef1',
        borderWidth: 2,
        data: [],
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
          display: false, 
          gridLines: {
              drawBorder: false, 
              display: false 
          }
        }],
        xAxes: [{
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            autoSkip: false,
            maxRotation: 0,
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

    var DataDivision = {
      labels: [],
      datasets: [{
        label: "Itens",
        fill: true,
        backgroundColor: "rgba(0, 242, 194, 0.02)",
        borderColor: '#1f8ef1',
        borderWidth: 2,
        data: [],
      }]
    }
    var OptionsDivision = {
      plugins: {
        legend: {
          display: true,
        },
        datalabels: {
          color: 'rgba(255, 255, 255, 0.8)',
          anchor: "end",  
          align: "right", 
          offset: 10,
          padding: 10,
          font: {
            size: 18,
          },
          formatter: (value) => `${value?value.toLocaleString('pt-BR'):value}`,
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
            padding: 20,
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
        type: "line",
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
          formatter: (value) => `${value.toLocaleString('pt-BR')}`,
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

    var DataType = {
      labels: [],
      datasets: [{
        label: "Itens",
        borderColor: ["#00f2c3","#1f8ef1"],
        fill: true,
        backgroundColor: ["rgba(0, 242, 194, 0.05)","rgba(31, 143, 241, 0.05)"],
        borderWidth: 3,
        data: [],
      }]
    }
    var OptionsType = {
      cutoutPercentage: 50,
      maintainAspectRatio: false,
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

    this.myChartCap = new ChartManager("CapPorcent","doughnut",DataCap,OptionsCap,"",this);
    this.myChartTransmetod = new ChartManager("Trans Method.","line",DataTransmetod,OptionsTransmetod,"Verde",this);
    this.myChartStatus = new ChartManager("Status","bar",DataStatus,OptionsStatus,"Azul",this);
    this.myChartDivision = new ChartManager("Division","horizontalBar",DataDivision,OptionsDivision,"Azul",this);
    this.myChartDOCreated = new ChartManager("D/O Date","line",DataDOCreated,OptionsDOCreated,"Azul",this);
    this.myChartType = new ChartManager("D/O Type","doughnut",DataType,OptionsType,"",this)

    this.myChartStatusOpt = OptionsStatus
    this.myChartStatusData = DataStatus

    this.myChartDOCreatedOpt = OptionsDOCreated
    this.myChartDOCreatedData = DataDOCreated

    this.myChartDivisionOpt = OptionsDivision
    
  },
  initialize_table(){
    const container = document.getElementById('excelTable');
    this.table = new Handsontable(container, {
      data: [0,0,0,0,0,0,0,0,0,0,0,0],
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
      columnSorting: true,
      columnSorting: {
        headerAction: false,
      },
      copyPaste: {
      copyColumnHeaders: true,
      },
      autoWrapRow: true,
      autoWrapCol: true,
      filters: true,        
      dropdownMenu: ['filter_by_condition', 'filter_by_value', 'filter_action_bar'],
      contextMenu: ['copy','copy-with-headers','alignment'],       
      licenseKey: 'non-commercial-and-evaluation',
      beforecopy: (data, coords) => {
        if (!coords.length) return;

        const startCol = coords[0].startCol;
        const endCol = coords[0].endCol;

        const headers = [];
        for (let col = startCol; col <= endCol; col++){
          headers.push(this.table.getColHeader(col));
        }
        data.unshift(headers);
      }
    });
  },
  verificafilters(){
    btn_filters = document.querySelectorAll('.icon-filter-remove:not(#clear-all)').length
    if(btn_filters === 0 ){
      $("[id='clear-all']").removeClass("icon-filter-remove")
      $("[id='clear-all']").removeClass("btn")
      $("[id='clear-all']").removeClass("btn-info")
      document.getElementById("clear-all").innerHTML = ""
    } else {
      $("[id='clear-all']").addClass('icon-filter-remove');
      $("[id='clear-all']").addClass("btn")
      $("[id='clear-all']").addClass("btn-info")
      document.getElementById("clear-all").innerHTML = " All"
    }
  },
  initialize_buttons(){
    $("#Current").click(function() {
      Dashboard.DOCreatedBtn = null
      Dashboard.DOCreatedFilter = formatarData(Dashboard.DOCreatedBtn);
      Dashboard.update_charts();
    });
    $("#D-1").click(function() {
      Dashboard.DOCreatedBtn = 1
      Dashboard.DOCreatedFilter = formatarData(Dashboard.DOCreatedBtn);
      Dashboard.update_charts();
    });
    $("#D-2").click(function() {
      Dashboard.DOCreatedBtn = 2
      Dashboard.DOCreatedFilter = formatarData(Dashboard.DOCreatedBtn);
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
    $("#C820_G").click(function() {
      const key = "Warehouse Cd.";
      const value = "C820_G";
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
      const filtros = {
        "Status": ["GI"],
        "Storage Location": ["FCBA"],
        "Trans Method.": ["T01", "M02"],
        "PGI Date": formatarData()
      };
      Object.entries(filtros).forEach(([key, value]) => {
        if (Dashboard.chartFilters_out[key]) {
          delete Dashboard.chartFilters_out[key];
          $("[id='filter-clear-backlog']").removeClass("icon-filter-remove")
        } else {
          Dashboard.chartFilters_out[key] = value;
          $("[id='filter-clear-backlog']").addClass("icon-filter-remove")
        }
      });
      Dashboard.verificafilters();
      Dashboard.update_charts();
      Dashboard.update_tables();
    });
    $("[id='filter-clear-Trans Method.']").click(function() {
      delete Dashboard.chartFilters_in["Trans Method."]
      $("[id='filter-clear-Trans Method.']").removeClass("icon-filter-remove")
      Dashboard.update_charts();
      Dashboard.update_tables();
      Dashboard.verificafilters();
    });
    $("[id='filter-clear-D/O Type']").click(function() {
      delete Dashboard.chartFilters_in["D/O Type"]
      $("[id='filter-clear-D/O Type']").removeClass("icon-filter-remove")
      Dashboard.update_charts();
      Dashboard.update_tables();
      Dashboard.verificafilters();
    });
    $("[id='filter-clear-Division']").click(function() {
      delete Dashboard.chartFilters_in["Division"]
      $("[id='filter-clear-Division']").removeClass("icon-filter-remove")
      Dashboard.update_charts();
      Dashboard.update_tables();
      Dashboard.verificafilters();
    });
    $("[id='filter-clear-Status']").click(function() {
      delete Dashboard.chartFilters_in["Status"]
      $("[id='filter-clear-Status']").removeClass("icon-filter-remove")
      Dashboard.update_charts();
      Dashboard.update_tables();
      Dashboard.verificafilters();
    });
    $("[id='filter-clear-D/O Date']").click(function() {
      delete Dashboard.chartFilters_in["D/O Date"]
      $("[id='filter-clear-D/O Date']").removeClass("icon-filter-remove")
      Dashboard.update_charts();
      Dashboard.update_tables();
      Dashboard.verificafilters();
    });
    $("[id='clear-all']").click(function() {
      document.querySelectorAll('.icon-filter-remove:not(#clear-all)').forEach(button => button.click());
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

    const dataAtual = formatarData();
    const dataMenos1 = formatarData(1);
    const dataMenos2 = formatarData(2);

    let Backlog = 0, GI_DMenos2 = 0, GI_DMenos1 = 0, GI_Current = 0, GI_Exp = 0, inprocess = 0;
    let expected = ["Checking","Mf.Created","Loading"];
    let trsMethod = ["T01","M02"];

    datadfiltered.forEach(row => {
        const pgiDate = row["PGI Date"].split(" ")[0];
        const giDate = row["GI Date"].split(" ")[0];
        const orderQty = row["Order Quantity"];

        if (row["Storage Location"] !== "FCBA" && row["Status"] !== "GI" && StrToDate(pgiDate) < StrToDate(dataAtual) && !trsMethod.includes(row["Trans Method."])) {
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
        if (row["Status"] !== "GI"){
          inprocess += orderQty;
        }
    });

    GI_Exp = GI_Exp + GI_Current

    const Capacidade = fulldata.Capacidade
    .filter(row => this.globalFilters_in["Warehouse Cd."].includes(row["Warehouse Cd."]))
    .reduce((acc, item) => {return acc + item["Cap"];}, 0);

    let PendingCap = Capacidade - GI_Current;
    let porcentagemmeta;

    if(GI_Current >= Capacidade){
      PendingCap = 0
      porcentagemmeta = 100
    } else if(PendingCap > inprocess) {
      PendingCap = inprocess;
      porcentagemmeta = Math.round(GI_Current / (PendingCap + GI_Current) * 100)
    } else {
      porcentagemmeta = Math.round(GI_Current / (PendingCap + GI_Current) * 100)
    }

    var lastupdateIcon = " <i class='tim-icons icon-refresh-01 text-info'></i> ";
    // var lastupdateDescription = " Last Update: ";

    var capIcon = "<i class='tim-icons  icon-app text-info'></i>";
    var capDescription = " Target: ";

    var inprocessDescription = "In process: "

    document.getElementById("lastupdate").innerHTML = lastupdateIcon + (lastupdate.toLocaleString('pt-BR')) ;
    document.getElementById("backlog").innerHTML = Backlog.toLocaleString('pt-BR');
    document.getElementById("GID2").innerHTML = GI_DMenos2.toLocaleString('pt-BR');
    document.getElementById("GID1").innerHTML = GI_DMenos1.toLocaleString('pt-BR');
    document.getElementById("GICurrent").innerHTML = (GI_Current.toLocaleString('pt-BR'))
    document.getElementById("Cap").innerHTML = (capIcon + capDescription + Capacidade.toLocaleString('pt-BR'));
    document.getElementById("PendingCap").innerHTML = PendingCap.toLocaleString('pt-BR');
    document.getElementById("GIExpected").innerHTML = GI_Exp.toLocaleString('pt-BR');
    document.getElementById("inprocess").innerHTML = inprocessDescription + inprocess.toLocaleString('pt-BR') + "  ";
    
    this.myChartCap.chart.data.datasets[0].data = [porcentagemmeta, 100-porcentagemmeta];
    this.myChartCap.chart.update();

  },
  update_charts(type){
    
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
    const ignoredCharts = ["CapPorcent"]

    this.instances_chart.forEach(instance => {
        const { chartId, chart } = instance;
        const isDODate = chartId === "D/O Date";
        const chartData = isDODate ? processedChartDataDOCreated : processedChartData;

        if (chartData?.[chartId]) {
          const { labels, dados } = chartData[chartId];

          if (type === "Click") {

            chart.data.datasets[0].data = chart.data.labels.map(label => {
              const searchLabel = isDODate ? `${this.DOCreatedFilter} ${label}` : label;
              const index = labels.indexOf(searchLabel);
              return index >= 0 ? dados[index] : 0;
            });
            
          } else {
            if (chartId === "Division") {

              const sortedData = labels
              .map((label, index) => ({ label, value: dados[index] }))
              .sort((a, b) => b.value - a.value); 
              chart.data.labels = sortedData.map(item => item.label);
              chart.data.datasets[0].data = sortedData.map(item => item.value);

            } else if (chartId === "Status") {

              const sortedData = labels
              .map((label, index) => ({ label, value: dados[index] }))
              .sort((a, b) => { return ordem_status.indexOf(a.label) - ordem_status.indexOf(b.label); }); 
              chart.data.labels = sortedData.map(item => item.label);
              chart.data.datasets[0].data = sortedData.map(item => item.value);

            } else if(chartId === "D/O Date") {

              chart.data.datasets[0].data = chart.data.labels.map(label => {
                const searchLabel = isDODate ? `${this.DOCreatedFilter} ${label}` : label;
                const index = labels.indexOf(searchLabel);
                return index >= 0 ? dados[index] : 0;
              });
              chart.data.datasets[1].data = Array(24).fill(Math.round(fulldata.Capacidade.filter(row => this.globalFilters_in["Warehouse Cd."].includes(row["Warehouse Cd."])).reduce((acc, item) => {return acc + item["Cap"]}, 0)/24));
            
            } else {
              chart.data.labels = labels;
              chart.data.datasets[0].data = dados;
            }
          }
          chart.update();
        } else if(!ignoredCharts.includes(chartId)) {
          chart.data.datasets[0].data = []
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
    const filter_out = data.filter(item =>
      Object.entries(this.chartFilters_out).every(([key, values]) =>
        key === "PGI Date" ?
          StrToDate(item[key]) < StrToDate(values):
          Array.isArray(values) ?
            !values.includes(item[key]) : item[key] !== values
      )
    );
    const filter_in = filter_out.filter(item =>
      Object.entries(this.chartFilters_in).every(([key, value]) => key == "D/O Date"? item[key].split(":")[0]+":00" === value: item[key] === value)
    );
    return filter_in;
  },
  globalfilterdata(data){
    const filter_out = data.filter(item =>
      Object.entries(this.globalFilters_out).every(([key, values]) =>
        key === "Item Code" ?
          !values.includes(item[key].substr(0, 8)):
          key === "PGI Date" ?
            StrToDate(item[key]) < StrToDate(values):
            Array.isArray(values) ?
              !values.includes(item[key]) : item[key] !== values
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
        if (coluna !== "Order Quantity") { 
          const chave = coluna; 

          dadosAgrupados[chave] ??= {};
          let categoria = chave=="D/O Date" ? row[chave].split(":")[0] + ":00" : row[chave];
          const quantidade = row["Order Quantity"] ?? 0; 
  
          dadosAgrupados[chave][categoria] = (dadosAgrupados[chave][categoria] || 0) + quantidade;
        }
      });
    });

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

const Aging = {
  globalFilters_in: {"Warehouse Cd.":["C820_L","C820_J","C820_R","C820_G"]},
  globalFilters_out: {},
  chartFilters_in: {},
  chartFilters_out: {},
  instances_chart: [],
  instances_head: [],

  Aging_start(data){
    
    fulldata = data;
    d2cdata = data.RelatorioD2C;

    this.initialize_charts();
    this.initialize_table();
    this.initialize_buttons();

    this.update();

  },
  initialize_charts(){
    const Labels = ["até 30m","30m até 1h","Maior que 1h"];

    var DataPendCheck = {
      labels: Labels,
      datasets: [{
        label: "Itens",
        borderColor: ["#2dce89","#ffd600","#f5365c"],
        fill: true,
        backgroundColor: ["rgba(45, 206, 136, 0.15)","rgba(255, 213, 0, 0.15)","rgba(245, 54, 92, 0.15)"],
        borderWidth: 3,
        data: [0,0,0]
      }]
    }
    var OptionsPendCheck = {
      cutoutPercentage: 70,
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
      scale: {
        gridLines: {
            circular: true,
            display: false 
        },
        angleLines: {
            display: false 
        },
        ticks: {
          display: false 
        }
      },
    };

    var DataPendManifest = {
      labels: Labels,
      datasets: [{
        label: "Itens",
        borderColor: ["#2dce89","#ffd600","#f5365c"],
        fill: true,
        backgroundColor: ["rgba(45, 206, 136, 0.15)","rgba(255, 213, 0, 0.15)","rgba(245, 54, 92, 0.15)"],
        borderWidth: 3,
        data: [0,0,0]
      }]
    }
    var OptionsPendManifest = {
      cutoutPercentage: 70,
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
      scale: {
        gridLines: {
            circular: true,
            display: false 
        },
        angleLines: {
            display: false 
        },
        ticks: {
          display: false 
        }
      },
    };

    var DataPendLoad = {
      labels: Labels,
      datasets: [{
        label: "Itens",
        borderColor: ["#2dce89","#ffd600","#f5365c"],
        fill: true,
        backgroundColor:["rgba(45, 206, 136, 0.15)","rgba(255, 213, 0, 0.15)","rgba(245, 54, 92, 0.15)"],
        borderWidth: 3,
        data: [0,0,0]
      }]
    }
    var OptionsPendLoad = {
      cutoutPercentage: 70,
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
      scale: {
        gridLines: {
            circular: true,
            display: false 
        },
        angleLines: {
            display: false 
        },
        ticks: {
          display: false 
        }
      },
    };

    var DataPendGI = {
      labels: Labels,
      datasets: [{
        label: "Itens",
        borderColor: ["#2dce89","#ffd600","#f5365c"],
        fill: true,
        backgroundColor: ["rgba(45, 206, 136, 0.15)","rgba(255, 213, 0, 0.15)","rgba(245, 54, 92, 0.15)"],
        borderWidth: 3,
        data: [0,0,0]
      }]
    }
    var OptionsPendGI = {
      cutoutPercentage: 70,
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
      scale: {
        gridLines: {
            circular: true,
            display: false 
        },
        angleLines: {
            display: false 
        },
        ticks: {
          display: false 
        }
      },
    };


    var DataPendPick = {
      labels: Labels,
      datasets: [{
        label: "Itens",
        borderColor: ["#2dce89","#ffd600","#f5365c"],
        fill: true,
        backgroundColor:["rgba(45, 206, 136, 0.15)","rgba(255, 213, 0, 0.15)","rgba(245, 54, 92, 0.15)"],
        borderWidth: 3,
        data: [0,0,0]
      }]
    }
    var OptionsPendPick = {
      cutoutPercentage: 70,
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
      scale: {
        gridLines: {
            circular: true,
            display: false 
        },
        angleLines: {
            display: false 
        },
        ticks: {
          display: false 
        }
      },
    };

    var DataPendPickSend = {
      labels: Labels,
      datasets: [{
        label: "Itens",
        borderColor: ["#2dce89","#ffd600","#f5365c"],
        fill: true,
        backgroundColor:["rgba(45, 206, 136, 0.15)","rgba(255, 213, 0, 0.15)","rgba(245, 54, 92, 0.15)"],
        borderWidth: 3,
        data: [0,0,0]
      }]
    }
    var OptionsPendPickSend = {
      cutoutPercentage: 70,
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
      scale: {
        gridLines: {
            circular: true,
            display: false 
        },
        angleLines: {
            display: false 
        },
        ticks: {
          display: false 
        }
      },
    };

    var DataPendNF = {
      labels: Labels,
      datasets: [{
        label: "Itens",
        borderColor: ["#2dce89","#ffd600","#f5365c"],
        fill: true,
        backgroundColor:["rgba(45, 206, 136, 0.15)","rgba(255, 213, 0, 0.15)","rgba(245, 54, 92, 0.15)"],
        borderWidth: 3,
        data: [0,0,0]
      }]
    }
    var OptionsPendNF = {
      cutoutPercentage: 70,
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
      scale: {
        gridLines: {
            circular: true,
            display: false 
        },
        angleLines: {
            display: false 
        },
        ticks: {
          display: false 
        }
      },
    };

    var DataPendPrint = {
      labels: Labels,
      datasets: [{
        label: "Itens",
        borderColor: ["#2dce89","#ffd600","#f5365c"],
        fill: true,
        backgroundColor:["rgba(45, 206, 136, 0.15)","rgba(255, 213, 0, 0.15)","rgba(245, 54, 92, 0.15)"],
        borderWidth: 3,
        data: [0,0,0]
      }]
    }
    var OptionsPendPrint = {
      cutoutPercentage: 70,
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
      scale: {
        gridLines: {
            circular: true,
            display: false 
        },
        angleLines: {
            display: false 
        },
        ticks: {
          display: false 
        }
      },
    };

    var DataPendMvDock = {
      labels: Labels,
      datasets: [{
        label: "Itens",
        borderColor: ["#2dce89","#ffd600","#f5365c"],
        fill: true,
        backgroundColor:["rgba(45, 206, 136, 0.15)","rgba(255, 213, 0, 0.15)","rgba(245, 54, 92, 0.15)"],
        borderWidth: 3,
        data: [0,0,0]
      }]
    }
    var OptionsPendMvDock = {
      cutoutPercentage: 70,
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
      scale: {
        gridLines: {
            circular: true,
            display: false 
        },
        angleLines: {
            display: false 
        },
        ticks: {
          display: false 
        }
      },
    };

    this.myChartPendPick = new ChartManager("Allocation","polarArea",DataPendPick,OptionsPendPick,"",this);
    this.myChartPendPickSend = new ChartManager("Picking","polarArea",DataPendPickSend,OptionsPendPickSend,"",this);
    this.myChartPendNF = new ChartManager("Pick Send","polarArea",DataPendNF,OptionsPendNF,"",this);
    this.myChartPendPrint = new ChartManager("With NF","polarArea",DataPendPrint,OptionsPendPrint,"",this);
    this.myChartPendCheck = new ChartManager("Print","polarArea",DataPendCheck,OptionsPendCheck,"",this);
    this.myChartPendMvDock = new ChartManager("Checking","polarArea",DataPendMvDock,OptionsPendMvDock,"",this);
    this.myChartPendManifest = new ChartManager("Mv. Dock","polarArea",DataPendManifest,OptionsPendManifest,"",this);
    this.myChartPendLoad = new ChartManager("Mf.Created","polarArea",DataPendLoad,OptionsPendLoad,"",this);
    this.myChartPendGI = new ChartManager("Loading","polarArea",DataPendGI,OptionsPendGI,"",this);
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
        "Item Code ㅤ",
        "Order Quantity",
        "Temp. Decorrido",
        "D/O Date",
        "PGI Date",
        "Alloc Date",
        "Pick Date",
        "Pick Send Date",
        "XML Date",
        "Packing Labeling Date",
        "Check Date",
        "Move To Dock Date",
        "Manifest Date",
        "Load Date",
        "Lsp Name",
        "Storage Location",
        "Division",
        "Status"
      ],
      columnSorting: true,
      columnSorting: {
        headerAction: false,
      },
      autoWrapRow: true,
      autoWrapCol: true,
      filters: true,        
      dropdownMenu: ['filter_by_condition', 'filter_by_value', 'filter_action_bar'],
      contextMenu: ['copy'],       
      licenseKey: 'non-commercial-and-evaluation'
    });
  },
  initialize_buttons(){
    $("#C820_L").click(function() {
      const key = "Warehouse Cd.";
      const value = "C820_L";
      const index = Aging.globalFilters_in[key].indexOf(value);
      if (index !== -1) {
        Aging.globalFilters_in[key].splice(index, 1);
      } else {
        Aging.globalFilters_in[key].push(value);
      }
      Aging.update();
    });
    $("#C820_J").click(function() {
      const key = "Warehouse Cd.";
      const value = "C820_J";
      const index = Aging.globalFilters_in[key].indexOf(value);
      if (index !== -1) {
        Aging.globalFilters_in[key].splice(index, 1);
      } else {
        Aging.globalFilters_in[key].push(value);
      }
      Aging.update();
    });
    $("#C820_R").click(function() {
      const key = "Warehouse Cd.";
      const value = "C820_R";
      const index = Aging.globalFilters_in[key].indexOf(value);
      if (index !== -1) {
        Aging.globalFilters_in[key].splice(index, 1);
      } else {
        Aging.globalFilters_in[key].push(value);
      }
      Aging.update();
    });
    $("#C820_G").click(function() {
      const key = "Warehouse Cd.";
      const value = "C820_G";
      const index = Aging.globalFilters_in[key].indexOf(value);
      if (index !== -1) {
        Aging.globalFilters_in[key].splice(index, 1);
      } else {
        Aging.globalFilters_in[key].push(value);
      }
      Aging.update();
    });
    $("#btn_pick").click(function() {
      const key = "Allocation";
      const value = null;
      if (Aging.chartFilters_in[key] === value) {
        delete Aging.chartFilters_in[key]
      } else {
        Aging.chartFilters_in[key] = value;
      }
      Aging.update();
    });
    $("#btn_picksend").click(function() {
      const key = "Picking";
      const value = null;
      if (Aging.chartFilters_in[key] === value) {
        delete Aging.chartFilters_in[key]
      } else {
        Aging.chartFilters_in[key] = value;
      }
      Aging.update();
    });
    $("#btn_nf").click(function() {
      const key = "Pick Send";
      const value = null;
      if (Aging.chartFilters_in[key] === value) {
        delete Aging.chartFilters_in[key]
      } else {
        Aging.chartFilters_in[key] = value;
      }
      Aging.update();
    });
    $("#btn_print").click(function() {
      const key = "With NF";
      const value = null;
      if (Aging.chartFilters_in[key] === value) {
        delete Aging.chartFilters_in[key]
      } else {
        Aging.chartFilters_in[key] = value;
      }
      Aging.update();
    });
    $("#btn_check").click(function() {
      const key = "Print";
      const value = null;
      if (Aging.chartFilters_in[key] === value) {
        delete Aging.chartFilters_in[key]
      } else {
        Aging.chartFilters_in[key] = value;
      }
      Aging.update();
    });
    $("#btn_mvdock").click(function() {
      const key = "Checking";
      const value = null;
      if (Aging.chartFilters_in[key] === value) {
        delete Aging.chartFilters_in[key]
      } else {
        Aging.chartFilters_in[key] = value;
      }
      Aging.update();
    });
    $("#btn_manifest").click(function() {
      const key = "Mv. Dock";
      const value = null;
      if (Aging.chartFilters_in[key] === value) {
        delete Aging.chartFilters_in[key]
      } else {
        Aging.chartFilters_in[key] = value;
      }
      Aging.update();
    });
    $("#btn_load").click(function() {
      const key = "Mf.Created";
      const value = null;
      if (Aging.chartFilters_in[key] === value) {
        delete Aging.chartFilters_in[key]
      } else {
        Aging.chartFilters_in[key] = value;
      }
      Aging.update();
    });
    $("#btn_gi").click(function() {
      const key = "Loading";
      const value = null;
      if (Aging.chartFilters_in[key] === value) {
        delete Aging.chartFilters_in[key]
      } else {
        Aging.chartFilters_in[key] = value;
      }
      Aging.update();
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

    // Mapeia os status para os nomes das variáveis correspondentes
    const pendingsMap = {
      "Allocation": "PendPick",
      "Picking": "PendPickSend",
      "Picking Send": "PendNF",
      "With NF": "PendPrint",
      "Print": "Pendcheck",
      "Checking": "PendMvDock",
      "MV. Dock": "Pendmanifest",
      "Mf.Created": "Pendload",
      "Loading": "Pendgi",
    };

    // Inicializa todas as variáveis dinamicamente
    let counts = {
      PendPick: 0,
      PendPickSend: 0,
      PendNF: 0,
      PendPrint: 0,
      Pendcheck: 0,
      PendMvDock: 0,
      Pendmanifest: 0,
      Pendload: 0,
      Pendgi: 0,
    };

    // Percorre os dados filtrados e atualiza os contadores dinamicamente
    datadfiltered.forEach(row => {
      const key = pendingsMap[row["Status"]];
      if (key) counts[key] += row["Order Quantity"];
    });

    // Desestruturação opcional para acessar as variáveis diretamente
    const { PendPick, PendPickSend, PendNF, PendPrint, Pendcheck, PendMvDock, Pendmanifest, Pendload, Pendgi } = counts;


    var lastupdateIcon = "<i class='tim-icons icon-refresh-01 text-info'></i>";
    var lastupdateDescription = " Last Update: ";

    document.getElementById("lastupdate").innerHTML = lastupdateIcon + lastupdateDescription + (lastupdate.toLocaleString('pt-BR'));
    document.getElementById("Lb_PendPick").innerHTML = PendPick.toLocaleString('pt-BR');
    document.getElementById("Lb_PendPickSend").innerHTML = PendPickSend.toLocaleString('pt-BR');
    document.getElementById("Lb_PendNF").innerHTML = PendNF.toLocaleString('pt-BR');
    document.getElementById("Lb_PendPrint").innerHTML = PendPrint.toLocaleString('pt-BR');
    document.getElementById("Lb_PendCheck").innerHTML = Pendcheck.toLocaleString('pt-BR');
    document.getElementById("Lb_PendMvDock").innerHTML = PendMvDock.toLocaleString('pt-BR');
    document.getElementById("Lb_PendManifest").innerHTML = Pendmanifest.toLocaleString('pt-BR');
    document.getElementById("Lb_PendLoad").innerHTML = Pendload.toLocaleString('pt-BR');
    document.getElementById("Lb_PendGI").innerHTML = Pendgi.toLocaleString('pt-BR');

  },
  update_charts(type){
    const processedChartData = this.ChartDataProcess(
      this.globalfilterdata(
        this.filterdata(d2cdata.filter(item => item["Status"] !== "GI"))
      )
    );
    this.instances_chart.forEach(instance => {
        const { chartId, chart } = instance;
        const chartData = processedChartData;

        if (chartData?.[chartId]) {
          chart.data.datasets[0].data = chart.data.labels.map(label => {
            return chartData[chartId][0][label]
          });
          chart.update();
        } else {
          chart.data.datasets[0].data = [0,0,0]
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
        row["Item Code"] ?? "",
        row["Order Quantity"] ?? "",
        row["Temp. Decorrido"] ?? "",
        row["D/O Date"] ?? "",
        row["PGI Date"] ?? "",
        row["Alloc Date"] ?? "",
        row["Pick Date"] ?? "",
        row["Pick Send Date"] ?? "",
        row["XML Date"] ?? "",
        row["Packing Labeling Date"] ?? "",
        row["Check Date"] ?? "",
        row["Move To Dock Date"] ?? "",
        row["Manifest Date"] ?? "",
        row["Load Date"] ?? "",
        row["Lsp Name"] ?? "",
        row["Storage Location"] ?? "",
        row["Division"] ?? "",
        row["Status"] ?? ""

      ]))
    );
    this.table.getPlugin('columnSorting').sort({
      column: 4, 
      sortOrder: 'desc'
    });
  },
  filterdata(data){
    const filter_out = data.filter(item =>
      Object.entries(this.chartFilters_out).every(([key, values]) =>
        key === "PGI Date" ?
          StrToDate(item[key]) < StrToDate(values):
          Array.isArray(values) ?
            !values.includes(item[key]) : item[key] !== values
      )
    );
    const agora = new Date();
    const filter_in = filter_out.map(item => {
      let dataItem;  

      const statusDateMap = {
        "Allocation": "Alloc Date",
        "Picking": "Pick Date",
        "Pick Send": "Pick Send Date",
        "With NF": "XML Date",
        "Print": "Packing Labeling Date",
        "Checking": "Check Date",
        "Mv. Dock": "Move To Dock Date",
        "Mf.Created": "Manifest Date",
        "Loading": "Load Date"
      };
    
      const dateKey = statusDateMap[item.Status];
      
      if (dateKey) {
        dataItem = new Date(convertToUSFormat(item[dateKey]));
      }

      let diffMinutos = dataItem ? Math.floor((agora - dataItem) / (1000 * 60)) : null;
      
      item["Temp. Decorrido"] = formatMtoDH(diffMinutos);
  
      return item;
    })
    .filter(item =>
      Object.entries(this.chartFilters_in).every(([key, values]) => {
        if (!item["Temp. Decorrido"]) return false; 

        if (values === null) {
          return item["Status"] === key;
        }

        const tempo = convDHtoM(item["Temp. Decorrido"]);

        return item["Status"] === key &&
          (values === "até 30m" ? tempo < 30 :
          values === "30m até 1h" ? tempo >= 30 && tempo <= 60 :
          tempo > 60);
      })
    );
    return filter_in;
  },
  globalfilterdata(data){
    const filter_out = data.filter(item =>
      Object.entries(this.globalFilters_out).every(([key, values]) =>
        key === "Item Code" ?
          !values.includes(item[key].substr(0, 8)):
          key === "PGI Date" ?
            StrToDate(item[key]) < StrToDate(values):
            Array.isArray(values) ?
              !values.includes(item[key]) : item[key] !== values
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
  ChartDataProcess(tabela) {
    const resultado = {};
    const agora = new Date();

    tabela.forEach(item => {
      let dataItem;
      const statusDateMap = {
        "Picking": "Pick Date",
        "Pick Send": "Pick Send Date",
        "With NF": "XML Date",
        "Print": "Packing Labeling Date",
        "Checking": "Check Date",
        "Mv. Dock": "Move To Dock Date",
        "Mf.Created": "Manifest Date",
        "Loading": "Load Date"
      };
    
      const dateKey = statusDateMap[item.Status];
      
      if (dateKey) {
        dataItem = new Date(convertToUSFormat(item[dateKey]));
      }
    
      const diffMinutos = Math.floor((agora - dataItem) / (1000 * 60));
      
      let categoria;
      if (diffMinutos < 30) {
          categoria = "até 30m";
      } else if (diffMinutos >= 30 && diffMinutos <= 60) {
          categoria = "30m até 1h";
      } else {
          categoria = "Maior que 1h";
      }

      if (!resultado[item.Status]) {
          resultado[item.Status] = [{ "até 30m": 0, "30m até 1h": 0, "Maior que 1h": 0 }];
      }
      resultado[item.Status][0][categoria] += item["Order Quantity"];
    });
    
    return resultado;
  }
};