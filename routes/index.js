const router = require('express').Router(); 

router.get('/', (req, res) => {res.send('Hello World');});

router.use('/users', require('./users')); //gonna look for users.js file under routes

module.exports = router;