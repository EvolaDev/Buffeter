const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

const app = express();

app.use(express.json({ extended: true }));
app.use('/api/auth', require('./srv/routes/auth.routes'));

const PORT = config.get('port') || 5000;

async function connect() {
  try {
    /*await mongoose.connect(config.get('mongoURI'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });*/
    app.listen(PORT, () => {
      console.log(`application has been started at port ${PORT}...`);
    });
  } catch (error) {
    throw new Error(`Server is not responded\n${error}`);
    // process.exit() is not reachable because 'throw' already terminate process;
  }
}
connect();
