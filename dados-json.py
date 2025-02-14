from datetime import datetime
import win32com.client
import pandas as pd
import json

# Conectar-se ao Excel ativo
excel = win32com.client.GetActiveObject("Excel.Application")
wb = excel.Workbooks("Auxiliar.xlsm")  

# Defina os nomes das planilhas ou intervalos das tabelas a serem exportadas
sheets = {"RelatorioD2C" : "WMS" , "Capacidade" : "tbconfig" }  # Substitua pelos nomes corretos das planilhas/tabelas
export_data = {}

for sheet, range  in sheets.items():
    ws = wb.Sheets(sheet)
    
    # Obter os dados da planilha
    data = ws.ListObjects(range).Range.Value
    
    # Criar DataFrame
    df = pd.DataFrame(list(data[1:]), columns=list(data[0]), dtype=str)  

    if range == "WMS" :
        df["Order Quantity"] = pd.to_numeric(df["Order Quantity"], errors="coerce").fillna(0).astype(int)
    
    if range == "tbconfig" :
        df["Cap"] = pd.to_numeric(df["Cap"], errors="coerce").fillna(0).astype(int)
    
    # Armazenar no dicionário
    export_data[sheet] = df.to_dict(orient="records")

data_hora_atual = datetime.now()
data_formatada = data_hora_atual.strftime("%d/%m/%Y %H:%M:%S")
export_data["UltAtualizacao"] = [
    {"Atualizacao": data_formatada}
]

# Exportar para JSON
with open(r"base\dados.json", "w", encoding="utf-8") as json_file:
    json.dump(export_data, json_file, indent=4, ensure_ascii=False)

print("✅ Exportação de múltiplas tabelas concluída!")
