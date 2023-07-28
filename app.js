const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { ERROR_NOT_FOUND,PASSWORD } = require("./utils/utils");

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect(
  `mongodb+srv://ushakovsky95:${PASSWORD}.nj8wwnn.mongodb.net/`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: "",
  };

  next();
});

app.use("/", require("./routes/users"));
app.use("/", require("./routes/cards"));

app.use((req, res) =>
  res.status(ERROR_NOT_FOUND).send({ message: "Страница не найдена" })
);

app.listen(PORT);