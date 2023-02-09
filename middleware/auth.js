import auth from "basic-auth";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const authentication = async (req, res, next) => {
  try {
    const authUser = auth(req);

    if (!req.get("authorization")) {
      return res.status(401).json({ message: "The user is unauthorized" });
    }

    if (!authUser.name || !authUser.pass) {
      return res.status(401).json({ message: "The user is unauthorized" });
    }

    req.authUser = authUser;

    try {
      User.findOne({
        where: { username: authUser.name },
      }).then((user) => {
        if (user) {
          const isPasswordCorrect = bcrypt.compareSync(
            authUser.pass,
            user.password
          );

          if (!isPasswordCorrect) {
            return res
              .status(401)
              .json({ message: "The user is unauthorized" });
          }
          req.user = user;
          next();
        } else {
          res.status(401).json({ message: "The user is unauthorized" });
        }
      });
    } catch (err) {
      res.status(500).json(err.message);
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export default authentication;
