import User from "../models/User.js";

const user = async (req, res, next) => {
  console.log("user middleware");
  const newUser = req.authUser;
  try {
    User.findOne({
      where: { username: newUser.name },
    }).then((user) => {
      if (user) {
        const { id } = user;
        req.userId = id;
      }
      next();
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export default user;
