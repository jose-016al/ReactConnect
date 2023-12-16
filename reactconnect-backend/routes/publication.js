const express = require('express');
const router = express.Router();
const PublicationController = require("../controllers/publication");
const check = require("../middlewares/auth");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads/publications/");
    },
    filename: function(req, file, cb) {
        cb(null, "pub-" + Date.now() + file.originalname);
    }
});

const uploads = multer({storage: storage});

/* Rutas de pruebas */
router.post("/save", check.auth, PublicationController.save);
router.get("/show/:id", check.auth, PublicationController.show);
router.delete("/remove/:id", check.auth, PublicationController.remove);
router.get("/user/:id/:page?", check.auth, PublicationController.user);
router.post("/upload/:id", [check.auth, uploads.single("file0")], PublicationController.upload);
router.get("/media/:file", PublicationController.media);
router.get("/feed/:page?", check.auth, PublicationController.feed);

module.exports = router;