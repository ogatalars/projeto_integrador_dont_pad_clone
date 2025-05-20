import { Sequelize, Options } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let sequelize: Sequelize;

const productionDbUrl = process.env.DATABASE_URL;

if (process.env.NODE_ENV === 'production' && productionDbUrl) {
  console.log('Configurando Sequelize para produção com DATABASE_URL...');
  const options: Options = {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, 
      },
    },
    logging: false, // Desabilitar logs SQL detalhados em produção
    pool: { // Configurações de pool de conexão (opcional, mas bom para produção)
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
  sequelize = new Sequelize(productionDbUrl, options);
} else {
  // Configuração para DESENVOLVIMENTO LOCAL (SQLite ou outro definido no .env local)
  console.log('Configurando Sequelize para desenvolvimento local...');
  const localDialect = (process.env.DB_DIALECT as 'sqlite' | 'postgres' | 'mysql') || 'sqlite';

  const localOptions: Options = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : (localDialect === 'postgres' ? 5432 : (localDialect === 'mysql' ? 3306 : undefined)),
    dialect: localDialect,
    logging: console.log, 
  };

  if (localDialect === 'sqlite') {
    localOptions.storage = process.env.DB_STORAGE || './database.sqlite';
  }

  // Para SQLite, os três primeiros argumentos de new Sequelize não são usados se 'storage' for fornecido.
  // Para outros dialetos, eles são dbName, dbUser, dbPassword.
  if (localDialect === 'sqlite') {
    sequelize = new Sequelize(localOptions);
  } else {
     if (!process.env.DB_NAME || !process.env.DB_USER) {
        console.error(`Para dialeto ${localDialect}, DB_NAME e DB_USER devem estar no .env local! Saindo.`);
        process.exit(1);
     }
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD, 
      localOptions
    );
  }
}

export const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Conexão com o banco de dados (${sequelize.getDialect()}) estabelecida com sucesso.`);

    // Em produção, NUNCA use { force: true }.
    // { alter: true } pode ser usado com CUIDADO em produção, especialmente no primeiro deploy.
    // A melhor prática para produção é usar Migrations do Sequelize.
    // Para o nosso primeiro deploy no Render, e como o banco será novo, { alter: true } deve funcionar.
    const syncOptions = process.env.NODE_ENV === 'production' ? { alter: true } : { alter: true };

    // Se você quiser ter certeza absoluta de que as tabelas serão criadas da forma correta
    // no primeiro deploy em um banco de dados PostgreSQL NOVO e VAZIO no Render,
    // você poderia temporariamente usar { force: true } APENAS para esse primeiro deploy,
    // e depois mudar de volta para { alter: true } ou (idealmente) remover o sync em produção
    // e gerenciar o schema com migrações.
    // Por agora, vamos manter { alter: true } para ambos.

    await sequelize.sync(syncOptions); 
    console.log('Modelos sincronizados com o banco de dados.');

  } catch (error) {
    console.error(`Não foi possível conectar ou sincronizar com o banco de dados (${sequelize.getDialect()}):`, error);
    throw error; 
  }
};

export default sequelize;