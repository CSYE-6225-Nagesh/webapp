import Sequelize from "sequelize";
import * as dotenv from "dotenv";
import os from "os";
import path from "path";

dotenv.config();

console.log("DB Name", process.env.DB_NAME);
//DB Connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER_NAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

export default sequelize;
