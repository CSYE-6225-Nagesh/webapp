import Image from "../models/Image.js";
import Product from "../models/Product.js";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { uploadFile, deleteFile } from "../utils/s3.js";
import statsd from "../utils/statsdClient.js";

export const getAllImages = async (req, res) => {
  statsd.increment("images.getAll");
  try {
    const product = await Product.findOne({
      where: { id: req.params.productId },
    });
    if (!product) {
      return res.status(404).json({ message: "no product found" });
    }
    if (product.owner_user_id == req.user.id) {
      const images = await Image.findAll({
        where: {
          [Op.and]: [{ product_id: req.params.productId }],
        },
      });
      if (images.length > 0) {
        res.status(200).json(images);
      } else {
        return res.status(404).json({ message: "No images found for product" });
      }
    } else {
      return res.status(403).json({ message: "User action forbidden" });
    }
  } catch (err) {
    res.status(400).json(err.message);
  }
};

export const getImage = async (req, res) => {
  statsd.increment("images.get");
  try {
    const product = await Product.findOne({
      where: { id: req.params.productId },
    });
    if (!product) {
      return res.status(404).json({ message: "no product found" });
    }
    if (product.owner_user_id == req.user.id) {
      const image = await Image.findOne({
        where: {
          [Op.and]: [
            { product_id: req.params.productId },
            { image_id: req.params.imageId },
          ],
        },
      });
      if (image) {
        res.status(200).json(image);
      } else {
        return res.status(404).json({ message: "No such image" });
      }
    } else {
      return res.status(403).json({ message: "User action forbidden" });
    }
  } catch (err) {
    res.status(400).json(err.message);
  }
};

export const deleteImage = async (req, res) => {
  statsd.increment("images.delete");
  try {
    const product = await Product.findOne({
      where: { id: req.params.productId },
    });
    if (!product) {
      return res.status(404).json({ message: "no product found" });
    }
    if (product.owner_user_id == req.user.id) {
      const image = await Image.findOne({
        where: {
          [Op.and]: [
            { product_id: req.params.productId },
            { image_id: req.params.imageId },
          ],
        },
      });

      if (image) {
        await deleteFile(image.file_name);
        Image.destroy({ where: { image_id: req.params.imageId } }).then(
          (data) => {
            return res.status(204).json(data);
          }
        );
      } else {
        return res.status(404).json({ message: "Image not found" });
      }
    } else {
      return res.status(403).json({ message: "Delete image forbidden" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const addImage = async (req, res) => {
  statsd.increment("images.add");
  if (!req.file) {
    return res.status(400).json({ message: "please attach file" });
  }
  const fileName = `${uuidv4()} ${req.file.originalname}`;
  const fileBuffer = req.file.buffer;
  try {
    const product = await Product.findOne({
      where: { id: req.params.productId },
    });
    if (!product) {
      return res.status(404).json({ message: "no product found" });
    }
    if (product.owner_user_id == req.user.id) {
      await uploadFile(fileBuffer, fileName, req.file.mimetype);
      const image = {
        product_id: req.params.productId,
        file_name: fileName,
        s3_bucket_path: `${process.env.AWS_BUCKET_NAME}/${fileName}`,
      };
      const data = await Image.create(image);
      res.status(201).json(data);
    } else {
      res.status(403).json({ message: "forbidden" });
    }
  } catch (err) {
    console.error(err);
  }
};
