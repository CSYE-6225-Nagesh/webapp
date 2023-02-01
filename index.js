import connectDatabase from "./utils/db.js";
import app from "./server.js";

(async () => {
  await connectDatabase();
})();

export const start = async () => {
  try {
    app.listen(process.env.PORT, () => {
      console.log(`starting server on port`);
    });
  } catch (e) {
    console.error(e);
  }
};

try {
  start();
} catch (error) {
  console.log(error);
}
