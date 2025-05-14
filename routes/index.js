const router = require('express').Router(); 

router.get('/', (req, res) => {res.send('Hello World');});

router.use('/contacts', require('./contacts')); //gonna look for contacts.js file under routes

module.exports = router;