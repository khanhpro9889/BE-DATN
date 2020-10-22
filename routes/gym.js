const express = require('express')
const router = express.Router()
const GymController = require('../controllers/Gym')
const uploadFiles = require('../middlewares/upload-files');

router.get('/', GymController.getAllGym);
router.post('/', uploadFiles.array('gallery', 10), GymController.addGym);
router.get('/user/:uid', GymController.getAllGymByUser);
router.delete('/:id', GymController.deleteGym);
router.get('/:id', GymController.getGymDetail);

module.exports = router;