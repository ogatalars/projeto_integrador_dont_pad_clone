
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { initDB } from './config/db'; // Importaremos a função de inicialização do Sequelize
// import authRoutes from './routes/authRoutes'; // Importaremos depois
// import docRoutes from './routes/docRoutes'; // Importaremos depois


dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5002; 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/ping', (req: Request, res: Response) => {
  res.status(200).send('Pong! Servidor SQL está no ar.');
});


// app.use('/api/auth', authRoutes);
// app.use('/api/docs', docRoutes); // Adicionaremos o docRoutes em breve

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor SQL rodando na porta ${PORT}`);
    console.log(`🗄️  Conectado ao banco de dados SQLite: ${process.env.DB_STORAGE || 'dev.sqlite'}`);
  });
}).catch((error: Error) => {
  console.error('❌ Falha ao inicializar o banco de dados:', error);
  process.exit(1);
});