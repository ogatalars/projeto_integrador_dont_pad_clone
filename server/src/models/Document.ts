import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeInstance from '../config/db';
import User, { UserInstance } from './User'; 
import { nanoid } from 'nanoid';

interface DocumentAttributes {
  id: number;
  slug: string; // Identificador único na URL
  content: string; // Conteúdo do "pad"
  ownerId: number; // Chave estrangeira para o User dono
  editToken?: string | null; // Token opcional para permitir edição por não-proprietários
  createdAt?: Date;
  updatedAt?: Date;
}

// Para criação, id, slug, editToken, createdAt, updatedAt podem ser omitidos
// O slug será gerado automaticamente.
interface DocumentCreationAttributes extends Optional<DocumentAttributes, 'id' | 'slug' | 'editToken' | 'createdAt' | 'updatedAt'> {}

export interface DocumentInstance extends Model<DocumentAttributes, DocumentCreationAttributes>, DocumentAttributes {
  // Se precisarmos de métodos de instância específicos ou associações tipadas, adicionamos aqui
  User?: UserInstance; // Para quando incluímos a associação com User
}

const Document = sequelizeInstance.define<DocumentInstance>(
  'Document',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      defaultValue: () => nanoid(10), // Gera um ID de 10 caracteres. Ajuste o tamanho se desejar.
    },
    content: {
      type: DataTypes.TEXT, // TEXT é bom para conteúdos longos
      allowNull: false,
      defaultValue: '', // Começa com conteúdo vazio
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, // Referencia o modelo User
        key: 'id',   // A coluna 'id' no modelo User
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE', // Se um usuário for deletado, seus documentos também serão. Pode mudar para SET NULL se ownerId puder ser nulo.
    },
    editToken: {
      type: DataTypes.STRING,
      allowNull: true, // Opcional
      unique: false,   // Pode ser nulo, então não precisa ser globalmente único se for nulo. Se não for nulo, idealmente deveria ser único por documento ou mais complexo.
                       // Para simplificar, manteremos ele assim. A lógica de validação será no controller.
    },
    // createdAt e updatedAt são gerenciados automaticamente pelo Sequelize (timestamps: true é padrão)
  },
  {
    tableName: 'documents',
    timestamps: true,
  }
);

// Definindo a Associação: Um Documento pertence a um Usuário (Owner)
Document.belongsTo(User, {
  foreignKey: 'ownerId',
  as: 'owner', // Alias para a associação, ex: doc.getOwner() ou incluir 'owner'
});
// E um Usuário pode ter muitos Documentos
User.hasMany(Document, {
  foreignKey: 'ownerId',
  as: 'documents', // Alias, ex: user.getDocuments() ou incluir 'documents'
});

export default Document;