const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require('path');
const authMiddleware = require('./middlewares/jwt')
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');


const contactsRouter = require("./routes/api/contacts");
const usersRouter = require('./routes/api/users');

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

require('./config/passport');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Phonebook API',
      version: '1.0.0',
      description: 'API for Phonebook'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },
  apis: ['./routes/api/*.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use("/api/contacts", authMiddleware, contactsRouter);
app.use("/api/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
