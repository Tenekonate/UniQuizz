const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();
require("./start-mongo")();
const app = express();

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB,
      collection: "sessions",
    }),
    cookie: {
      // maxAge: 1000 * 60 * 10, // cookie a une durée de vie 3 minutes
      sameSite: true,
    },
  })
);

app.set("views", "public"); // le dossier qui contient les fichier.pug
app.set("view engine", "pug"); // express => rep.render("fichier")
app.use(express.static("public"));

app.use("/", require("./src/App"));

app.listen(8080, () => console.log("API is running on port 8080"));
