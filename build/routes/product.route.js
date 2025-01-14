"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const productRouter = (0, express_1.Router)();
productRouter.get('/', controllers_1.productController.getProducts);
exports.default = productRouter;
