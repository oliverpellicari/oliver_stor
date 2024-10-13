const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors({ origin: '' })); 
app.get('/', (req, res) => {
    res.send({ status: 'Bien!' });
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});