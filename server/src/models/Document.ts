import { DataTypes, Model, Optional } from "sequelize";
import sequelizeInstance from "../config/db";
import User, { UserInstance } from "./User";
import { nanoid } from "nanoid";

interface DocumentAttributes {
  id: number;
  slug: string;
  content: string;
  ownerId: number;
  editToken?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DocumentCreationAttributes
  extends Optional<
    DocumentAttributes,
    "id" | "slug" | "editToken" | "createdAt" | "updatedAt"
  > {}

export interface DocumentInstance
  extends Model<DocumentAttributes, DocumentCreationAttributes>,
    DocumentAttributes {
  User?: UserInstance;
}

const Document = sequelizeInstance.define<DocumentInstance>(
  "Document",
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
      defaultValue: () => nanoid(10),
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    editToken: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
  },
  {
    tableName: "documents",
    timestamps: true,
  }
);

Document.belongsTo(User, {
  foreignKey: "ownerId",
  as: "owner",
});

User.hasMany(Document, {
  foreignKey: "ownerId",
  as: "documents",
});

export default Document;
