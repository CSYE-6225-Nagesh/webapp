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
      console.log("No such product");
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

      //Check if unauthenticated fields are updated
      console.log(product.owner_user_id);

      console.log(req.userId);

      if (product.owner_user_id != req.userId) {
        return res.status(403).json({ message: "The user action Forbidden" });
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

      if (quantity <= 0) {
        return res
          .status(400)
          .json({ message: "Bad Request: Quantity should be greater than 1" });
      }

      product.name = name ? name : product.name;
      product.description = description ? description : product.description;
      product.sku = sku ? sku : product.sku;
      product.manufacturer = manufacturer ? manufacturer : product.manufacturer;
      product.quantity = quantity ? quantity : product.quantity;

      try {
        product.save();
        res.sendStatus(204);
        return;
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      return res.status(404).json({ message: "Product does not exist" });
    }
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

export const createProduct = async (req, res) => {
  console.log("user id", req.userId);
  console.log("create user /v1/user/ has been hit");
  const { name, description, sku, manufacturer, quantity } = req.body;
  try {
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
    //Check if required fields are send
    if (!name || !description || !sku || !manufacturer || !quantity) {
      return res.status(400).json({
        message:
          "Bad Request: Required fields cannot be empty (name, description, sku, manufacturer, quantity)",
      });
    }
    //Check if quantity is greater than 0
    if (quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Bad Request: Quantity should be greater than 1" });
    }

    const product = {
      name,
      description,
      sku,
      manufacturer,
      quantity,
      owner_user_id: req.userId,
    };

    Product.create(product).then((data) => {
      return res.status(201).json(data);
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.productId });
    if (product && product.owner_user_id == req.userId) {
      Product.destroy({ where: { id: req.params.productId } }).then((data) => {
        return res.status(201).json(data);
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
      if (product.owner_user_id != req.userId) {
        return res.status(403).json({ message: "The user action Forbidden" });
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

      if (quantity <= 0) {
        return res
          .status(400)
          .json({ message: "Bad Request: Quantity should be greater than 1" });
      }

      product.name = name ? name : product.name;
      product.description = description ? description : product.description;
      product.sku = sku ? sku : product.sku;
      product.manufacturer = manufacturer ? manufacturer : product.manufacturer;
      product.quantity = quantity ? quantity : product.quantity;

      try {
        product.save();
        res.sendStatus(204);
        return;
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      return res.status(404).json({ message: "Product does not exist" });
    }
  } catch (err) {
    return res.status(400).json(err.message);
  }
};
