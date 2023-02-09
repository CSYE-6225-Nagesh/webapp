function checkHealth(req, res) {
  res.status(200).send({ message: "sever running" });
}

export default checkHealth;
