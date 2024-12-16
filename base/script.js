
// Função para popular a tabela
function populateTable(data) {
    const tableHeader = document.getElementById("tableHeader");
    const tableBody = document.getElementById("tableBody");
  
    // Limpa a tabela antes de preenchê-la
    tableHeader.innerHTML = "";
    tableBody.innerHTML = "";
  
    if (data.length === 0) {
      tableBody.innerHTML = "<tr><td colspan='100%'>Nenhum dado disponível</td></tr>";
      return;
    }
  
    // Cria os cabeçalhos da tabela dinamicamente
    const headers = Object.keys(data[0]);
    headers.forEach(header => {
      const th = document.createElement("th");
      th.textContent = header;
      tableHeader.appendChild(th);
    });
  
    // Preenche os dados da tabela
    data.forEach(row => {
      const tr = document.createElement("tr");
      headers.forEach(header => {
        const td = document.createElement("td");
        td.textContent = row[header];
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    });

  
    // Recria o DataTables após um pequeno timeout para garantir que o DOM foi atualizado
    $('#dataTable').DataTable({
    paging: true,
    searching: true,
    ordering: true,
    responsive: true,
    language: {
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Nada encontrado",
        info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
        infoEmpty: "Nenhum registro disponível",
        infoFiltered: "(filtrado de _MAX_ registros no total)",
        search: "Buscar:",
        paginate: {
        first: "Primeiro",
        last: "Último",
        next: "Próximo",
        previous: "Anterior"
        },
    },
    });
    
  }
  
  

// Função para renderizar o gráfico
function renderChartLarge(data) {
  const labels = data.map(row => row["Categoria"]); // Adapte ao cabeçalho do JSON
  const values = data.map(row => row["Valor"]); // Adapte ao cabeçalho do JSON

  const ctx = document.getElementById("largeChart").getContext("2d");

  var gradientStroke = ctx.createLinearGradient(0, 1000, 0, 50);

  gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
  gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
  gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors

  new Chart(ctx, {
      type: "bar",
      data: {
          labels: labels,
          datasets: [
              {
                  label: "Valores",
                  data: values,
                  fill: true,
                  backgroundColor: gradientStroke,
                  hoverBackgroundColor: gradientStroke,
                  borderColor: '#1f8ef1',
                  borderWidth: 2,
                  borderDash: [],
                  borderDashOffset: 0.0,
              },
          ],
      },
      options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
  });
}

function renderChartSmall(data) {
    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.Status]) {
            acc[item.Status] = 0;
        }
        acc[item.Status] += item.Valor;
        return acc;
    }, {});
  
    // 2. Preparando os dados para o Chart.js
    const labels = Object.keys(groupedData); // ['Waiting', 'Close']
    const valores = Object.values(groupedData); // [430, 259]
  
    // 3. Criando o gráfico de pizza
    const ctx = document.getElementById('smallChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels, // Rótulos (Status)
            datasets: [{
                data: valores, // Valores correspondentes
                backgroundColor: ['#3498db', '#e74c3c'], // Cores para cada status
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top' // Posição da legenda
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw}`;
                        }
                    }
                }
            }
        }
    });
  }


  function atualiza_datahota() {
    const h2Atualizacao = document.getElementById("atualizacao");
    const h2Atualizacao1 = document.getElementById("atualizacao1");
    // Verifica a última atualização
    if (UltAtualizacao.length > 0) {
      const ultimaAtualizacao = UltAtualizacao[0].Atualizacao;
      // Adiciona a data/hora ao conteúdo sem remover o ícone
      h2Atualizacao.innerHTML += ` ${ultimaAtualizacao}`;
      h2Atualizacao1.innerHTML += ` ${ultimaAtualizacao}`;
    } else {
      h2Atualizacao.innerHTML += " Não disponível";
      h2Atualizacao1.innerHTML += " Não disponível";
    }
  }

function atualizarDados() {
    populateTable(jsonData);
    atualiza_datahota(UltAtualizacao)
}

// Executar quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  atualizarDados(); // Carregar inicialmente os dados
});
