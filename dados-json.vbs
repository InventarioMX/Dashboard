Dim conn, rs, fso, arquivo, caminhoExcel, caminhoTxt, sqlQuery

WScript.Echo now

caminhoExcel = "C:\Users\luiz.os\source\repos\dashboard-operation\Auxiliar.xlsm"  ' Substitua pelo caminho do arquivo Excel
caminhoTxt = "C:\Users\luiz.os\source\repos\dashboard-operation\base\dados.json"  ' Substitua pelo caminho do arquivo de saída

Set conn = CreateObject("ADODB.Connection")
Set rs = CreateObject("ADODB.Recordset")
Set fso = CreateObject("Scripting.FileSystemObject")

conn.ConnectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" & caminhoExcel & ";Extended Properties='Excel 12.0 Xml;HDR=YES';"
conn.Open

sqlQuery = "SELECT * FROM [Arquivo$]" ' Substitua "Arquivo$" pelo nome da sua planilha (incluindo o sinal de $ no final)

rs.Open sqlQuery, conn

 
Set arquivo = fso.CreateTextFile(caminhoTxt, True)

arquivo.Write "{"
arquivo.Write """RelatorioD2C"":["


Do Until rs.EOF

    vlin = "{"
    
    For i = 0 To rs.Fields.Count - 1
        if i = 9 Then
            vlin = vlin & """" & rs.Fields(i).Name & """: " & rs.Fields(i).Value & ""
        else
            vlin = vlin & """" & rs.Fields(i).Name & """: """ & rs.Fields(i).Value & """"
        end if
        If i < rs.Fields.Count - 1 Then
            vlin = vlin & ","
        End If
    Next

    vlin = vlin & "},"
    
    rs.MoveNext
    
    If rs.EOF Then
        vlin = Left(vlin, Len(vlin) - 1)
    End If

    arquivo.Write vlin
Loop


arquivo.Write "],"
arquivo.Write """UltAtualizacao"":["
arquivo.Write "{""Atualizacao"":""" & Now & """}"
arquivo.Write "]"
arquivo.Write "}"

arquivo.Close
rs.Close
conn.Close

Set arquivo = Nothing
Set rs = Nothing
Set conn = Nothing
Set fso = Nothing

WScript.Echo now
WScript.Echo "Arquivo de texto criado com sucesso!"