import auth from "basic-auth";

const authentication = async (req, res, next) => {
  try {
    const authUser = auth(req);

    if (!req.get("authorization")) {
      return res
        .status(403)
        .json({ message: "Enter username and password for authentication" });
    }

    if (!authUser.name || !authUser.pass) {
      return res
        .status(403)
        .json({ message: "Enter username and password for authentication" });
    }
    req.authUser = authUser;
    next();
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export default authentication;
