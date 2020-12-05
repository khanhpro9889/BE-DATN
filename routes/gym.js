const express = require('express')
const router = express.Router()
const GymController = require('../controllers/Gym')
const uploadFiles = require('../middlewares/upload-files');

router.post('/delete/:id', GymController.deleteGym1st);
router.post('/verify-delete/:id', GymController.deleteGym2nd);
router.get('/top-rating', GymController.getTopRatingGym);
router.get('/search', GymController.search)
router.get('/top-week', GymController.getTopWeek);
router.get('/get-quantity-hn-dn-hcm', GymController.getQuantityDHH);
router.get('/get-newest-gym', GymController.getNewestGym);
router.get('/to-update/:id', GymController.getGymDetailToUpdate);
router.get('/', GymController.getAllGym);
router.post('/', GymController.addGym);
router.get('/user/:uid', GymController.getAllGymByUser);
router.delete('/:id', GymController.deleteGym);
router.get('/:id', GymController.getGymDetail);
router.patch('/update-gym-form-data/:id', uploadFiles.array('gallery', 10), GymController.updateGymFormData);
router.patch('/approve/:id', GymController.approveGym);
router.patch('/:id', GymController.updateGym);

module.exports = router;