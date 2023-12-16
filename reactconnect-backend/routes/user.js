const express = require('express');
const router = express.Router();
const UserController = require("../controllers/user");
const check = require("../middlewares/auth");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads/avatars");
    },
    filename: function(req, file, cb) {
        cb(null, "avatar-" + Date.now() + file.originalname);
    }
});

const uploads = multer({storage: storage});

/* Rutas de pruebas */
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:id", check.auth, UserController.profile);
router.get("/get-users/:page?", check.auth, UserController.getUsers);
router.put("/update", check.auth, UserController.update);
router.post("/upload", [check.auth, uploads.single("file0")], UserController.upload);
router.get("/avatar/:file", UserController.avatar);
router.get("/counters/:id", check.auth, UserController.counters);

module.exports = router;