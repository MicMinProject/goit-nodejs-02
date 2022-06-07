const app = require('./app');
const mongoose = require("mongoose");
require('dotenv').config();
const {createFolderIfNotExist, uploadDir, storeDir} = require('./helpers')

mongoose
  .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
  app.listen(3000, () => {
    createFolderIfNotExist(uploadDir);
    createFolderIfNotExist(storeDir);
    console.log("Database connection successful");
    console.log("Server running. Use our API on port: 3000")
  })
})
  .catch((error) => {
    console.log(error.message);
    console.log("Failed connecting database");
    console.log("Server not running");
    process.exit(1);
  });

