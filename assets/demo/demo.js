
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

  initDashboardPageCharts: function() {

    ChartOptionsConfigType = {
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
            display: false,
            suggestedMin: 50,
            suggestedMax: 10000, // Math.max(...doCreated)*1.1
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
      }
    };


    var ctx = document.getElementById("chartLineTransMethod").getContext("2d");
    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(66,134,121,0.15)');
    gradientStroke.addColorStop(0.4, 'rgba(66,134,121,0.0)'); //green colors
    gradientStroke.addColorStop(0, 'rgba(66,134,121,0)'); //green colors

    var data = {
      labels: ['T1', 'M2', 'P4', 'P3'],
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
        data: [2020, 140, 5680, 80],
      }]
    };

    var myChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: ChartOptionsConfigType
    });


    ChartOptionsConfigStep = {
      maintainAspectRatio: false,
      legend: {
        display: false
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
            suggestedMin: 60,
            suggestedMax: 120,
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
            fontSize: 20,
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }]
      }
    };

    var ctx = document.getElementById("chartBarStep").getContext("2d");

    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
    gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors

    var myChart = new Chart(ctx, {
      type: 'bar',
      responsive: true,
      legend: {
        display: false
      },
      data: {
        labels: ['Wainting', 'Alocated', 'Picking', 'N.F.', 'Checking', 'Loading'],
        datasets: [{
          label: "Itens",
          fill: true,
          backgroundColor: gradientStroke,
          hoverBackgroundColor: gradientStroke,
          borderColor: '#1f8ef1',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          data: [53, 20, 10, 80, 100, 45],
        }]
      },
      options: ChartOptionsConfigStep,
      plugins: [ChartDataLabels],
    });


    ChartOptionsConfigProd = {
      animation: {
        duration: 2000, // Duração da animação em milissegundos
        onComplete: function() {
          // Obtém o contexto do gráfico
          const chartInstance = this.chart;
          const ctx = chartInstance.ctx;
  
          // Calcula a posição central do canvas
          const centerX = (chartInstance.chartArea.left + chartInstance.chartArea.right) / 2;
          const centerY = (chartInstance.chartArea.top + chartInstance.chartArea.bottom) / 2;
  
          // Define estilo do texto
          ctx.save();
          ctx.font = '22px sans-serif'; // Fonte do texto
          ctx.fillStyle = 'white'; // Cor do texto
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
  
          // Obtém o valor total dos dados
          //const total = chartInstance.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const value = chartInstance.data.datasets[0].data[0];

          // Desenha o texto no centro
          ctx.fillText(`${value}`, centerX, centerY);
          ctx.restore();
        },
      },
      cutoutPercentage: 70,
      
     
      maintainAspectRatio: false,
      legend: {
        display: false,
        position: 'bottom',
        labels: {
          fontColor: 'white',
          padding: 30,
          family: 'sans-serif',
        },
      },
      tooltips: {
        bodySpacing:4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10
      },
      responsive: true,
      plugins: {
        datalabels: {
          display: false,
        }
      },
      scales: {
        yAxes: [{
          display: 0,
          gridLines: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          display: 0,
          gridLines: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }
      }
    };

    ctx = document.getElementById('pieProductivity').getContext("2d");

    gradientFillBLue = ctx.createLinearGradient(0, 230, 0, 50);
    gradientFillBLue.addColorStop(0, "rgba(114, 170, 235, 0)");
    gradientFillBLue.addColorStop(0.7, "rgba(114, 171, 235, 0.1)");

    gradientFillGreen = ctx.createLinearGradient(0, 230, 0, 50);
    gradientFillGreen.addColorStop(0, "rgba(66, 134, 121, 0.4)");
    gradientFillGreen.addColorStop(1, "rgba(66,134,121,0)");
    //"#f96332"

    var data = {
      labels: ["MONO", "MULT"],
      datasets: [{
        label: "Meta",
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
        data: [70, 30]
      }]
    }

    myChart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: ChartOptionsConfigProd
    });



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






  //   var doCreated = [53, 20, 10, 80, 100, 45, 20, 30]

  //   const legendColors = [];
  //   for (let i = 0; i < doCreated.length; i++) {
  //     if (doCreated[i] > 70) {
  //       legendColors.push('red');
  //     } else {
  //       legendColors.push('rgba(255, 255, 255, 0.8)');
  //     }
  //   }

  //   gradientChartOptionsConfigurationWithTooltipPurple = {
  //     maintainAspectRatio: false,
  //     legend: {
  //       display: false
  //     },
  //     layout: {
  //       padding: {
  //         top: 20,
  //         bottom: 20,
  //         left: 50,
  //         right: 50,
  //       }
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
  //     plugins: {
  //       legend: {
  //         display: true,
  //       },
  //       datalabels: {
  //         color: 'rgba(255, 255, 255, 0.8)',
  //         anchor: 'end',
  //         align: 'top',
  //         font: {
  //           size: 25,
  //         },
  //         formatter: (value) => `${value}`, // Formato dos rótulos
  //       }
  //     },
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
  //           suggestedMax: Math.max(...doCreated)*1.1,
  //           padding: 20,
  //           fontColor: "#9a9a9a",
  //           display:false
  //         }
  //       }],

  //       xAxes: [{
  //         barPercentage: 1.6,
  //         gridLines: {
  //           drawBorder: false,
  //           color: 'rgba(225,78,202,0.1)',
  //           zeroLineColor: "transparent",
  //         },
  //         ticks: {
  //           padding: 20,
  //           fontColor: "#9a9a9a"
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

 


  




  //   var chart_labels = ['07h', '08h', '09h', '10h', '11h', '12h', '13h', '14h'];

  //   var pointColors = [];
  //   for (let i = 0; i < doCreated.length; i++) {
  //     if (doCreated[i] > 1000) {
  //       pointColors.push('red');
  //     } else {
  //       pointColors.push('#2EC0F9');
  //     }
  //   }

  //   var ctx = document.getElementById("chartBig1").getContext('2d');

  //   var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

  //   gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
  //   gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
  //   gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors
  //   var config = {
  //     type: 'line',
  //     data: {
  //       labels: chart_labels, 
  //       datasets: [{
  //         label: "Itens",
  //         fill: true,
  //         backgroundColor: gradientStroke,
  //         borderColor: '#2EC0F9',
  //         borderWidth: 2,
  //         borderDash: [],
  //         borderDashOffset: 0.0,
  //         pointBackgroundColor: pointColors,
  //         pointBorderColor: 'rgba(255,255,255,0)',
  //         pointHoverBackgroundColor: '#2EC0F9',
  //         pointBorderWidth: 20,
  //         pointHoverRadius: 4,
  //         pointHoverBorderWidth: 15,
  //         pointRadius: 4,
  //         data: doCreated,
  //       }]
  //     },
  //     options: gradientChartOptionsConfigurationWithTooltipPurple
  //   };
  //   var myChartData = new Chart(ctx, config);

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