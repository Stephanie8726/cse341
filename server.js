const express = require('express');
const bodyParser = require('body-parser')
const mongodb = require('./data/database');
const app = express();
const createError = require('http-errors'); // week 3

const port = process.env.PORT || 3000

app.use(bodyParser.json()); // comes first before requiring the route
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});
app.use('/', require('./routes'));


// 404 handler - must come after all routes
app.use((req, res, next) => {
    next(createError(404, 'Not found'));
});

// general error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            status: err.status || 500,
            message: err.message || 'Internal Server Error'
        }
    });
});


mongodb.initDb((err) => {
    if(err) {
        console.log(err);
    }
    else{
        app.listen(port, () => {console.log(`Database is listening and node running on port ${port}`)});
    }
});