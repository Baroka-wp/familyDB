const express = require('express');
const cors = require('cors');
const { indexRoutes } = require('./src/routes/index');


require('dotenv').config();


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Welcome to the beginning of nothingness !'
    });
});


app.use('/api/v1/index', indexRoutes);

// run server
app.listen(process.env.PORT, () => {
    console.log(` App listening at http://localhost:${process.env.PORT}`);
  });
  
  
  module.exports = app;