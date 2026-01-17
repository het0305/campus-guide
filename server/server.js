require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const api = require('./routes/api');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', api);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/campus';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Mongo connect error', err));
