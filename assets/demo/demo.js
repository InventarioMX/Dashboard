
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

  // initDocChart: function() {
  //   chartColor = "#FFFFFF";

  //   // General configuration for the charts with Line gradientStroke
  //   gradientChartOptionsConfiguration = {
  //     maintainAspectRatio: false,
  //     legend: {
  //       display: false
  //     },
  //     tooltips: {
  //       bodySpacing: 4,
  //       mode: "nearest",
  //       intersect: 0,
  //       position: "nearest",
  //       xPadding: 10,
  //       yPadding: 10,
  //       caretPadding: 10
  //     },
  //     responsive: true,
  //     scales: {
  //       yAxes: [{
  //         display: 0,
  //         gridLines: 0,
  //         ticks: {
  //           display: false
  //         },
  //         gridLines: {
  //           zeroLineColor: "transparent",
  //           drawTicks: false,
  //           display: false,
  //           drawBorder: false
  //         }
  //       }],
  //       xAxes: [{
  //         display: 0,
  //         gridLines: 0,
  //         ticks: {
  //           display: false
  //         },
  //         gridLines: {
  //           zeroLineColor: "transparent",
  //           drawTicks: false,
  //           display: false,
  //           drawBorder: false
  //         }
  //       }]
  //     },
  //     layout: {
  //       padding: {
  //         left: 0,
  //         right: 0,
  //         top: 15,
  //         bottom: 15
  //       }
  //     }
  //   };

  //   ctx = document.getElementById('lineChartExample').getContext("2d");

  //   gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
  //   gradientStroke.addColorStop(0, '#80b6f4');
  //   gradientStroke.addColorStop(1, chartColor);

  //   gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
  //   gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
  //   gradientFill.addColorStop(1, "rgba(249, 99, 59, 0.40)");

  //   myChart = new Chart(ctx, {
  //     type: 'line',
  //     responsive: true,
  //     data: {
  //       labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  //       datasets: [{
  //         label: "Active Users",
  //         borderColor: "#f96332",
  //         pointBorderColor: "#FFF",
  //         pointBackgroundColor: "#f96332",
  //         pointBorderWidth: 2,
  //         pointHoverRadius: 4,
  //         pointHoverBorderWidth: 1,
  //         pointRadius: 4,
  //         fill: true,
  //         backgroundColor: gradientFill,
  //         borderWidth: 2,
  //         data: [542, 480, 430, 550, 530, 453, 380, 434, 568, 610, 700, 630]
  //       }]
  //     },
  //     options: gradientChartOptionsConfiguration
  //   });
  // },

  initDashboardPageCharts: function(datajson) {
    const baseData = datajson.RelatorioD2C.filter(item => item.Status !== "GI" && item.Status !== "00_Pending Shipmment");

    let currentTransMethedFilter = null;
    let currentStatusFilter = null;
    let currentTypeFilter = null;
    let currentDOCreatedFilter = null;

    function consolidateData(data, groupField) {
      return data.reduce((acc, row) => {
        if (!currentTransMethedFilter || row["Trans Method#"] === currentTransMethedFilter) {
          if (!currentDOCreatedFilter || row["D/O Date"] === currentDOCreatedFilter) {
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
      var hoje = new Date();
          hoje.setDate(hoje.getDate() - 15);
      let dateFilter = hoje.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
      });

      const filteredAndUpdatedData = baseData
        .filter(item => item["D/O Date"].startsWith(dateFilter))
        .map(item => ({
          ...item,
          ["D/O Date"]: item["D/O Date"].split(" ")[1].split(":")[0] + ":00" 
        }));

      const transmetodConsolidation = consolidateData(baseData, "Trans Method#");
      const statusConsolidation = consolidateData(baseData, "Status");
      const typeConsolidation = consolidateData(baseData, "D/O Type");
      const DOCreatedConsolidation = consolidateData(filteredAndUpdatedData, "D/O Date");

      myChartTransmetod.data.datasets[0].data = transmetodLabels.map(label => transmetodConsolidation[label] || 0);
      myChartStep.data.datasets[0].data = statusLabels.map(label => statusConsolidation[label] || 0);
      myChartType.data.datasets[0].data = typeLabels.map(label => typeConsolidation[label] || 0);
      myChartDOCreated.data.datasets[0].data = DOCreatedLabels.map(label => DOCreatedConsolidation[label] || 0);

      myChartTransmetod.options.scales.yAxes[0].ticks.suggestedMax =  Math.max(...myChartTransmetod.data.datasets[0].data)*1.2;
      myChartStep.options.scales.yAxes[0].ticks.suggestedMax =  Math.max(...myChartStep.data.datasets[0].data)*1.3;
      
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
          barPercentage: 1.6,
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
          barPercentage: 1.6,
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
          top: 15,
          bottom: 20,
          left: 30,
          right: 30,
        }
      },
      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 15,
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
            size: 36,
          },
          formatter: (value) => `${value}`, // Formato dos rótulos
        }
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
            fontSize: 25,
            padding: 10,
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
            fontSize: 15,
            padding: 20,
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
          console.log(clickedType);

          currentTypeFilter = currentTypeFilter === clickedType ? null : clickedType;
          updateCharts();
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
  
    var doCreated = [10,30,60,80,50,110,70,120,70,20,10,30,60,80,50,110,70,120,70,20,10,20,100,250]
    var chart_labels = ['00:00','01h','02h','03h','04h','05h','06h','07h', '08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h'];

    var pointColors = [];
    for (let i = 0; i < doCreated.length; i++) {
      if (doCreated[i] > 70) {
        pointColors.push('red');
      } else {
        pointColors.push('#2EC0F9');
      }
    }

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
        pointBackgroundColor: pointColors,
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
    for (let i = 0; i < doCreated.length; i++) {
      if (doCreated[i] > 70) {
        legendColors.push('red');
      } else {
        legendColors.push('rgba(255, 255, 255, 0.8)');
      }
    }

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
            suggestedMin: 50,
            suggestedMax: Math.max(...doCreated)*1.1,
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
      }
    };

    const myChartDOCreated = new Chart(ctx, {
      type: 'line',
      data: data,
      options: ChartOptionsConfigDOCreated
    });

    updateCharts();

  },







  //   gradientChartOptionsConfigurationWithTooltipBlue = {
  //     maintainAspectRatio: false,
  //     legend: {
  //       display: false
  //     },

  //     tooltips: {
  //       backgroundColor: '#f5f5f5',
  //       titleFontColor: '#333',
  //       bodyFontColor: '#666',
  //       bodySpacing: 4,
  //       xPadding: 12,
  //       mode: "nearest",
  //       intersect: 0,
  //       position: "nearest"
  //     },
  //     responsive: true,
  //     scales: {
  //       yAxes: [{
  //         barPercentage: 1.6,
  //         gridLines: {
  //           drawBorder: false,
  //           color: 'rgba(29,140,248,0.0)',
  //           zeroLineColor: "transparent",
  //         },
  //         ticks: {
  //           suggestedMin: 60,
  //           suggestedMax: 125,
  //           padding: 20,
  //           fontColor: "#2380f7"
  //         }
  //       }],

  //       xAxes: [{
  //         barPercentage: 1.6,
  //         gridLines: {
  //           drawBorder: false,
  //           color: 'rgba(29,140,248,0.1)',
  //           zeroLineColor: "transparent",
  //         },
  //         ticks: {
  //           padding: 20,
  //           fontColor: "#2380f7"
  //         }
  //       }]
  //     }
  //   };







  //   gradientChartOptionsConfigurationWithTooltipOrange = {
  //     maintainAspectRatio: false,
  //     legend: {
  //       display: false
  //     },

  //     tooltips: {
  //       backgroundColor: '#f5f5f5',
  //       titleFontColor: '#333',
  //       bodyFontColor: '#666',
  //       bodySpacing: 4,
  //       xPadding: 12,
  //       mode: "nearest",
  //       intersect: 0,
  //       position: "nearest"
  //     },
  //     responsive: true,
  //     scales: {
  //       yAxes: [{
  //         barPercentage: 1.6,
  //         gridLines: {
  //           drawBorder: false,
  //           color: 'rgba(29,140,248,0.0)',
  //           zeroLineColor: "transparent",
  //         },
  //         ticks: {
  //           suggestedMin: 50,
  //           suggestedMax: 110,
  //           padding: 20,
  //           fontColor: "#ff8a76"
  //         }
  //       }],

  //       xAxes: [{
  //         barPercentage: 1.6,
  //         gridLines: {
  //           drawBorder: false,
  //           color: 'rgba(220,53,69,0.1)',
  //           zeroLineColor: "transparent",
  //         },
  //         ticks: {
  //           padding: 20,
  //           fontColor: "#ff8a76"
  //         }
  //       }]
  //     }
  //   };

 


  





  //   var ctx = document.getElementById("CountryChart").getContext("2d");

  //   var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

  //   gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
  //   gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
  //   gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors


  //   var myChart = new Chart(ctx, {
  //     type: 'bar',
  //     responsive: true,
  //     legend: {
  //       display: false
  //     },
  //     data: {
  //       labels: ['Wainting', 'Alocated', 'Picking', 'N.F.', 'Checking', 'Loading'],
  //       datasets: [{
  //         label: "Itens",
  //         fill: true,
  //         backgroundColor: gradientStroke,
  //         hoverBackgroundColor: gradientStroke,
  //         borderColor: '#1f8ef1',
  //         borderWidth: 2,
  //         borderDash: [],
  //         borderDashOffset: 0.0,
  //         data: [53, 20, 10, 80, 100, 45],
  //       }]
  //     },
  //     options: gradientBarChartConfiguration,
  //     plugins: [ChartDataLabels],
  //   });

  // },

  initLastUpdate: function(data) {
    var txtHtml = document.getElementById("atualizacao");
    if (data.length > 0) {
      var ultatt = data[0].Atualizacao;
      txtHtml.innerHTML += ` ${ultatt}`;
    } else {
      txtHtml.innerHTML += " Não disponível";
    }
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