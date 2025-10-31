const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const auth = require('../middleware/auth');

router.post('/export', auth, exportController.exportProducts);
router.post('/templates', auth, exportController.saveTemplate);
router.get('/templates', auth, exportController.getTemplates);
router.delete('/templates/:id', auth, exportController.deleteTemplate);

module.exports = router;
