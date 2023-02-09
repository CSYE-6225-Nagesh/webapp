import Sequelize from "sequelize";
import db from "../config/dbConfig.js";
import User from "./User.js";

const Product = db.define(
  "product",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    sku: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    manufacturer: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    owner_user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "date_added",
    updatedAt: "date_last_updated",
  }
);

export default Product;
