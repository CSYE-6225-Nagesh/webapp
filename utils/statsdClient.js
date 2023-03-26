import statsDClient from "statsd-client";
const sdc = new statsDClient({ host: "localhost", port: 8125, debug: true });

export default sdc;
