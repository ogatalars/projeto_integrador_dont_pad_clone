import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import bcrypt from 'bcrypt';


interface UserAttributes {
  id?: number; 
  email: string;
  password?: string; 
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserInstance extends Model<UserAttributes, Optional<UserAttributes, 'id'>>, UserAttributes {}

const User = sequelize.define<UserInstance>(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Por favor, forneça um endereço de e-mail válido.',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 255],
          msg: 'A senha deve ter pelo menos 6 caracteres.',
        },
      },
    },
  },
  {
   
    tableName: 'users', 
    timestamps: true, 
    hooks: {
      beforeCreate: async (user: UserInstance) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user: UserInstance) => {
       
        if (user.changed('password') && user.password) {
          if (!user.password.startsWith('$2') || user.password.length !== 60) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        }
      }
    },
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password'] },
      }
    }
  }
);

// Método de instância para verificar a senha (opcional, pode ser feito no controller)
// Se você preferir fazer no controller, pode remover este método.
 (User.prototype as any).validPassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
 };


export default User;