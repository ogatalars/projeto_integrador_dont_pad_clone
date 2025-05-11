// src/config/db.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DB_DIALECT) {
  console.error("Erro: DB_DIALECT não definido no arquivo .env");
  process.exit(1);
}

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT as 'sqlite',
  storage: process.env.DB_STORAGE || './database.sqlite',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

export const initDB = async () => {
  try {
    await sequelize.authenticate(); // Apenas autentica, não precisa de usuário/senha para SQLite local simples
    console.log('Conexão com o SQLite estabelecida com sucesso.');

    // { alter: true } pode ser útil em dev para SQLite também.
    const syncOption = process.env.NODE_ENV === 'development' ? { alter: true } : {};
    await sequelize.sync(syncOption);
    console.log('Modelos sincronizados com o banco de dados (SQLite).');

  } catch (error) {
    console.error('Não foi possível conectar ou sincronizar com o banco de dados SQLite:', error);
    throw error;
  }
};

export default sequelize;