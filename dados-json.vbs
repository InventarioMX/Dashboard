' Definir variáveis
Dim conn, rs, fso, arquivo, caminhoExcel, caminhoTxt, sqlQuery

WScript.Echo now

' Caminho para o arquivo Excel e para o arquivo de texto
caminhoExcel = "C:\Users\luiz.os\source\repos\dashboard-operation\Auxiliar.xlsm"  ' Substitua pelo caminho do arquivo Excel
caminhoTxt = "C:\Users\luiz.os\source\repos\dashboard-operation\base\dados.json"  ' Substitua pelo caminho do arquivo de saída

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

arquivo.Write "{"
arquivo.Write " ""RelatorioD2C"": ["
' Escrever os dados no arquivo de texto

Do Until rs.EOF
    ' Inicializa a linha com um tabulador
    vlin = vbTab & "{ "
    
    ' Loop por todas as colunas
    For i = 0 To rs.Fields.Count - 1
        if i = 9 Then
            vlin = vlin & """" & rs.Fields(i).Name & """: " & rs.Fields(i).Value & ""
        else
            vlin = vlin & """" & rs.Fields(i).Name & """: """ & rs.Fields(i).Value & """"
        end if
        ' Adiciona uma vírgula entre os pares chave-valor, exceto no último
        If i < rs.Fields.Count - 1 Then
            vlin = vlin & ", "
        End If
    Next

    ' Finaliza a linha JSON
    vlin = vlin & " },"
    
    rs.MoveNext
    
    ' Remove a última vírgula ao atingir o final do Recordset
    If rs.EOF Then
        vlin = Left(vlin, Len(vlin) - 1)
    End If
    
    ' Escreve a linha no arquivo
    arquivo.Write vlin
Loop


arquivo.Write "],"
arquivo.Write """UltAtualizacao"": ["
arquivo.Write vbTab & "{ ""Atualizacao"": """ & Now & """ }"
arquivo.Write "]"
arquivo.Write "}"
' Fechar o arquivo e liberar objetos
arquivo.Close
rs.Close
conn.Close

' Limpar objetos
Set arquivo = Nothing
Set rs = Nothing
Set conn = Nothing
Set fso = Nothing

WScript.Echo now

' Informar que o arquivo foi criado
WScript.Echo "Arquivo de texto criado com sucesso!"