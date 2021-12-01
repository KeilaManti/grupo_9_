const express = require("express");
const router = express.Router();
const controller = require("../controllers/productsController.js");
let userSessionCheck = require('../middlewares/userSessionCheck');

router.get("/",  controller.products);
router.get("/productDetail/:id", controller.detail);

router.get("/productsFilter/:id", controller.filter);
router.get("/brandFilter/:id", controller.brandFilter);
router.get("/order/:id", controller.orderBy);

router.get('/cart', userSessionCheck, controller.cart)

module.exports = router;
