const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const dotenv = require("dotenv").config();
const config = require("./config");
const app = express();
const api = require("./api");

const accessLogStream = fs.createWriteStream(path.join(`${__dirname}/${config.server.logs.dir}`, 'access.log'), { flags: 'a' });

app.use(express.json());
app.use(cors());
app.use(morgan('combined', { stream: accessLogStream}));
app.use("/api", api);

config.env === "development" &&
  mongoose.connect(
    `mongodb://${config.database.development.host}/${config.database.development.name}`,
    //`mongodb://localhost/twitter`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log("Conectado a la base de datos");
    }
  );
config.env === "production" &&
  mongoose.connect(
   //`mongodb+srv://${config.database.production.user}:${config.database.production.password}@${config.database.production.host}/${config.database.development.name}`,
   `mongodb://localhost/twitter`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log("Conectado a la base de datos");
    }
  );

  //console.log("Conectdo a: " + config.env);

const server = app.listen(
  config.server.port,
  config.server.host,
  () => {
    console.log(
      `Servidor iniciado en el puerto ${server.address().port} en modo ${
        config.env
      }`
    );
  }
);
