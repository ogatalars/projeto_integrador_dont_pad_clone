import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DB_DIALECT) {
  console.error("Erro: DB_DIALECT não definido no arquivo .env");
  process.exit(1);
}


const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT as 'sqlite', // 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql'
  storage: process.env.DB_STORAGE || './database.sqlite', // Necessário para SQLite
  logging: process.env.NODE_ENV === 'development' ? console.log : false, // Log SQL queries em dev
  // host: process.env.DB_HOST,
  // port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
  // username: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
});

export const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o Sequelize estabelecida com sucesso.');

    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' ? true : false });
    console.log('Todos os modelos foram sincronizados com sucesso.');

  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados via Sequelize:', error);
    throw error; 
  }
};

export default sequelize; 