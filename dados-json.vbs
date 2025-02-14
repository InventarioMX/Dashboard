Dim conn, rs, rs1, fso, arquivo, caminhoExcel, caminhoTxt, sqlQuery, sqlQuery1

WScript.Echo now

diretorio = Left(WScript.ScriptFullName, (Len(WScript.ScriptFullName) - (Len(WScript.ScriptName) + 1)))
caminhoExcel = diretorio & "\Auxiliar.xlsm"
caminhoAtualiza =   diretorio & "\base\atualiza.json"
caminhojson = diretorio & "\base\dados.json"  

Set conn = CreateObject("ADODB.Connection")
Set rs = CreateObject("ADODB.Recordset")
Set fso = CreateObject("Scripting.FileSystemObject")

conn.ConnectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" & caminhoExcel & ";Extended Properties='Excel 12.0 Xml;HDR=YES';"
conn.Open

sqlQuery = "SELECT * FROM [Arquivo$]" 

rs.Open sqlQuery, conn

 
Set arquivo = fso.CreateTextFile(caminhoAtualiza, True)

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

rs.Close

arquivo.Write """UltAtualizacao"":["
arquivo.Write "{""Atualizacao"":""" & Now & """}"
arquivo.Write "],"

Set rs1 = CreateObject("ADODB.Recordset")
sqlQuery1 = "SELECT * FROM [Inicio$H3:J5]" 
rs1.Open sqlQuery1, conn

arquivo.Write """Capacidade"":["
Do Until rs1.EOF

    vlin = "{"

    vlin = vlin & """" & rs1.Fields(0).Name & """: """ & rs1.Fields(0).Value & ""","
    vlin = vlin & """" & rs1.Fields(2).Name & """: " & rs1.Fields(2).Value & ""

    vlin = vlin & "},"

    rs1.MoveNext
    
    If rs1.EOF Then
        vlin = Left(vlin, Len(vlin) - 1)
    End If

    arquivo.Write vlin

Loop

arquivo.Write "]"
arquivo.Write "}"

rs1.Close
arquivo.Close
conn.Close

If fso.FileExists(caminhojson) Then fso.DeleteFile caminhojson, True
fso.CopyFile caminhoAtualiza, caminhojson

Set arquivo = Nothing
Set rs = Nothing
Set conn = Nothing
Set fso = Nothing

WScript.Echo now
WScript.Echo "Arquivo de texto criado com sucesso!"