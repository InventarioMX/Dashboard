type = ['primary', 'info', 'success', 'warning', 'danger'];

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

  initDashboardHeaders: function(datajson) {

    let baseData = datajson.RelatorioD2C;

    let hoje = new Date();
    hoje.setDate(hoje.getDate());
    let dateFiltercurrent = hoje.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    hoje.setDate(hoje.getDate() - 1);
    let dateFilterdmenos1 = hoje.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    hoje.setDate(hoje.getDate() - 1);
    let dateFilterdmenos2 = hoje.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });


    const gicurrent = baseData
    .filter(item => item.Status === "GI" && item["GI Date"].split(" ")[0] === dateFiltercurrent)
    .reduce((acc, item) => {
      return acc + item["Order Quantity"]; 
    }, 0);

    const gidmenos1 = baseData
    .filter(item => item.Status === "GI" && item["GI Date"].split(" ")[0] === dateFilterdmenos1)
    .reduce((acc, item) => {
      return acc + item["Order Quantity"]; 
    }, 0);

    const gidmenos2 = baseData
    .filter(item => item.Status === "GI" && item["GI Date"].split(" ")[0] === dateFilterdmenos2)
    .reduce((acc, item) => {
      return acc + item["Order Quantity"]; 
    }, 0);

    const lastupdate = datajson.UltAtualizacao[0].Atualizacao;

    const tblastupdate = document.getElementById("lastupdate");

    if (lastupdate.length === 0) {
      tblastupdate.innerHTML = "<i class='tim-icons icon-app text-danger'></i> #N/D";
    }else{
      tblastupdate.innerHTML = "<i class='tim-icons icon-refresh-01 text-info'></i> Last Update: " + lastupdate ;
    }

    const tbgicurrent = document.getElementById("gicurrent");

    if (gicurrent.length === 0) {
      tbgicurrent.innerHTML = " #N/D";
    } else {
      tbgicurrent.innerHTML = " " + gicurrent.toLocaleString('pt-BR');
    }

    const tbgidmenos1 = document.getElementById("gidmenos1");

    if (gidmenos1.length === 0) {
      tbgidmenos1.innerHTML = " #N/D";
    }else{
      tbgidmenos1.innerHTML = " " + gidmenos1.toLocaleString('pt-BR');
    }

    const tbgidmenos2 = document.getElementById("gidmenos2");

    if (gidmenos2.length === 0) {
      tbgidmenos2.innerHTML = " #N/D";
    }else{
      tbgidmenos2.innerHTML = " " + gidmenos2.toLocaleString('pt-BR');
    }

    var ctx = document.getElementById('gaugeCap').getContext("2d");

    gradientFillGreen = ctx.createLinearGradient(0, 230, 0, 50);
    gradientFillGreen.addColorStop(0, "rgba(66, 134, 121, 0.18)");
    gradientFillGreen.addColorStop(1, "rgba(66, 134, 121, 0.04)");

    const tbcap = document.getElementById("cap");
    const tbPending = document.getElementById("Pending");
    const capacidade = datajson.Capacidade[0].Cap;
    const Pending = (capacidade - gicurrent) < 0 ? 0 : capacidade - gicurrent;
    tbcap.innerHTML = "" + capacidade.toLocaleString('pt-BR');
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
        backgroundColor: ["#00f2c3", gradientFillGreen], // Cor para o valor e o "restante"
        borderWidth: 3,
        data: [currentValue , 100 - currentValue],
      }],
    }

    ChartOptionsConfigCap = {
      animation: {
        duration: 2000, // Duração da animação em milissegundos
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
          ctx.font = '2.8625rem Poppins'; // Fonte do texto
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


  },

  initDashboardPageCharts: function(datajson) {
    
    baseData = datajson.RelatorioD2C.filter(item => item.Status !== "GI" && item["Storage Location"] !== "FCBA");
    baseDocreated = datajson.RelatorioD2C.filter(item => item["Storage Location"] !== "FCBA")

    let currentTransMethedFilter = null;
    let currentStatusFilter = null;
    let currentTypeFilter = null;
    let currentDOCreatedFilter = null;

    let hoje = new Date();
    hoje.setDate(hoje.getDate());
    let dateFilter = hoje.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    function consolidateData(data, groupField) {
      return data.reduce((acc, row) => {
        if (!currentTransMethedFilter || row["Trans Method#"] === currentTransMethedFilter) {
          if (!currentDOCreatedFilter || row["D/O Date"].split(":")[0] + ":00" === currentDOCreatedFilter) {
            if (!currentStatusFilter || row["Status"] === currentStatusFilter ) {
              if (!currentTypeFilter || row["D/O Type"] === currentTypeFilter) {
                acc[row[groupField]] = (acc[row[groupField]] || 0) + row["Order Quantity"];
              }
            }
          }
        }
        return acc;
      }, {});
    }

    function updateCharts(data) {

      const transmetodConsolidation = consolidateData(data, "Trans Method#");
      const statusConsolidation = consolidateData(data, "Status");
      const typeConsolidation = consolidateData(data, "D/O Type");

      myChartTransmetod.data.datasets[0].data = transmetodLabels.map(label => transmetodConsolidation[label] || 0);
      myChartStep.data.datasets[0].data = statusLabels.map(label => statusConsolidation[label] || 0);
      myChartType.data.datasets[0].data = typeLabels.map(label => typeConsolidation[label] || 0);

      myChartTransmetod.options.scales.yAxes[0].ticks.suggestedMax =  Math.max(...myChartTransmetod.data.datasets[0].data) === 0 ? 1 : Math.max(...myChartTransmetod.data.datasets[0].data)*1.3;
      myChartStep.options.scales.yAxes[0].ticks.suggestedMax =  Math.max(...myChartStep.data.datasets[0].data) === 0 ? 1 : Math.max(...myChartStep.data.datasets[0].data)*1.3;

      myChartTransmetod.update();
      myChartStep.update();
      myChartType.update();
      
    }

    function updatedocreated(data) {
      let base;
      if (currentTypeFilter === null && currentStatusFilter === null && currentTransMethedFilter === null) {
        base = data;
      } else {
        base = data.filter(item => item.Status !== "GI");
      }

      let DOCreatedConsolidation = consolidateData(base, "D/O Date");
      DOCreatedConsolidation = Object.entries(DOCreatedConsolidation)
        .filter(([chave, valor]) => chave.startsWith(dateFilter))
        .reduce((acc, [chave, valor]) => {
          acc[chave.split(" ")[1].split(":")[0] + ":00"] = (acc[chave.split(" ")[1].split(":")[0] + ":00"] || 0) + valor;
          return acc;
        }, {});

      myChartDOCreated.data.datasets[0].data = DOCreatedLabels.map(label => DOCreatedConsolidation[label] || 0);
      myChartDOCreated.options.scales.yAxes[0].ticks.suggestedMax =  Math.max(...myChartDOCreated.data.datasets[0].data) === 0 ? 1 : Math.max(...myChartDOCreated.data.datasets[0].data)*1.3;
      
      var pointColors = [];
      for (let i = 0; i < myChartDOCreated.data.datasets[0].data.length; i++) {
        if (parseInt(myChartDOCreated.data.datasets[0].data[i]) > caphora) {
          pointColors.push('red');
        } else {
          pointColors.push('#2EC0F9');
        }
      }
      myChartDOCreated.data.datasets[0].pointBackgroundColor = pointColors
      myChartDOCreated.update();
    }

    const caphora = datajson.Capacidade[0].Cap;

    const transmetodLabels = [...new Set(baseData.map(row => row["Trans Method#"]))];
    const statusLabels = [...new Set(baseData.map(row => row["Status"]))];
    const typeLabels = [...new Set(baseData.map(row => row["D/O Type"]))];
    const DOCreatedLabels = ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"];
    const caphoralabel = Array(24).fill(caphora/24);

    transmetodLabels.sort();

    var ordem_status = ["00_Waiting Pre-Visit","00_CARR_ID Incorreto","P.Shipmment","W.Booking","W.Allocation","Allocation","Picking","With NF","Print","Checking","Mf.Created","Loading","GI",""]
    statusLabels.sort((a, b) => {
      return ordem_status.indexOf(a) - ordem_status.indexOf(b);
    });
    

    var ctx = document.getElementById("chartLineTransMethod").getContext("2d");
    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(66,134,121,0.15)');
    gradientStroke.addColorStop(0.4, 'rgba(66,134,121,0.0)'); //green colors
    gradientStroke.addColorStop(0, 'rgba(66,134,121,0)'); //green colors

    var data = {
      labels: transmetodLabels,
      datasets: [{
        label: "Itens",
        fill: true,
        backgroundColor: gradientStroke,
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
      onClick: function(e) {
        const activePoints = this.getElementAtEvent(e);
        if (activePoints.length) {
          const clickedIndex = activePoints[0]._index;
          const clickedTransmetod = transmetodLabels[clickedIndex];

          currentTransMethedFilter = currentTransMethedFilter === clickedTransmetod ? null : clickedTransmetod;
          updateCharts(baseData);
          updateTable(baseData);
          updatedocreated(baseDocreated);
        }
      }
    };

    const myChartTransmetod = new Chart(ctx, {
      type: 'line',
      data: data,
      options: ChartOptionsConfigTransmetod
    });

    var ctx = document.getElementById("chartBarStep").getContext("2d");
    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
    
    gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
    gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors

    var data = {
      labels: statusLabels,
      datasets: [{
        label: "Itens",
        fill: true,
        backgroundColor: gradientStroke,
        hoverBackgroundColor: gradientStroke,
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
            
            currentStatusFilter = currentStatusFilter === clickedStatus ? null : clickedStatus;
            updateCharts(baseData);
            updateTable(baseData);
            updatedocreated(baseDocreated);
          },
        }]
      },
      onClick: function(e) {
        const activePoints = this.getElementAtEvent(e);
        if (activePoints.length) {
          const clickedIndex = activePoints[0]._index;
          const clickedStatus = statusLabels[clickedIndex];
          currentStatusFilter = currentStatusFilter === clickedStatus ? null : clickedStatus;
          updateCharts(baseData);
          updateTable(baseData);
          updatedocreated(baseDocreated);
        }
      }
    };

    const myChartStep = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: ChartOptionsConfigStep
    });


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
          
          currentTypeFilter = currentTypeFilter === clickedType ? null : clickedType;
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
      onClick: function(e) {
        const activePoints = this.getElementAtEvent(e);
        if (activePoints.length) {
          const clickedIndex = activePoints[0]._index;
          const clickedType = typeLabels[clickedIndex];

          currentTypeFilter = currentTypeFilter === clickedType ? null : clickedType;
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
        position: "nearest"
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
          const clickedDOCreated =  dateFilter + " " + DOCreatedLabels[clickedIndex];

          currentDOCreatedFilter = currentDOCreatedFilter === clickedDOCreated ? null : clickedDOCreated;

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

    $("#D-2").click(function() {
      hoje.setDate(hoje.getDate() - 2);
      dateFilter = hoje.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
      });
      updatedocreated(baseDocreated);
      hoje.setDate(hoje.getDate() + 2);
    });
    $("#D-1").click(function() {
      hoje.setDate(hoje.getDate() - 1);
      dateFilter = hoje.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
      });
      updatedocreated(baseDocreated);
      hoje.setDate(hoje.getDate() + 1);
    });

    $("#Current").click(function() {
      dateFilter = hoje.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      updatedocreated(baseDocreated);
    });

    let bkbaseData = baseData;
    let bkbaseDocreated = baseDocreated;

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
  
      if (backlog_clic){
        filteredData = filteredData.filter(item => item.Status !== "GI" && item["Storage Location"] !== "FCBA" && item["Trans Method#"] !== "T01" && item["Trans Method#"] !== "M02" && demo.StrToDate(item["PGI Date"]) < demo.StrToDate(dateFilter));
      }

      if(paradigma_clic){
        filteredData = filteredData.filter(item => !modelos.includes(item['Item Code'].substr(0, 8)));
      }

      if(pinparadigma_clic){
        filteredData = filteredData.filter(item => modelos.includes(item['Item Code'].substr(0, 8)));
      }

      baseData = filteredData;

      if (!backlog_clic && !paradigma_clic && !pinparadigma_clic){
        baseDocreated = bkbaseDocreated;
      } else {
        baseDocreated = filteredData;
      }

      let Backlog = baseData
      .filter(item => item.Status !== "GI" && item["Storage Location"] !== "FCBA" && item["Trans Method#"] !== "T01" && item["Trans Method#"] !== "M02" && demo.StrToDate(item["PGI Date"]) < demo.StrToDate(dateFilter))
      .reduce((acc, item) => {
        return acc + item["Order Quantity"]; 
      }, 0);
      tbBacklog.innerHTML = " " + Backlog.toLocaleString('pt-BR');

      let inprocess = baseData
      .filter(item => item.Status !== "GI" && item["Storage Location"] !== "FCBA")
      .reduce((acc, item) => {
        return acc + item["Order Quantity"]; 
      }, 0);
      tbinprocess.innerHTML = "In process: " + inprocess.toLocaleString('pt-BR');

    }


    let backlog_clic = false

    $("#btn_backlog").click(function() {
      if (!backlog_clic) {
        backlog_clic = true
      } else {
        backlog_clic = false
      }
      filtra_click();
      updateCharts(baseData);
      updateTable(baseData);
      updatedocreated(baseDocreated);
    });

    let paradigma_clic = false

    $("#paradigma").click(function() {
      if (!paradigma_clic) {
        paradigma_clic = true
      } else {
        paradigma_clic = false
      }
      filtra_click();
      updateCharts(baseData);
      updateTable(baseData);
      updatedocreated(baseDocreated);
    });

    let pinparadigma_clic = false

    $("#pinparadigma").click(function() {
      if (!pinparadigma_clic) {
        pinparadigma_clic = true
        $("#pinparadigma i").addClass("text-info")
        $("#pinparadigma span").addClass("text-info")
        
      } else {
        pinparadigma_clic = false
        $("#pinparadigma i").removeClass("text-info")
        $("#pinparadigma span").removeClass("text-info")
      }
      filtra_click();
      updateCharts(baseData);
      updateTable(baseData);
      updatedocreated(baseDocreated);
    });


    let Backlog = baseData
    .filter(item => item.Status !== "GI" && item["Storage Location"] !== "FCBA" && item["Trans Method#"] !== "T01" && item["Trans Method#"] !== "M02" && demo.StrToDate(item["PGI Date"]) < demo.StrToDate(dateFilter))
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


    // const tableHeader = document.getElementById("tableHeader");

    // tableHeader.innerHTML = "";

    // const headers = ["D/O No#", "D/O Date", "PGI Date", "Item Code", "Storage Location", "Plant Code", "Trans Method#", "Order Quantity", "D/O Type", "Status"];
    // headers.forEach(header => {
    //   const th = document.createElement("th");
    //   th.textContent = header;
    //   tableHeader.appendChild(th);
    // });

    // const tabela = $('#dataTable').DataTable({
    //   scrollY: '350px',
    //   paging: true,
    //   searching: true,
    //   ordering: true,
    //   responsive: true,
    //   language: {
    //       lengthMenu: "Mostrar _MENU_ registros por página",
    //       zeroRecords: "Nada encontrado",
    //       info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
    //       infoEmpty: "Nenhum registro disponível",
    //       infoFiltered: "(filtrado de _MAX_ registros no total)",
    //       search: "Buscar:",
    //       paginate: {
    //       first: "Primeiro",
    //       last: "Último",
    //       next: "Próximo",
    //       previous: "Anterior"
    //       },
    //   },
    // });

    // function updateTable() {

    //   // Filtrar dados com base nos filtros atuais
    //   const filteredData = baseData.filter(row => {
    //     return (
    //       (!currentTransMethedFilter || row["Trans Method#"] === currentTransMethedFilter) &&
    //       (!currentDOCreatedFilter || row["D/O Date"].split(":")[0] + ":00" === currentDOCreatedFilter) &&
    //       (!currentStatusFilter || row["Status"] === currentStatusFilter) &&
    //       (!currentTypeFilter || row["D/O Type"] === currentTypeFilter)
    //     );
    //   });

    //   // Limpar tabela existente
    //   tabela.clear();

    //   if (filteredData.length === 0) {
    //     // Adicionar uma linha com mensagem de dados indisponíveis
    //     tabela.row.add(["Nenhum dado disponível", "", "", "", "", "", "", "", "", ""]);
    //   } else {
    //     // Adicionar os dados filtrados
    //     filteredData.forEach(row => {
    //       tabela.row.add([
    //         row["D/O No#"] || "",
    //         row["D/O Date"] || "",
    //         row["PGI Date"] || "",
    //         row["Item Code"] || "",
    //         row["Storage Location"] || "",
    //         row["Plant Code"] || "",
    //         row["Trans Method#"] || "",
    //         row["Order Quantity"] || "",
    //         row["D/O Type"] || "",
    //         row["Status"] || ""
    //       ]);
    //     });
    //   }

    //   // Redesenhar a tabela
    //   tabela.draw();

    // }

    const container = document.getElementById('excelTable');

    const hot = new Handsontable(container, {
      data: [],
      height: 450,
      stretchH: 'all',
      colHeaders: [        
        "D/O No#",
        "D/O Date",
        "PGI Date",
        "Item Code",
        "Storage Location",
        "Plant Code",
        "Trans Method#",
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
          (!currentTransMethedFilter || row["Trans Method#"] === currentTransMethedFilter) &&
          (!currentDOCreatedFilter || row["D/O Date"].split(":")[0] + ":00" === currentDOCreatedFilter) &&
          (!currentStatusFilter || row["Status"] === currentStatusFilter) &&
          (!currentTypeFilter || row["D/O Type"] === currentTypeFilter)
        );
      })
      .map(row => [
        row["D/O No#"] || "",
        row["D/O Date"] || "",
        row["PGI Date"] || "",
        row["Item Code"] || "",
        row["Storage Location"] || "",
        row["Plant Code"] || "",
        row["Trans Method#"] || "",
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