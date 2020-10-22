const express = require('express')
const router = express.Router()
const uploadFiles = require('../middlewares/upload-files');
const multiparty = require('connect-multiparty');
const multipartyMiddleWare = multiparty({uploadDir: './uploads'});
const path = require('path');
const fs = require('fs');

router.post("/", multipartyMiddleWare, (req, res, next) => {
    const path = req.files.upload.path.replace('\\', '/');
    res.status(200).json({
        uploaded: true,
        url: `http://localhost:3001/${path}`
    })
});

router.post('/multi-uploads', uploadFiles.array('images', 10), (req, res) => {
    console.log(req.files);
    res.status(200).json({messages: 'successfully'});
})

module.exports = router;
