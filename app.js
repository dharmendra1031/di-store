const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000


const uri = "mongodb+srv://manigupta103:acRmWVQuGwNYdrGl@db.4szuolh.mongodb.net/?retryWrites=true&w=majority";

try {
  // Connect to the MongoDB cluster
  mongoose.set("strictQuery", false);
  mongoose.connect(
    uri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log(" Mongoose is connected"),
  );
} catch (e) {
  console.log("could not connect");
}

const dbConnection = mongoose.connection;
dbConnection.on("error", (err) => console.log(`Connection error ${err}`));
dbConnection.once("open", () => console.log("Connected to DB!"));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})