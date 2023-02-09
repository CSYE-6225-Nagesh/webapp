import Sequelize from "sequelize";
import db from "../config/dbConfig.js";

const User = db.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "account_created",
    updatedAt: "account_updated",
  }
);

export default User;
