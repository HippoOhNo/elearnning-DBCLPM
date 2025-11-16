const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    // .connect("mongodb://mongo:27017/mydb", {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // })
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`mongod connected with server: ${data.connection.host}`);
    });
};

module.exports = connectDatabase;
