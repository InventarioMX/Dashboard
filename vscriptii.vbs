' Definir variáveis
Dim conn, rs, fso, arquivo, caminhoExcel, caminhoTxt, sqlQuery

' Caminho para o arquivo Excel e para o arquivo de texto
caminhoExcel = "C:\Users\luiz.os\source\repos\dashboard-operation\Auxiliar.xlsm"  ' Substitua pelo caminho do arquivo Excel
caminhoTxt = "C:\Users\luiz.os\source\repos\dashboard-operation\base\dados.js"  ' Substitua pelo caminho do arquivo de saída

' Criar objetos necessários
Set conn = CreateObject("ADODB.Connection")
Set rs = CreateObject("ADODB.Recordset")
Set fso = CreateObject("Scripting.FileSystemObject")

' Conectar ao Excel usando a string de conexão OLEDB
conn.ConnectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" & caminhoExcel & ";Extended Properties='Excel 12.0 Xml;HDR=YES';"
conn.Open

' Definir a consulta SQL para pegar dados da planilha
sqlQuery = "SELECT * FROM [Arquivo$]" ' Substitua "Arquivo$" pelo nome da sua planilha (incluindo o sinal de $ no final)

' Executar a consulta
rs.Open sqlQuery, conn

' Criar o arquivo de texto
Set arquivo = fso.CreateTextFile(caminhoTxt, True)

arquivo.WriteLine "const jsonData = ["
' Escrever os dados no arquivo de texto
Do Until rs.EOF

    vlin = vbTab & "{ """ & rs.Fields(0).Name & """: """ & rs.Fields(0).Value & """, " & _
              " """ & rs.Fields(1).Name & """: """ & rs.Fields(1).Value & """, " & _
              " """ & rs.Fields(2).Name & """: """ & rs.Fields(2).Value & """, " & _
              " """ & rs.Fields(3).Name & """: """ & rs.Fields(3).Value & """ },"

    rs.MoveNext
    
    If rs.EOF Then
        vlin = Left(vlin, Len(vlin) - 1)
    End If
    
    arquivo.WriteLine vlin
Loop

arquivo.WriteLine "];"
arquivo.WriteLine "const UltAtualizacao = ["
arquivo.WriteLine vbTab & "{ ""Atualizacao"": """ & Now & """ }"
arquivo.WriteLine "];"
arquivo.WriteLine "const doCreated=[8, 12, 34, 2269, 85, 490, 450, 172];"

' Fechar o arquivo e liberar objetos
arquivo.Close
rs.Close
conn.Close

' Limpar objetos
Set arquivo = Nothing
Set rs = Nothing
Set conn = Nothing
Set fso = Nothing

' Informar que o arquivo foi criado
WScript.Echo "Arquivo de texto criado com sucesso!"