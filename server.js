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
const carregarDados = async () => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'data', 'dados.json'), 'utf-8');
    let produtos = JSON.parse(data);

    return produtos;
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
    await fastify.listen({ port: 9000 });
    console.log('Servidor rodando em http://localhost:9000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
