const router = require('express').Router();

const controller = require('../Controllers/CatController')

router.get('/api', controller.index)
router.post('/api/create', controller.create)
router.put('/api/update/:id', controller.update)
router.delete('/api/delete/:id', controller.delete)

module.exports = router