/**
 * Utilitários para configuração e manipulação de gráficos
 */

/**
 * Configurações padrão para diferentes tipos de gráfico
 */
const defaultChartConfigs = {
  line: {
    options: {
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
          display:false,
          ticks: {
            beginAtZero: true,
          },
          offset: true,
          gridLines: {
            drawBorder: false,
            zeroLineWidth: 2 // ajustar a largura da linha de grade em zero
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
      layout: {
        padding: {
          top: 40,
          bottom: 0,
          left: 40,
          right: 40,
        }
      },
      legend:{
        display: false,
      }
    }
  },
  
  bar: {
    options: {
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
          ticks: {
            beginAtZero: true,
          },
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
            fontSize: 16,
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
      legend:{
        display: false,
      }
    }
  },

  horizontalBar: {
    options: {
      plugins: {
        legend: {
          display: true,
        },
        tooltip: { callbacks: { label: (context) => `Quantidade: ${context.raw}` } },
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
      },
      scales: {
        yAxes: [{
          gridLines: {
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: 'rgba(29,140,248,0.1)',
          },
          ticks: {
            beginAtZero: true,
            padding: 20,
            fontSize: 17,
            fontColor: "#9e9e9e"
          }
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
          },
          display: false,
        }]
      },
      layout: {
        padding: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 80,
        }
      },
      legend:{
        display: false,
      }
    },
  },
  
  pie: {
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'Gráfico de Pizza'
        }
      },
    }
  },
  
  doughnut: {
    options: {
      cutoutPercentage: 50,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left:10,
          right: 10,
          top: 20,
          bottom: 0
        }
      },
      legend:{
        position: 'bottom',
        align: 'center',
        Size: 20,
        labels: {
          fontColor: "#9e9e9e",
          padding: 20,
          fontSize: 16,
        },
      },
    }
  },
  
  velocimetro: {
    options: {
      onHover: {},
      animation: {
        duration: 500, 
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
    },
  },

  radar: {
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Gráfico de Radar'
        }
      },
      scales: {
        r: {
          beginAtZero: true
        }
      }
    }
  }
};
