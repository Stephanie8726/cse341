const router = require('express').Router(); 

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    //#swagger.tags=['Hello World]
    res.send('My Node Project');
});

router.use('/contacts', require('./contacts')); //gonna look for contacts.js file under routes

module.exports = router;