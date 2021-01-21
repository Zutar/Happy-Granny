const express = require('express');
const {Pool} = require('pg');
const config = require('./config');


const conectionString= `postgres://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.dbName}`
const client= new Pool({
    connectionString:conectionString,
    ssl: { rejectUnauthorized: false }
})


client.connect((err) => {
    if (err) {
        return console.error("Error: " + err.message);
    }
    else{   
        console.log("Connection to MySQL server successfully established");
        
        const app = express();
        const index = require('./routes/index')(client);
        app.set('view engine', 'ejs');
        app.use('/', index);
        
        app.listen(config.port, config.host, () => {
            console.log(`Server running on: http://localhost:${config.port}`);
        });
    }
});
