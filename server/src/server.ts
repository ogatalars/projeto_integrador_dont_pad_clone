// src/server.ts
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { initDB } from './config/db';
import authRoutes from './routes/authRoutes'; // <--- DESCOMENTE OU ADICIONE ESTA LINHA

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
            ? 'SUA_URL_DO_GITHUB_PAGES_AQUI' // Adapte para sua URL de produção
            : 'http://localhost:3000', // Adapte para a porta do seu frontend local (Vite padrão é 5173)
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rota de Ping
app.get('/api/ping', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Pong! Servidor SQLite está no ar. Data: ' + new Date().toLocaleString() });
});

// Definir Rotas da API
app.use('/api/auth', authRoutes); // <--- DESCOMENTE OU ADICIONE ESTA LINHA
// app.use('/api/docs', docRoutes); // Para as rotas de documentos, depois


// Inicializar DB e Servidor
const startServer = async () => {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🌱 Ambiente: ${process.env.NODE_ENV}`);
      console.log(`🗄️  Conectado ao banco de dados SQLite: ${process.env.DB_STORAGE}`);
    });
  } catch (error) {
    console.error('❌ Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer();