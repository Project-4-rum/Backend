DATABASE_URL = "mongodb://127.0.0.1:27018";

const http = require("http");
const app = require("./app");
// const { listFiles } = require("./models/files.model");

const mongoose = require("mongoose");

const PORT = process.env.PORT || 5050;

const server = http.createServer(app);
async function startServer() {
  mongoose.connect(DATABASE_URL, { useNewUrlParser: true });
  const db = mongoose.connection;

  db.on("error", (error) => console.error(error));
  db.once("open", () => console.log("Connected to local database"));

  // await listFiles();
  server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });
}
startServer();

//server.js
