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
        const query = `SELECT p.id, p.name, p.price, p.weight, p.timestamp, p.image, s.url, s.search_url, s.name shop_name, p.url FROM products p JOIN shop s ON p.shopId=s.id WHERE wave = (SELECT MAX(wave) FROM products);`;
        const chart_query = `SELECT AVG(price/weight), wave, timestamp FROM products WHERE weight != 0 AND price != 0 GROUP BY wave, timestamp ORDER BY wave;`;
        client.query(query, (error, result, fields) => {
            client.query(chart_query, (e, r, f) => {
                if(result.rows){
                    res.send({status: true, data: result.rows, chart: r.rows});
                }else{
                    res.send({status: false, data: result.rows, chart: r.rows});
                }
            });
        });
    });

    return router;
});