const express = require('express');
const config = require('./config');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(config.port, config.host, () => {
    console.log(`Server running on: http://localhost:${config.port}`);
});