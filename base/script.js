
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
  
