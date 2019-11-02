const express = require('express');

const publicController = require('../controllers/public.js');

const router = express.Router();

// '/' => GET Index Page.
router.get('/', publicController.getIndex);

// '/language-translation' => POST the language and its code.
router.post('/language-translation', publicController.postTranslation);

router.get('/data/index_list.json', publicController.getData);

// '/results?search=XYZ' => GET Results Page.
router.get('/results', publicController.getResults);

module.exports = router;