const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const auth = require('../middleware/auth');

router.post('/', auth, brandController.createBrand);
router.get('/', auth, brandController.getBrands);
router.get('/:id', auth, brandController.getBrandById);
router.put('/:id', auth, brandController.updateBrand);
router.delete('/:id', auth, brandController.deleteBrand);

module.exports = router;
