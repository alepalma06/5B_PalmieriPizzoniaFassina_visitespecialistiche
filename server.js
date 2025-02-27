const express = require("express");
const http = require('http');
const path = require('path');
const app = express();
const database = require("./database");
database.createTable();

app.use(express.json()); 
app.use("/", express.static(path.join(__dirname, "public")));
app.post("/insert", async (req, res) => {
  const booking = req.body.booking;
  try {
    await database.insert(booking);
    res.json({result: "ok"});
  } catch (e) {
    res.status(500).json({result: "ko"});
  }
})
app.get('/booking', async (req, res) => {
    const list = await database.select();
    res.json(list);
});
app.get('/types', async (req, res) => {
    const types = await database.getTypes();
    res.json(types);
});
app.delete('/delete/:id', async (req, res) => {
  await database.delete(req.params.id);
  res.json({result: "ok"});
})
const server = http.createServer(app);
const port = 5600;
server.listen(port, () => {
  console.log("- server running on port: " + port);
});