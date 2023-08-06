const http = require("http");
const app = require("./app");
// const { listFiles } = require("./models/files.model");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
async function startServer() {
  // await listFiles();
  server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });
}
startServer();
