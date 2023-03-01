import Sequelize from "sequelize";
import db from "../config/dbConfig.js";

const Image = db.define(
  "image",
  {
    image_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    file_name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    s3_bucket_path: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "product",
        key: "id",
      },
    },
  },
  {
    updatedAt: false,
    freezeTableName: true,
    timestamps: true,
    createdAt: "date_created",
  }
);

export default Image;
