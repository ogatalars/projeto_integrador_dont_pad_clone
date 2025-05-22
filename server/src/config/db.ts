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
    logging: false, 
    pool: { 
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
  sequelize = new Sequelize(productionDbUrl, options);
} else {
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

    
    const syncOptions = process.env.NODE_ENV === 'production' ? { alter: true } : { alter: true };


    await sequelize.sync(syncOptions); 
    console.log('Modelos sincronizados com o banco de dados.');

  } catch (error) {
    console.error(`Não foi possível conectar ou sincronizar com o banco de dados (${sequelize.getDialect()}):`, error);
    throw error; 
  }
};

export default sequelize;