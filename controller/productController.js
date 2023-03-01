import Product from "../models/Product.js";

export const getProduct = async (req, res) => {
  console.log("Endpoint getProduct has been hit");
  try {
    const product = await Product.findOne({
      where: { id: req.params.productId },
    });
    if (product) {
      res.status(200).json(product);
    } else {
      return res.status(404).json({ message: "No such product" });
    }
  } catch (err) {
    res.status(400).json(err.message);
  }
};

export const updateProduct = async (req, res) => {
  try {
    console.log(req.params.productId);
    const product = await Product.findOne({
      where: { id: req.params.productId },
    });
    if (product) {
      const { name, description, sku, manufacturer, quantity } = req.body;

      if (product.owner_user_id != req.user.id) {
        return res.status(403).json({ message: "The user action Forbidden" });
      }
      if (
        req.body.date_added ||
        req.body.date_last_updated ||
        req.body.owner_user_id ||
        req.body.id
      ) {
        return res.status(400).json({
          message:
            "Bad Request: Cannot update id, date_added,d ate_last_updated, owner_user_id fields",
        });
      }

      //Check if required fields are send
      if (
        !name ||
        !description ||
        !sku ||
        !manufacturer ||
        quantity === undefined
      ) {
        return res.status(400).json({
          message:
            "Bad Request: Required fields cannot be empty (name, description, sku, manufacturer, quantity)",
        });
      }
      if (!Number.isInteger(quantity)) {
        return res.status(400).json({
          message: "Bad Request: quantity should be integer",
        });
      }

      if (quantity < 0 || quantity > 100) {
        return res.status(400).json({
          message:
            "Bad Request: Quantity should be greater than 0 and less than 100",
        });
      }

      product.name = name ? name : product.name;
      product.description = description ? description : product.description;
      product.sku = sku ? sku : product.sku;
      product.manufacturer = manufacturer ? manufacturer : product.manufacturer;
      product.quantity = quantity !== undefined ? quantity : product.quantity;

      try {
        await product.save();
        return res.sendStatus(204);
      } catch (error) {
        console.log("error updating");
        if (
          error.errors &&
          error.errors.length > 0 &&
          error.errors[0].path === "sku"
        ) {
          return res.status(400).json({ message: "SKU already exists" });
        }
        return res.status(400).json({ message: "Cannot add product" });
      }
    } else {
      return res.status(404).json({ message: "Product does not exist" });
    }
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

export const createProduct = async (req, res) => {
  console.log("create user /v1/user/ has been hit");
  const { name, description, sku, manufacturer, quantity } = req.body;
  try {
    if (
      req.body.date_added ||
      req.body.date_last_updated ||
      req.body.owner_user_id ||
      req.body.id
    ) {
      return res.status(400).json({
        message:
          "Bad Request: Cannot create with id, date_added, date_last_updated, owner_user_id fields",
      });
    }
    //Check if required fields are send
    if (
      !name ||
      !description ||
      !sku ||
      !manufacturer ||
      quantity === undefined
    ) {
      return res.status(400).json({
        message:
          "Bad Request: Required fields cannot be empty (name, description, sku, manufacturer, quantity)",
      });
    }

    if (!Number.isInteger(quantity)) {
      return res.status(400).json({
        message: "Bad Request: quantity should be number",
      });
    }

    if (quantity < 0 || quantity > 100) {
      return res.status(400).json({
        message:
          "Bad Request: Quantity should be greater than 1 and less than 100",
      });
    }

    const product = {
      name,
      description,
      sku,
      manufacturer,
      quantity: Number(quantity),
      owner_user_id: req.user.id,
    };

    try {
      const data = await Product.create(product);
      return res.status(201).json(data);
    } catch (error) {
      console.log(error);
      if (
        error.errors &&
        error.errors.length > 0 &&
        error.errors[0].path === "sku"
      ) {
        return res.status(400).json({ message: "SKU already exists" });
      }
      return res.status(400).json({ message: "Cannot add product" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const images = await Image.findAll({
      where: { product_id: req.params.productD },
    });
    if (images.length > 0) {
      await Image.destroy({ where: { id: req.params.productId } });
    }
    const product = await Product.findOne({
      where: { id: req.params.productId },
    });
    if (product && product.owner_user_id == req.user.id) {
      Product.destroy({ where: { id: req.params.productId } }).then((data) => {
        return res.status(204).json(data);
      });
    } else {
      return res.status(403).json({ message: "Delete product forbidden" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const patchProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.productId },
    });
    if (product) {
      const { name, description, sku, manufacturer, quantity } = req.body;

      //Check if unauthenticated fields are updated
      if (product.owner_user_id != req.user.id) {
        return res.status(403).json({ message: "The user action Forbidden" });
      }

      if (
        !(
          name ||
          description ||
          (sku && sku.trim()) ||
          manufacturer ||
          quantity !== undefined
        )
      ) {
        return res.status(400).json({
          message: "Bad Request: update with proper paramters",
        });
      }
      if (
        req.body.date_added ||
        req.body.date_last_updated ||
        req.body.owner_user_id
      ) {
        return res.status(400).json({
          message:
            "Bad Request: Cannot update date_added,date_last_updated, owner_user_id fields",
        });
      }

      if (quantity !== undefined && !Number.isInteger(quantity)) {
        return res.status(400).json({
          message: "Bad Request:  quantity should be integer",
        });
      }

      if (sku !== undefined && sku === "") {
        return res.status(400).json({
          message: "Bad Request: sku should not be empty",
        });
      }

      if (quantity < 0 || quantity > 100) {
        return res.status(400).json({
          message:
            "Bad Request: Quantity should be greater than 0 and less than 100",
        });
      }

      product.name = name ? name : product.name;
      product.description = description ? description : product.description;
      product.sku = sku ? sku : product.sku;
      product.manufacturer = manufacturer ? manufacturer : product.manufacturer;
      product.quantity = quantity !== undefined ? quantity : product.quantity;

      try {
        await product.save();
        return res.sendStatus(204);
      } catch (error) {
        if (
          error.errors &&
          error.errors.length > 0 &&
          error.errors[0].path === "sku"
        ) {
          return res.status(400).json({ message: "SKU already exists" });
        }
        return res.status(400).json({ message: "Update product failed" });
      }
    } else {
      return res.status(404).json({ message: "Product does not exist" });
    }
  } catch (err) {
    return res.status(400).json(err.message);
  }
};
