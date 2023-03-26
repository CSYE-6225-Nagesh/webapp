import statsd from "../utils/statsdClient.js";

function checkHealth(req, res) {
  statsd.increment(`/health`);
  res.status(200).send({ message: "sever running" });
}

export default checkHealth;
