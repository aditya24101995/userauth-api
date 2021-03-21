const mongoose = require("mongoose");

const conn = async () => {
  const connection = await mongoose.connect(process.env.DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = conn;
