module.exports = (function(client){
    'use strict'
    const path = require('path');
    const express = require('express');
    const bodyParser = require('body-parser');

    const router = express.Router();

    router.use('/static', express.static(path.join(__dirname + '/../static'))); // Set default static files path
    router.use(bodyParser.json({limit:'5mb'}));
    router.use(bodyParser.urlencoded({
        extended: true,
        limit:'5mb'
    }));

    router.get('/', (req, res) => {
        res.render('./pages/index.ejs');
    });
    
    router.get('/products', (req, res) => {
        const query = `SELECT * FROM products WHERE wave = (SELECT MAX(wave) FROM products);`;
        this.client.query(query, (error, result, fields) => {
            res.send(result.rows);
        });
    });

    return router;
});