import User from "../models/User.js";
import emailValidator from "email-validator";
import bcrypt from "bcryptjs";

//Update User
export const updateUser = (req, res) => {
  console.log("updateUser");
  const { first_name, last_name, password } = req.body;
  //Get user from updated req
  const newUser = req.authUser;
  try {
    //Check if user exists
    User.findOne({
      where: { username: newUser.name },
    })
      .then((user) => {
        console.log(user);
        if (user) {
          console.log("User exists");
          //Check if passwords are same
          const isPasswordCorrect = bcrypt.compareSync(
            newUser.pass,
            user.password
          );

          if (isPasswordCorrect) {
            //Check if unauthenticated fields are updated
            if (user.id != req.params.userId) {
              console.log("Id wrong");
              return res
                .status(403)
                .json({ message: "The user action Forbidden" });
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
            const hashedPassword = bcrypt.hashSync(
              password,
              bcrypt.genSaltSync(12)
            );

            user.first_name = first_name;
            user.last_name = last_name;
            user.password = hashedPassword;
            try {
              user.save();
              res.sendStatus(204);
              return;
            } catch (err) {
              return res.status(500).json({ message: err.message });
            }
          } else {
            return res
              .status(401)
              .json({ message: "The user is unauthorized" });
          }
        } else {
          return res.status(404).json({ message: "User does not exist" });
        }
      })
      .catch((err) => {
        return res.status(500).json({ message: err.message });
      });
  } catch (err) {
    return res.status(400).json(err.message);
  }
};

//Get User
export const getUser = (req, res) => {
  console.log("Endpoint getUser has been hit");
  //Get user from updated req
  const newUser = req.authUser;
  try {
    //Check if user exists
    User.findOne({
      where: { username: newUser.name },
    })
      .then((user) => {
        if (user) {
          console.log("User exists");
          const isPasswordCorrect = bcrypt.compareSync(
            newUser.pass,
            user.password
          );

          if (!isPasswordCorrect) {
            return res
              .status(401)
              .json({ message: "The user is unauthorized" });
          } else if (isPasswordCorrect && user.id != req.params.userId) {
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
          console.log("No such user");
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
  console.log("create user /v1/user/ has been hit");
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
    console.log(user);
    //Check if username already exists
    User.findOne({ where: { username: username } }).then((u) => {
      if (u) {
        console.log("Bad Request: Username already exists.");
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
          console.log("User successfully created!");
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
