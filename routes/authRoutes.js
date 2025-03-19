const express = require("express");
const { register, login, guestAdminLogin } = require("../controllers/authController.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/guest-admin-login", guestAdminLogin)

module.exports = router;



