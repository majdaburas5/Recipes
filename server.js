const express = require("express");
const path = require("path");
const app = express();
const api = require("./server/api");
const port = 3000;

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "node_modules")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", api);
app.listen(port, function () {
  console.log(`Server running on port ${port}`);
});
