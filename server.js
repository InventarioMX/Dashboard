// win + x   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

//npm install fastify //npm install fastify @fastify/static  // npm run ini 

// MIN theme // Symbols // ESLint

import Fastify from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

// Configuração de caminhos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({ logger: true });

// Servindo arquivos estáticos
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
});

// Função para ler e processar o JSON
const formatarData = (diasAtras = 0) => {
  let data = new Date();
  data.setDate(data.getDate() - diasAtras);
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const datas = [formatarData(),formatarData(1),formatarData(2)];
console.log(datas)

const carregarDados = async () => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'data', 'dados.json'), 'utf-8');
    let DOs = JSON.parse(data);
    // DOs.RelatorioD2C = DOs.RelatorioD2C.filter(item => datas.includes(item['GI Date'].split(" ")[0]));

    return DOs;
  } catch (error) {
    console.error('Erro ao carregar os dados:', error);
    return [];
  }
};

// Rota para enviar os dados processados
fastify.get('/api/dados', async (request, reply) => {
  const dados = await carregarDados();
  return reply.send(dados);
});

// Inicializando o servidor
const start = async () => {
  try {
    await fastify.listen({ port: 9000, host: '105.112.157.146' });
    console.log('Servidor rodando em http://105.112.157.146:8000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
