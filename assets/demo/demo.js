
type = ['primary', 'info', 'success', 'warning', 'danger'];

data = {

};

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

  initDashboardHeaders: function(datajson) {

    let hoje = new Date();
    hoje.setDate(hoje.getDate() - 17);
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


    const gicurrent = datajson.RelatorioD2C
    .filter(item => item.Status === "GI" && item["GI Date"].split(" ")[0] === dateFiltercurrent)
    .reduce((acc, item) => {
      return acc + item["Order Quantity"]; 
    }, 0)
    .toLocaleString('pt-BR');

    const gidmenos1 = datajson.RelatorioD2C
    .filter(item => item.Status === "GI" && item["GI Date"].split(" ")[0] === dateFilterdmenos1)
    .reduce((acc, item) => {
      return acc + item["Order Quantity"]; 
    }, 0)
    .toLocaleString('pt-BR');

    const gidmenos2 = datajson.RelatorioD2C
    .filter(item => item.Status === "GI" && item["GI Date"].split(" ")[0] === dateFilterdmenos2)
    .reduce((acc, item) => {
      return acc + item["Order Quantity"]; 
    }, 0)
    .toLocaleString('pt-BR');


    const Backlogdmenos1 = datajson.RelatorioD2C
    .filter(item => item.Status !== "GI" && item["D/O Date"].split(" ")[0] === dateFilterdmenos1)
    .reduce((acc, item) => {
      return acc + item["Order Quantity"]; 
    }, 0)
    .toLocaleString('pt-BR');

    const Backlogdmenos2 = datajson.RelatorioD2C
    .filter(item => item.Status !== "GI" && item["D/O Date"].split(" ")[0] === dateFilterdmenos2)
    .reduce((acc, item) => {
      return acc + item["Order Quantity"]; 
    }, 0)
    .toLocaleString('pt-BR');

    const lastupdate = datajson.UltAtualizacao[0].Atualizacao;

    const tbgicurrent = document.getElementById("gicurrent");

    if (gicurrent.length === 0) {
      tbgicurrent.innerHTML = "<h1 id='gicurrent'><i class='tim-icons  icon-delivery-fast text-success'></i> #N/D</h1>";
    } else {
      tbgicurrent.innerHTML = "<h1 id='gicurrent'><i class='tim-icons  icon-delivery-fast text-success'></i> " + gicurrent + "</h1>";
    }

    const tbgidmenos1 = document.getElementById("gidmenos1");

    if (gidmenos1.length === 0) {
      tbgidmenos1.innerHTML = "<h2 id='gicurrent'><i class='tim-icons  icon-delivery-fast text-success'></i> #N/D</h2>";
    }else{
      tbgidmenos1.innerHTML = "<h2 id='gicurrent'><i class='tim-icons  icon-delivery-fast text-success'></i> " + gidmenos1 + "</h2>";
    }

    const tbgidmenos2 = document.getElementById("gidmenos2");

    if (gidmenos2.length === 0) {
      tbgidmenos2.innerHTML = "<h2 id='gicurrent'><i class='tim-icons  icon-delivery-fast text-success'></i> #N/D</h2>";
    }else{
      tbgidmenos2.innerHTML = "<h2 id='gicurrent'><i class='tim-icons  icon-delivery-fast text-success'></i> " + gidmenos2 + "</h2>";
    }

    const tbBacklogdmenos1 = document.getElementById("backlogdmenos1");

    if (Backlogdmenos1.length === 0) {
      tbBacklogdmenos1.innerHTML = "<h2 id='backlogdmenos1'><i class='tim-icons  icon-app text-warning'></i> #N/D</h2>";
    }else{
      tbBacklogdmenos1.innerHTML = "<h2 id='backlogdmenos1'><i class='tim-icons  icon-app text-warning'></i> " + Backlogdmenos1 + "</h2>";
    }

    const tbBacklogdmenos2 = document.getElementById("backlogdmenos2");

    if (Backlogdmenos2.length === 0) {
      tbBacklogdmenos2.innerHTML = "<h2 id='backlogdmenos2'><i class='tim-icons icon-app text-danger'></i> #N/D</h2>";
    }else{
      tbBacklogdmenos2.innerHTML = "<h2 id='backlogdmenos2'><i class='tim-icons icon-app text-danger'></i> " + Backlogdmenos2 + "</h2>";
    }

    const tblastupdate = document.getElementById("lastupdate");

    if (lastupdate.length === 0) {
      tblastupdate.innerHTML = "<h2 id='backlogdmenos2'><i class='tim-icons icon-app text-danger'></i> #N/D</h2>";
    }else{
      tblastupdate.innerHTML = "<h3 class='card-title navbar-brand' id='lastupdate'><i class='tim-icons icon-refresh-01 text-info'></i> Last Update: " + lastupdate + "</h3>";
    }

  },


  initDashboardPageCharts: function(datajson) {
    const baseData = datajson.RelatorioD2C.filter(item => item.Status !== "GI" && item.Status !== "00_Pending Shipmment");

    let currentTransMethedFilter = null;
    let currentStatusFilter = null;
    let currentTypeFilter = null;
    let currentDOCreatedFilter = null;

    let hoje = new Date();
    hoje.setDate(hoje.getDate() - 17);
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

    function updateCharts() {

      const transmetodConsolidation = consolidateData(baseData, "Trans Method#");
      const statusConsolidation = consolidateData(baseData, "Status");
      const typeConsolidation = consolidateData(baseData, "D/O Type");
      let DOCreatedConsolidation = consolidateData(baseData, "D/O Date");

      DOCreatedConsolidation = Object.entries(DOCreatedConsolidation)
        .filter(([chave, valor]) => chave.startsWith(dateFilter))
        .reduce((acc, [chave, valor]) => {
          acc[chave.split(" ")[1].split(":")[0] + ":00"] = (acc[chave.split(" ")[1].split(":")[0] + ":00"] || 0) + valor;
          return acc;
        }, {});

      myChartTransmetod.data.datasets[0].data = transmetodLabels.map(label => transmetodConsolidation[label] || 0);
      myChartStep.data.datasets[0].data = statusLabels.map(label => statusConsolidation[label] || 0);
      myChartType.data.datasets[0].data = typeLabels.map(label => typeConsolidation[label] || 0);
      myChartDOCreated.data.datasets[0].data = DOCreatedLabels.map(label => DOCreatedConsolidation[label] || 0);

      myChartTransmetod.options.scales.yAxes[0].ticks.suggestedMax =  Math.max(...myChartTransmetod.data.datasets[0].data) === 0 ? 1 : Math.max(...myChartTransmetod.data.datasets[0].data)*1.3;
      myChartStep.options.scales.yAxes[0].ticks.suggestedMax =  Math.max(...myChartStep.data.datasets[0].data) === 0 ? 1 : Math.max(...myChartStep.data.datasets[0].data)*1.3;
      myChartDOCreated.options.scales.yAxes[0].ticks.suggestedMax =  Math.max(...myChartDOCreated.data.datasets[0].data) === 0 ? 1 : Math.max(...myChartDOCreated.data.datasets[0].data)*1.3;
      
      var pointColors = [];
      for (let i = 0; i < myChartDOCreated.data.datasets[0].data.length; i++) {
        if (parseInt(myChartDOCreated.data.datasets[0].data[i]) > 220) {
          pointColors.push('red');
        } else {
          pointColors.push('#2EC0F9');
        }
      }

      myChartDOCreated.data.datasets[0].pointBackgroundColor = pointColors

      myChartTransmetod.update();
      myChartStep.update();
      myChartType.update();
      myChartDOCreated.update();
    }

    const transmetodLabels = [...new Set(baseData.map(row => row["Trans Method#"]))];
    const statusLabels = [...new Set(baseData.map(row => row["Status"]))];
    const typeLabels = [...new Set(baseData.map(row => row["D/O Type"]))];
    const DOCreatedLabels = ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"];

    transmetodLabels.sort();

    var ordem_status = ["00_Waiting Pre-Visit","00_CARR_ID Incorreto","00_Pending Shipmment","W.Booking","W.Allocation","Allocation","Picking","With NF","Print","Checking","Mf.Created","Loading","GI",""]
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
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      layout: {
        padding: {
          top: 20,
          bottom: 20,
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
          formatter: (value) => `${value}`, 
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
          updateCharts();
          updateTable();
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
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      layout: {
        padding: {
          top: 25,
          bottom: 20,
          left: 30,
          right: 25,
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
          formatter: (value) => `${value}`, // Formato dos rótulos
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
          }
        }],
        xAxes: [{
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            fontSize: 19,
            fontSize: 20,
            fontColor: "#9e9e9e"
          }
        }]
      },
      onClick: function(e) {
        const activePoints = this.getElementAtEvent(e);
        if (activePoints.length) {
          const clickedIndex = activePoints[0]._index;
          const clickedStatus = statusLabels[clickedIndex];
          currentStatusFilter = currentStatusFilter === clickedStatus ? null : clickedStatus;
          updateCharts();
          updateTable();
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
          updateCharts();
          updateTable();
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
          formatter: (value) => `${value}`,
        }
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
          updateCharts();
          updateTable();
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
        pointHoverBackgroundColor: '#2EC0F9',
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: DOCreatedLabels.map(label => 0),
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
          formatter: (value) => `${value}`, // Formato dos rótulos
        }
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

          updateCharts();
          updateTable();
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
      updateCharts();
      hoje.setDate(hoje.getDate() + 2);
    });
    $("#D-1").click(function() {
      hoje.setDate(hoje.getDate() - 1);
      dateFilter = hoje.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
      });
      updateCharts();
      hoje.setDate(hoje.getDate() + 1);
    });

    $("#Current").click(function() {
      dateFilter = hoje.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      updateCharts();
    });

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

    function updateTable() {
      const filteredData = baseData.filter(row => {
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

      const container = document.getElementById('excelTable');

      const hot = new Handsontable(container, {
        data: filteredData,
        height: 450,
        stretchH: 'all',
        fixedColumnsStart: 1,
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
        contextMenu: true, // Menu com opções de edição
        manualColumnResize: true, // Redimensionar colunas
        manualRowResize: true,    // Redimensionar linhas
        filters: true,            // Habilita filtros
        dropdownMenu: ['filter_by_condition', 'filter_by_value', 'filter_action_bar'],       // Menu suspenso para filtros
        licenseKey: 'non-commercial-and-evaluation' // Licença para uso não comercial
      });
    }

    updateCharts();
    updateTable();

    

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