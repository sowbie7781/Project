"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resourceController_1 = require("../controllers/resourceController");
const router = (0, express_1.Router)();
router.get('/', resourceController_1.getResources);
exports.default = router;
