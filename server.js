const express = require("express");
let dbConnect = require("./db/dbConnect");
var indexRouter = require("./routes/index");

const app = express();
const port = 3000;

app.use(express.json());
app.use("/", indexRouter);

// Wywołaj dbConnect przed uruchomieniem serwera
dbConnect().then(() => {
  app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
  });
});
