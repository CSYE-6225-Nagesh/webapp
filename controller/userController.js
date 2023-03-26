import User from "../models/User.js";
import emailValidator from "email-validator";
import bcrypt from "bcryptjs";
import statsd from "../utils/statsdClient.js";

//Update User
export const updateUser = async (req, res) => {
  statsd.increment("user.update");
  const { first_name, last_name, password } = req.body;
  //Get user from updated req
  const newUser = req.authUser;
  try {
    //Check if user exists
    const user = await User.findOne({
      where: { username: newUser.name },
    });
    if (user) {
      if (user.id != req.params.userId) {
        return res.status(403).json({ message: "The user action Forbidden" });
      }
      if (
        req.body.id ||
        req.body.account_created ||
        req.body.account_updated ||
        req.body.username
      ) {
        return res.status(400).json({
          message: "Bad Request. Cannot update the fields entered",
        });
      }
      //Check if all required fields are present
      if (!first_name || !last_name || !password) {
        return res.status(400).json({
          message:
            "Bad Request. Please enter all the required fields (Firstname, Lastname, Password).",
        });
      }

      //Hashed Password
      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(12));

      user.first_name = first_name;
      user.last_name = last_name;
      user.password = hashedPassword;
      try {
        await user.save();
        res.sendStatus(204);
        return;
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      return res.status(404).json({ message: "User does not exist" });
    }
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

//Get User
export const getUser = (req, res) => {
  statsd.increment("user.get");
  const newUser = req.authUser;

  try {
    //Check if user exists
    User.findOne({
      where: { username: newUser.name },
    })
      .then((user) => {
        if (user) {
          if (user.id != req.params.userId) {
            return res
              .status(403)
              .json({ message: "The user action Forbidden" });
          } else {
            const {
              id,
              first_name,
              last_name,
              username,
              account_created,
              account_updated,
            } = user;
            let userDetails = {
              id,
              first_name,
              last_name,
              username,
              account_created,
              account_updated,
            };
            res.status(200).json(userDetails);
          }
        } else {
          return res.status(404).json({ message: "No such user" });
        }
      })
      .catch((err) => {
        res.status(500);
      });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// Create user
export const createUser = (req, res) => {
  statsd.increment("user.create");
  const { first_name, last_name, username, password } = req.body;
  try {
    //Check if illegal values are sent
    if (req.body.id || req.body.account_created || req.body.account_updated) {
      return res.status(400).json({
        message:
          "Bad Request: id, account created and updated details cannot be sent in payload",
      });
    }
    //Check if required fields are send
    if (!first_name || !last_name || !username || !password) {
      return res.status(400).json({
        message:
          "Bad Request: Required fields cannot be empty (Firstname, Lastname, Username, Passsword)",
      });
    }
    //Check if email address is valid
    if (!emailValidator.validate(username.toLowerCase())) {
      return res
        .status(400)
        .json({ message: "Bad Request: Enter a valid email address" });
    }

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(12));
    //User from request
    const user = {
      first_name,
      last_name,
      username,
      password: hashedPassword,
    };
    //Check if username already exists
    User.findOne({ where: { username: username } }).then((u) => {
      if (u) {
        return res
          .status(400)
          .json({ message: "Bad Request: Username already exists." });
      } else {
        User.create(user).then((data) => {
          const {
            id,
            first_name,
            last_name,
            username,
            account_created,
            account_updated,
          } = data;
          const userDetails = {
            id,
            first_name,
            last_name,
            username,
            account_created,
            account_updated,
          };
          return res.status(201).json(userDetails);
        });
      }
    });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};
