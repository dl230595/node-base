//************************************ IMPORTAR LIBRERIAS ********************************
const express = require('express');
const router = express.Router();

//************************************ IMPORTAR CONTROLADORES ********************************
const PublicController = require('../controllers/PublicController');

//************************************ RUTAS *************************************************
//Home
router.get('/api/public', (req, res) => { return res.json('API Publica') });


router.get('/api/public/showAll', PublicController.showAll);


module.exports = router;